/**
 * FULLSCREEN MENU DRAWER CONTROLLER
 * Dynamic image crossfade & background color transitions on menu link hover
 */

document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('.burger-menu');
  const closeBtn = document.querySelector('.burger-menu-close');
  const menuFullscreen = document.querySelector('.menu-fullscreen');

  const expLink = document.querySelector('.menu-link-exp');
  const menuLink = document.querySelector('.menu-link-menu');
  const galleryLink = document.querySelector('.menu-link-gallery');
  const contactLink = document.querySelector('.menu-link-contact');

  const baseImg = document.querySelector('.img-cover-base');
  const expImg = document.querySelector('.img-cover-exp');
  const menuImg = document.querySelector('.img-cover-menu');
  const galleryImg = document.querySelector('.img-cover-gallery');
  const contactImg = document.querySelector('.img-cover-contact');

  const bgColors = {
    base: '#1E1B18',
    exp: '#2B332C',
    menu: '#3D2A24',
    gallery: '#262D36',
    contact: '#362E2B'
  };

  function hideAllBgImages() {
    if (expImg) expImg.style.opacity = '0';
    if (menuImg) menuImg.style.opacity = '0';
    if (galleryImg) galleryImg.style.opacity = '0';
    if (contactImg) contactImg.style.opacity = '0';
    if (baseImg) baseImg.style.opacity = '0.35';
  }

  function openMenu() {
    if (!menuFullscreen) return;
    menuFullscreen.classList.add('is-open');
    document.body.classList.add('no-scroll');
    hideAllBgImages();
  }

  function closeMenu() {
    if (!menuFullscreen) return;
    menuFullscreen.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  if (burgerBtn) burgerBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuFullscreen && menuFullscreen.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Link Hover Transitions
  function bindLinkHover(link, targetImg, colorKey) {
    if (!link) return;

    link.addEventListener('mouseenter', () => {
      hideAllBgImages();
      if (baseImg) baseImg.style.opacity = '0';
      if (targetImg) {
        targetImg.style.opacity = '0.45';
        targetImg.style.transform = 'scale(1.02)';
      }
      if (menuFullscreen) {
        menuFullscreen.style.backgroundColor = bgColors[colorKey] || bgColors.base;
      }
    });

    link.addEventListener('mouseleave', () => {
      hideAllBgImages();
      if (targetImg) targetImg.style.transform = 'scale(1.08)';
      if (menuFullscreen) {
        menuFullscreen.style.backgroundColor = bgColors.base;
      }
    });
  }

  bindLinkHover(expLink, expImg, 'exp');
  bindLinkHover(menuLink, menuImg, 'menu');
  bindLinkHover(galleryLink, galleryImg, 'gallery');
  bindLinkHover(contactLink, contactImg, 'contact');
});
