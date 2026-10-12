/**
 * WHAT'S ON SLIDER (Joakim's news slider: free width slides, arrows underneath)
 */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined' || !document.querySelector('.swiper')) return;

  new Swiper('.swiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 750,
    grabCursor: true,
    navigation: { nextEl: '.arrow-right', prevEl: '.arrow-left' },
    on: { init: () => typeof ScrollTrigger !== 'undefined' && setTimeout(() => ScrollTrigger.refresh(), 100) },
  });
});
