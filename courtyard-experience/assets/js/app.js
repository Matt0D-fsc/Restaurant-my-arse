/**
 * THE COURTYARD AT PARK HEIGHTS — CORE APPLICATION SCRIPT
 * GSAP Choreography, Lenis Smooth Scroll, SplitText Character Stagger
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PRELOADER TIMELINE
  const preloader = document.querySelector('.preloader');
  const preloaderBar = document.querySelector('.preloader-bar');
  
  if (preloader) {
    document.body.classList.add('no-scroll');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (preloaderBar) preloaderBar.style.width = '100%';
        
        setTimeout(() => {
          gsap.to(preloader, {
            yPercent: -100,
            duration: 1.1,
            ease: "power4.inOut",
            onComplete: () => {
              document.body.classList.remove('no-scroll');
              initHeroAnimations();
            }
          });
        }, 400);
      } else {
        if (preloaderBar) preloaderBar.style.width = `${progress}%`;
      }
    }, 120);
  } else {
    initHeroAnimations();
  }

  // 2. LENIS SMOOTH SCROLL INITIALIZATION
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // 3. SPLIT-TEXT CHARACTER HOVER ANIMATION (From latabledejoakim.fr)
  function splitToChars(el) {
    const text = el.textContent;
    el.textContent = "";
    const frag = document.createDocumentFragment();

    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.classList.add("char");
      span.innerHTML = ch === " " ? "&nbsp;" : ch;
      frag.appendChild(span);
    });

    el.appendChild(frag);
  }

  document.querySelectorAll(".hover-text").forEach((wrap) => {
    const top = wrap.querySelector(".top");
    const bottom = wrap.querySelector(".bottom");

    if (!top || !bottom) return;

    splitToChars(top);
    splitToChars(bottom);

    const topChars = top.querySelectorAll(".char");
    const bottomChars = bottom.querySelectorAll(".char");

    gsap.set(top, { yPercent: 0 });
    gsap.set(bottom, { yPercent: 100 });
    gsap.set(topChars, { y: 0, opacity: 1 });
    gsap.set(bottomChars, { y: 12, opacity: 0 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

    tl.to(top, { yPercent: -100, duration: 0.45 }, 0)
      .to(bottom, { yPercent: 0, duration: 0.45 }, 0)
      .to(topChars, {
        y: -12,
        opacity: 0,
        duration: 0.35,
        stagger: 0.02
      }, 0)
      .to(bottomChars, {
        y: 0,
        opacity: 1,
        duration: 0.40,
        stagger: 0.02
      }, 0.06);

    wrap.addEventListener("mouseenter", () => tl.play());
    wrap.addEventListener("mouseleave", () => tl.reverse());
  });

  // 4. SMART STICKY NAVIGATION (Auto-hide on scroll down, show on scroll up)
  const navWrapper = document.querySelector('.nav-wrapper');
  let lastScrollY = window.scrollY;
  const delta = 6;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (navWrapper) {
      if (currentScrollY > 60) {
        navWrapper.classList.add('nav-scrolled');
      } else {
        navWrapper.classList.remove('nav-scrolled');
      }

      if (Math.abs(currentScrollY - lastScrollY) >= delta) {
        if (currentScrollY > 240 && currentScrollY > lastScrollY) {
          navWrapper.classList.add('nav-hidden');
        } else {
          navWrapper.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;
      }
    }

    // Scroll-to-Top Button Visibility
    const scrollTopBtn = document.querySelector('.scrolltop');
    if (scrollTopBtn) {
      if (currentScrollY > 400) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }
  });

  // Scroll to top click
  const scrollTopBtn = document.querySelector('.scrolltop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // 5. GSAP HERO VISUAL STORYTELLING ENTRANCE (Joakim Choreography)
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    // Explicitly set initial states
    gsap.set(".reveal-line", { yPercent: 120, opacity: 0 });

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Background image slow scale-in & atmospheric settling
    heroTl.fromTo(".hero-bg-img", 
      { scale: 1.12, filter: "brightness(0.4) saturate(1.3)" },
      { scale: 1.05, filter: "brightness(0.68) saturate(1.15)", duration: 1.8, ease: "power2.out" },
      0
    );

    // 2. Navigation items graceful drop
    heroTl.fromTo(".nav-left, .nav-brand-center, .nav-right", 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 
      0.2
    );

    // 3. Left Column: Dossier Typewriter Animation
    const typewriterEl = document.querySelector('[data-typewriter-text]');
    if (typewriterEl) {
      const fullText = typewriterEl.getAttribute('data-typewriter-text') || '';
      typewriterEl.textContent = '';
      
      [...fullText].forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        typewriterEl.appendChild(span);
      });

      const charSpans = typewriterEl.querySelectorAll('span');
      heroTl.to(charSpans, {
        opacity: 1,
        duration: 0.01,
        stagger: 0.015,
        ease: "none"
      }, 0.4);
    }

    // 4. Center Column: Monumental Title Masked Line Reveals
    heroTl.to(".reveal-line", {
      yPercent: 0,
      opacity: 1,
      duration: 1.3,
      stagger: 0.15,
      ease: "power4.out"
    }, 0.6);

    // 5. Right Column: Blur-to-Focus Drift
    heroTl.fromTo(".hero-blur-text",
      { x: 35, opacity: 0, filter: "blur(10px)" },
      { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
      1.1
    );

    // 6. Center CTA: Fade up & Underline drawing
    heroTl.fromTo(".hero-cta-box",
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
      1.4
    );

    heroTl.to(".hero-cta-underline", {
      width: "100%",
      duration: 1.1,
      ease: "power2.inOut"
    }, 1.5);

    // ScrollTrigger Pinned & Stagger Sections
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.from(".pinned-text-wrap > *", {
        scrollTrigger: {
          trigger: ".section-pinned",
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });

      gsap.from(".pinned-images-wrap", {
        scrollTrigger: {
          trigger: ".section-pinned",
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        scale: 0.92,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out"
      });

      gsap.from(".ambiance-card", {
        scrollTrigger: {
          trigger: ".section-ambiance",
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      gsap.from(".booking-box", {
        scrollTrigger: {
          trigger: ".section-booking",
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });
    }

    // Initialize Scroll Zoom on images
    initScrollZoomImages();
  }

  // 6. JOAKIM-STYLE SCROLL-REACTIVE IMAGE ZOOM & SETTLE EFFECT
  function initScrollZoomImages() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const zoomContainers = document.querySelectorAll(
      '[data-scroll-zoom], .hero-card, .pinned-images-wrap, .ambiance-img-wrap, .swiper-slide'
    );

    zoomContainers.forEach((container) => {
      const img = container.querySelector('img');
      if (!img) return;

      if (img.dataset.scrollZoomInit === 'true') return;
      img.dataset.scrollZoomInit = 'true';

      container.style.overflow = 'hidden';
      img.style.willChange = 'transform';
      img.style.transformOrigin = 'center center';

      // Create high-precision bidirectional scroll scrub timeline
      // Phase 1 (Entering -> Mid Viewport): Slight, refined zoom in (scale 1.0 -> 1.06)
      // Phase 2 (Mid Viewport -> Exiting): Gentle, understated settle back (scale 1.06 -> 1.01)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        img,
        {
          scale: 1.0,
          yPercent: -1.5,
          force3D: true,
        },
        {
          scale: 1.06,
          yPercent: 0,
          ease: 'sine.inOut',
          duration: 1,
        }
      ).to(img, {
        scale: 1.01,
        yPercent: 1.5,
        ease: 'sine.inOut',
        duration: 1,
      });
    });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // Global window load and resize refresh for scroll triggers
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
});
