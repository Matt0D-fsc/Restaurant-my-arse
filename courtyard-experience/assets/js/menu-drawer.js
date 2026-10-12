/**
 * MENU OVERLAY
 * Opens as a growing circle from the logo. Hovering a link recolours the field
 * and swaps the photo in the circle.
 */
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu-fullscreen');
  if (!menu) return;
  const img = menu.querySelector('[data-menu-img]');
  const baseBg = getComputedStyle(menu).backgroundColor;
  const baseImg = img && img.getAttribute('src');

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('no-scroll', open);
  };

  document.querySelectorAll('.nav-menu-plain').forEach(b => b.addEventListener('click', () => setOpen(true)));
  menu.querySelector('.burger-menu-close')?.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll('[data-close]').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  menu.querySelectorAll('.menu-nav-item').forEach(link => {
    link.addEventListener('mouseenter', () => {
      menu.style.backgroundColor = link.dataset.bg;
      if (img && link.dataset.img) img.src = link.dataset.img;
    });
    link.addEventListener('mouseleave', () => {
      menu.style.backgroundColor = baseBg;
      if (img) img.src = baseImg;
    });
  });
});
