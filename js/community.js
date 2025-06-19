// community.js

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Get modal elements
  const newPostModal = document.getElementById('newPostModal');
  const newPostBtn = document.querySelector('.btn.btn-primary'); // + New Post button
  const cancelPostBtn = document.getElementById('cancelPostBtn');
  const submitPostBtn = document.getElementById('submitPostBtn');
  const newPostContent = document.getElementById('newPostContent');

  // Show modal when + New Post button is clicked
  newPostBtn.addEventListener('click', () => {
    newPostModal.style.display = 'flex';
    newPostContent.value = '';  // Clear textarea
    newPostContent.focus();
  });

  // Hide modal when Cancel button is clicked
  cancelPostBtn.addEventListener('click', () => {
    newPostModal.style.display = 'none';
  });

  // Submit post logic
  submitPostBtn.addEventListener('click', () => {
    const content = newPostContent.value.trim();
    if (!content) {
      alert('Please write something before submitting.');
      return;
    }

    // TODO: Add your backend submission or UI update code here

    alert('Post submitted: ' + content);
    newPostModal.style.display = 'none';
  });

  // Close modal if clicking outside modal content
  newPostModal.addEventListener('click', (e) => {
    if (e.target === newPostModal) {
      newPostModal.style.display = 'none';
    }
  });
});