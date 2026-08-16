/**
 * SWIPER SHOWCASE INITIALIZATION
 * Auto-scrolling carousel with pause-on-hover overlays
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined') return;

  const swiperElement = document.querySelector('.swiper');
  if (!swiperElement) return;

  const swiper = new Swiper('.swiper', {
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 28,
    slidesPerGroup: 1,
    centeredSlides: false,
    speed: 750,
    grabCursor: true,
    autoplay: {
      delay: 2400,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: '.swiper-nav-next',
      prevEl: '.swiper-nav-prev',
    },
    breakpoints: {
      320: {
        spaceBetween: 16,
      },
      768: {
        spaceBetween: 24,
      },
      1024: {
        spaceBetween: 28,
      }
    }
  });

  // Pause autoplay when hovering card overlay
  const hoverCards = document.querySelectorAll('.hover-slider-item');
  hoverCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (swiper.autoplay.running) {
        swiper.autoplay.stop();
      }
    });
    card.addEventListener('mouseleave', () => {
      swiper.autoplay.start();
    });
  });
});
