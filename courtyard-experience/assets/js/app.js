/**
 * THE COURTYARD AT PARK HEIGHTS — CORE APPLICATION SCRIPT
 * GSAP Choreography, Lenis Smooth Scroll, Joakim Pinned Transition, SplitText Hover Stagger
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. LENIS SMOOTH SCROLL INITIALIZATION
  // =========================================================================
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

  // =========================================================================
  // 2. PRELOADER CONTROLLER
  // =========================================================================
  const preloader = document.querySelector('.preloader');
  const preloaderBar = document.querySelector('.preloader-bar');

  if (preloader) {
    document.body.classList.add('no-scroll');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 8;
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
              initSection2PinnedScroll();
              initSection3Animations();
              initBreakdownAnimations();
            }
          });
        }, 350);
      } else {
        if (preloaderBar) preloaderBar.style.width = `${progress}%`;
      }
    }, 60);
  } else {
    initHeroAnimations();
    initSection2PinnedScroll();
    initSection3Animations();
    initBreakdownAnimations();
  }

  // =========================================================================
  // 3. SPLIT-TEXT CHARACTER HOVER ANIMATION (From latabledejoakim.fr)
  // =========================================================================
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

  // =========================================================================
  // 4. SMART STICKY NAVIGATION (Auto-hide on scroll down, show on scroll up)
  // =========================================================================
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

  // =========================================================================
  // 5. HERO VISUAL STORYTELLING ENTRANCE (Joakim Choreography)
  // =========================================================================
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

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

    // Image Zoom Effect Init
    initScrollZoomImages();
  }

  // =========================================================================
  // 6. SECTION 2: DUAL-STAGE PINNED SCROLL TRANSITION (Joakim 1:1)
  // =========================================================================
  let s1TitleLines, s2TitleLines;
  let introTl, scrollTriggerInstance;
  let isSection2Active = false;
  let currentAnimation = null;
  let hasIntroPlayed = false;

  function isDesktop() {
    return window.innerWidth > 991;
  }

  function splitLinesAuto(element) {
    if (!element) return [];
    const text = element.textContent.trim();
    const words = text.split(/\s+/).filter(word => word);

    element.innerHTML = words.map(word => `<span class="word-measure">${word}</span>`).join(' ');

    const wordSpans = element.querySelectorAll('.word-measure');
    const lines = [];
    let currentLine = [];
    let lastTop = null;

    wordSpans.forEach((span, i) => {
      const rect = span.getBoundingClientRect();
      if (lastTop !== null && rect.top > lastTop + 5) {
        lines.push(currentLine.join(' '));
        currentLine = [];
      }
      currentLine.push(words[i]);
      lastTop = rect.top;
    });

    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '));
    }

    element.innerHTML = '';

    const lineElements = [];
    lines.forEach((lineText) => {
      const mask = document.createElement('div');
      mask.className = 'line-mask';

      const inner = document.createElement('div');
      inner.className = 'line-inner';
      inner.textContent = lineText;

      mask.appendChild(inner);
      element.appendChild(mask);
      lineElements.push(inner);
    });

    return lineElements;
  }

  function resetSection2Styles() {
    const scrollContainer = document.querySelector(".scroll-container");
    const scrollWrapper = document.querySelector(".scroll-wrapper");
    const section1 = document.querySelector(".section_2_home .section-1");
    const section2 = document.querySelector(".section_2_home .section-2");

    if (!scrollContainer) return;

    const s1TitleBlock = section1 ? section1.querySelector(".text-center-block") : null;
    const s1Title = section1 ? section1.querySelector(".heading-1-scroll") : null;
    const s1Image = section1 ? section1.querySelector(".img-scroll") : null;
    const s1TextBottom = section1 ? section1.querySelector(".text-center-block-bottom") : null;

    const s2TitleBlock = section2 ? section2.querySelector(".text-center-block") : null;
    const s2Title = section2 ? section2.querySelector(".heading-2-scroll") : null;
    const s2Image = section2 ? section2.querySelector(".img-scroll") : null;
    const s2TextBottom = section2 ? section2.querySelector(".text-center-block-bottom") : null;

    gsap.set([section1, section2, scrollWrapper, s1TitleBlock, s1Image, s1TextBottom, s2TitleBlock, s2Image, s2TextBottom].filter(Boolean), { clearProps: "all" });

    if (s1Title) s1Title.innerHTML = s1Title.textContent;
    if (s2Title) s2Title.innerHTML = s2Title.textContent;
  }

  function initSection2PinnedScroll() {
    const scrollContainer = document.querySelector(".scroll-container");
    const scrollWrapper = document.querySelector(".scroll-wrapper");
    const section1 = document.querySelector(".section_2_home .section-1");
    const section2 = document.querySelector(".section_2_home .section-2");

    if (!scrollContainer || !scrollWrapper || !section1 || !section2) return;

    if (!isDesktop()) {
      resetSection2Styles();
      return;
    }

    const s1TitleBlock = section1.querySelector(".text-center-block");
    const s1Title = section1.querySelector(".heading-1-scroll");
    const s1Image = section1.querySelector(".img-scroll");
    const s1TextBottom = section1.querySelector(".text-center-block-bottom");

    const s2TitleBlock = section2.querySelector(".text-center-block");
    const s2Title = section2.querySelector(".heading-2-scroll");
    const s2Image = section2.querySelector(".img-scroll");
    const s2TextBottom = section2.querySelector(".text-center-block-bottom");

    const bgColor1 = "rgb(155, 124, 109)"; // Warm light brown / taupe
    const bgColor2 = "rgb(216, 225, 235)"; // Calm mist blue

    // Split headers into line masks
    s1TitleLines = splitLinesAuto(s1Title);
    s2TitleLines = splitLinesAuto(s2Title);

    gsap.set([section1, section2], { backgroundColor: "transparent" });
    gsap.set(scrollWrapper, { backgroundColor: bgColor1 });

    // Section 2 initial state (hidden)
    gsap.set(section2, { visibility: "visible", opacity: 1 });
    gsap.set(s2TitleLines, { y: 60 });
    gsap.set(s2TextBottom, { opacity: 0, y: 15 });
    gsap.set(s2Image, { 
      clipPath: "inset(100% 0% 0% 0%)",
      opacity: 1 
    });

    // Section 1 initial state (hidden for entrance reveal)
    gsap.set(s1TitleLines, { y: 120 });
    gsap.set(s1Image, { 
      clipPath: "inset(100% 0% 0% 0%)",
      opacity: 1 
    });
    gsap.set(s1TextBottom, { opacity: 0, y: 30 });

    // Initial entrance animation when Section 2 scrolls into view
    introTl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: "top 80%",
        once: true,
      }
    });

    // 1. Title - lines reveal with stagger
    introTl.to(s1TitleLines, {
      y: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out"
    }, 0);

    // 2. Image - mask reveals top to bottom
    introTl.to(s1Image, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.85,
      ease: "power3.out"
    }, 0.25);

    // 3. Bottom text reveals
    introTl.to(s1TextBottom, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out"
    }, 0.5);

    introTl.eventCallback("onComplete", () => {
      hasIntroPlayed = true;
    });

    // Transition to Section 2
    function animateToSection2() {
      if (isSection2Active || !hasIntroPlayed) return;
      isSection2Active = true;
      if (currentAnimation) currentAnimation.kill();

      const tl = gsap.timeline();
      currentAnimation = tl;

      // Background color transition
      tl.to(scrollWrapper, {
        backgroundColor: bgColor2,
        duration: 0.8,
        ease: "none"
      }, 0);

      // Section 1 Disappearance
      tl.to(s1TitleLines, {
        y: -60,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.inOut"
      }, 0);

      tl.to(s1Image, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.5,
        ease: "power2.inOut"
      }, 0.15);

      tl.to(s1TextBottom, {
        y: -15,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut"
      }, 0.35);

      tl.set(s1TitleBlock, { visibility: "hidden" }, 0.5);
      tl.set(s1TextBottom, { visibility: "hidden" }, 0.6);

      // Section 2 Appearance
      tl.to(s2Image, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.55,
        ease: "power2.out"
      }, 0.45);

      tl.to(s2TitleLines, {
        y: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: "power2.out"
      }, 0.45);

      tl.to(s2TextBottom, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out"
      }, 0.65);
    }

    // Transition back to Section 1
    function animateToSection1() {
      if (!isSection2Active) return;
      isSection2Active = false;
      if (currentAnimation) currentAnimation.kill();

      const tl = gsap.timeline();
      currentAnimation = tl;

      // Background transition
      tl.to(scrollWrapper, {
        backgroundColor: bgColor1,
        duration: 0.8,
        ease: "none"
      }, 0);

      // Section 2 Disappearance
      tl.to(s2TextBottom, {
        y: 15,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut"
      }, 0);

      tl.to(s2TitleLines, {
        y: 60,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.inOut"
      }, 0.1);

      tl.to(s2Image, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.5,
        ease: "power2.inOut"
      }, 0.1);

      // Section 1 Reappearance
      tl.set(s1TitleBlock, { visibility: "visible" }, 0.3);
      tl.set(s1TextBottom, { visibility: "visible" }, 0.3);

      tl.fromTo(s1TitleLines, 
        { y: -60 },
        {
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out"
        }, 0.4);

      tl.fromTo(s1Image, 
        { clipPath: "inset(100% 0% 0% 0%)" },
        { 
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.5,
          ease: "power2.out"
        }, 0.45);

      tl.to(s1TextBottom, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      }, 0.65);
    }

    // ScrollTrigger Pinned Progress Watcher
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (self.progress > 0.5) {
          animateToSection2();
        } else {
          animateToSection1();
        }
      },
    });
  }

  // =========================================================================
  // 7. SECTION 3: ASYMMETRIC REVEALS & CURTAIN MASKS
  // =========================================================================
  function initSection3Animations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Header statement fade up
    gsap.from(".top-title-sec-3", {
      scrollTrigger: {
        trigger: ".section_3_home",
        start: "top 75%",
        toggleActions: "play none none reverse"
      },
      y: 40,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out"
    });

    // Right asymmetric block image mask wipe & text fade
    const rightImgWrap = document.querySelector(".img-1-sec-3-wrapper");
    if (rightImgWrap) {
      const mask = rightImgWrap.querySelector(".mask-white");
      if (mask) {
        gsap.to(mask, {
          scrollTrigger: {
            trigger: ".right-img-sec-3-wrapper",
            start: "top 75%",
            toggleActions: "play none none reverse"
          },
          scaleY: 0,
          transformOrigin: "bottom center",
          duration: 1.2,
          ease: "power3.inOut"
        });
      }

      gsap.from(".right-img-sec-3-wrapper .text-black", {
        scrollTrigger: {
          trigger: ".right-img-sec-3-wrapper",
          start: "top 70%",
          toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }

    // Left asymmetric block image mask wipe & text fade
    const leftImgWrap = document.querySelector(".img-2-sec-3wrapper");
    if (leftImgWrap) {
      const mask = leftImgWrap.querySelector(".mask-white");
      if (mask) {
        gsap.to(mask, {
          scrollTrigger: {
            trigger: ".left-img-sec-3-wrapper",
            start: "top 75%",
            toggleActions: "play none none reverse"
          },
          scaleY: 0,
          transformOrigin: "bottom center",
          duration: 1.2,
          ease: "power3.inOut"
        });
      }

      gsap.from(".left-img-sec-3-wrapper .text-wrapper-2-sec-3, .left-img-sec-3-wrapper .cta-black", {
        scrollTrigger: {
          trigger: ".left-img-sec-3-wrapper",
          start: "top 70%",
          toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });
    }
  }

  // =========================================================================
  // 8. SECTION 4: SERVICE BREAKDOWN STAGGER ANIMATIONS
  // =========================================================================
  function initBreakdownAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.from(".breakdown-header > *", {
      scrollTrigger: {
        trigger: ".section_service_breakdown",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 35,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    });

    gsap.from(".breakdown-col", {
      scrollTrigger: {
        trigger: ".breakdown-grid",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 40,
      opacity: 0,
      duration: 1.1,
      stagger: 0.15,
      ease: "power3.out"
    });

    // Booking box reveal
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

  // =========================================================================
  // 9. JOAKIM-STYLE SCROLL-REACTIVE IMAGE ZOOM & SETTLE EFFECT
  // =========================================================================
  function initScrollZoomImages() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const zoomContainers = document.querySelectorAll(
      '[data-scroll-zoom], .img-1-sec-3-wrapper, .img-2-sec-3wrapper, .img-slider-item'
    );

    zoomContainers.forEach((container) => {
      const img = container.querySelector('img');
      if (!img) return;

      if (img.dataset.scrollZoomInit === 'true') return;
      img.dataset.scrollZoomInit = 'true';

      container.style.overflow = 'hidden';
      img.style.willChange = 'transform';
      img.style.transformOrigin = 'center center';

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
        { scale: 1.0, yPercent: -1.5, force3D: true },
        { scale: 1.06, yPercent: 0, ease: 'sine.inOut', duration: 1 }
      ).to(img, {
        scale: 1.01,
        yPercent: 1.5,
        ease: 'sine.inOut',
        duration: 1,
      });
    });

    ScrollTrigger.refresh();
  }

  // =========================================================================
  // 10. RESIZE & REFRESH HANDLER
  // =========================================================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
        scrollTriggerInstance = null;
      }
      if (introTl) {
        introTl.kill();
        introTl = null;
      }
      isSection2Active = false;
      hasIntroPlayed = false;

      initSection2PinnedScroll();
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 250);
  });

  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

});
