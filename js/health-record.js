// Set dynamic greeting
window.addEventListener('DOMContentLoaded', () => {
  const greetingText = document.getElementById('greeting-text');
  const hour = new Date().getHours();
  let greeting = 'Hello';

  if (hour < 12) {
    greeting = 'Good Morning';
  } else if (hour < 17) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  greetingText.textContent = `${greeting}, Ada`;
});

// Dropdown elements
const notifIcon = document.getElementById('notif-icon');
const profileIcon = document.getElementById('profile-icon');
const notifDropdown = document.getElementById('notif-dropdown');
const profileDropdown = document.getElementById('profile-dropdown');

// Toggle bell icon dropdown
notifIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  const isVisible = notifDropdown.style.display === 'block';
  notifDropdown.style.display = isVisible ? 'none' : 'block';
  profileDropdown.style.display = 'none'; // hide the other
});

// Toggle profile icon dropdown
profileIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  const isVisible = profileDropdown.style.display === 'block';
  profileDropdown.style.display = isVisible ? 'none' : 'block';
  notifDropdown.style.display = 'none'; // hide the other
});

// Hide both dropdowns when clicking outside
document.addEventListener('click', () => {
  notifDropdown.style.display = 'none';
  profileDropdown.style.display = 'none';
});

// Add Pet Modal: Show modal
document.getElementById('addPetBtn').addEventListener('click', () => {
  document.getElementById('addPetModal').classList.remove('d-none');
  document.getElementById('addPetModal').classList.add('d-flex');
});

// Hide modal on cancel
document.getElementById('cancelAddPet').addEventListener('click', () => {
  document.getElementById('addPetModal').classList.remove('d-flex');
  document.getElementById('addPetModal').classList.add('d-none');
});

// Optional: Add Pet form submission
document.getElementById('addPetForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Pet added!');
  document.getElementById('addPetModal').classList.remove('d-flex');
  document.getElementById('addPetModal').classList.add('d-none');
});