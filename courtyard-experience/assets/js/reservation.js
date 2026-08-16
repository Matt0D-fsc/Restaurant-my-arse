/**
 * RESERVATION & CONTACT ENGINE
 * Handles interactive booking forms, party size selector, and confirmation toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.querySelector('#reservation-form');
  const toast = document.querySelector('.booking-toast');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.querySelector('#book-name')?.value || 'Guest';
      const guests = document.querySelector('#book-guests')?.value || '2';
      const date = document.querySelector('#book-date')?.value || 'Upcoming date';
      const time = document.querySelector('#book-time')?.value || 'Evening';

      if (toast) {
        toast.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Reservation requested for <strong>${name}</strong> (${guests} guests on ${date} at ${time}). We will contact you shortly!</span>
        `;
        toast.classList.add('is-active');

        setTimeout(() => {
          toast.classList.remove('is-active');
        }, 5000);
      }

      bookingForm.reset();
    });
  }
});
