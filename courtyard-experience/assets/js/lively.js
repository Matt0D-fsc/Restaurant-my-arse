/**
 * LIVELINESS LAYER
 * Things that react to you: live Dhaka-time corners, the ring cursor, plate rims,
 * the velocity marquee and the page's colour story.
 * Scroll-position pieces are exposed as window.courtyardLively() so app.js can
 * create them after its pinned sections exist (ScrollTrigger needs top-to-bottom order).
 */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Live corners: open status + Happy Hour countdown, always in Dhaka time ----------
  function dhakaNow() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
    }).formatToParts(new Date()).map(p => [p.type, p.value]));
    return { day: parts.weekday, h: +parts.hour + +parts.minute / 60 };
  }
  function updateCorners() {
    const { day, h } = dhakaNow();
    const opens = (day === 'Fri' || day === 'Sat') ? 9 : 12;   // Fri–Sat from 9 AM, otherwise noon; closes 11 PM
    const open = h >= opens && h < 23;
    const dot = document.querySelector('[data-open-dot]');
    const openText = document.querySelector('[data-open-text]');
    if (dot) dot.classList.toggle('closed', !open);
    if (openText) openText.textContent = open ? 'Open now · until 11 PM' : `Closed · opens ${h >= 23 ? 'tomorrow' : 'at ' + (opens === 9 ? '9 AM' : 'noon')}`;
    const happy = document.querySelector('[data-happy-text]');
    if (happy) {
      const left = 16 - h;
      happy.textContent = h >= 16 && h < 18 ? 'Happy Hour is on · until 6 PM'
        : left > 0 ? `Happy Hour in ${Math.floor(left)} h ${String(Math.round((left % 1) * 60)).padStart(2, '0')} m`
        : 'Happy Hour tomorrow · 4 PM';
    }
  }
  updateCorners();
  setInterval(updateCorners, 30000);

  // ---------- Plate rims: ingredients written around each plate ----------
  document.querySelectorAll('[data-ingredients]').forEach((plate, i) => {
    const text = plate.dataset.ingredients;
    plate.insertAdjacentHTML('beforeend', `
      <svg class="rim" viewBox="0 0 100 100" aria-hidden="true">
        <path id="rim-${i}" d="M50,50 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" fill="none"/>
        <text><textPath href="#rim-${i}">${text} ${text}</textPath></text>
      </svg>`);
  });

  // ---------- Ring cursor (mouse and trackpad only) ----------
  if (matchMedia('(pointer: fine)').matches && typeof gsap !== 'undefined') {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.innerHTML = '<img alt=""><span class="cursor-label"></span>';
    document.body.append(cursor);
    const img = cursor.querySelector('img'), label = cursor.querySelector('.cursor-label');
    const toX = gsap.quickTo(cursor, 'x', { duration: .45, ease: 'power3' });
    const toY = gsap.quickTo(cursor, 'y', { duration: .45, ease: 'power3' });
    addEventListener('mousemove', e => { toX(e.clientX); toY(e.clientY); }, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));

    document.addEventListener('mouseover', e => {
      const t = e.target;
      const preview = t.closest('[data-preview]');
      const plate = t.closest('.plate:not(.plate-more)');
      const tagged = t.closest('[data-cursor]');
      cursor.className = 'cursor';
      if (preview) { img.src = preview.dataset.preview; cursor.classList.add('is-preview'); }
      else if (plate) { label.textContent = plate.querySelector('figcaption span:last-child').textContent; cursor.classList.add('is-label'); }
      else if (tagged) { label.textContent = tagged.dataset.cursor; cursor.classList.add('is-label'); }
      else if (t.closest('a, button, input, select, label')) cursor.classList.add('is-link');
    });
  }

  // ---------- Scroll-position pieces, created by app.js after its pins ----------
  window.courtyardLively = function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Colour story: the whole page takes each section's colour as it arrives
    const THEMES = {
      cream: ['#F5F1E8', '#1A1715'],
      espresso: ['#2B211C', '#F3E9DC'],
      sage: ['#BFC5AF', '#34402F'],
      clay: ['#C9825B', '#24150E'],
    };
    // A pinned section's real extent is its pin-spacer, so measure that instead.
    const zones = [...document.querySelectorAll('[data-theme]')].map(el =>
      [el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el, el.dataset.theme]);
    let current;
    const paint = () => {
      const line = innerHeight * .55;
      const hit = zones.find(([z]) => { const r = z.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
      const name = hit ? hit[1] : 'cream';
      if (name === current) return;
      current = name;
      const [bg, ink] = THEMES[name];
      document.body.style.backgroundColor = bg;
      document.body.style.color = ink;
      document.body.dataset.theme = name;
    };
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: paint, onRefresh: paint });
    paint();

    // Velocity marquee: drifts on its own, speeds up and leans when you scroll
    const band = document.querySelector('[data-marquee]');
    if (band && !reduced) {
      const track = band.querySelector('.marquee-track');
      track.append(...[...track.children].map(n => n.cloneNode(true)));
      let x = 0, speed = 0, dir = 1, skew = 0;
      ScrollTrigger.create({
        trigger: band, start: 'top bottom', end: 'bottom top',
        onUpdate: s => { speed = Math.min(Math.abs(s.getVelocity()) / 120, 30); dir = s.direction; },
      });
      gsap.ticker.add(() => {
        speed *= .92;
        x -= (1.1 + speed) * dir;
        const half = track.scrollWidth / 2;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        skew += ((speed * dir * -.6) - skew) * .1;
        gsap.set(track, { x, skewX: gsap.utils.clamp(-12, 12, skew) });
      });
    }
  };
})();
