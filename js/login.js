/* side bar navigation */
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("show");
}

/* COMMUNITY SCREEN SCRIPT */
document.querySelector(".new-post-btn").addEventListener("click", function () {
  alert("New Post feature would open here!");
});

/* login page script */
function togglePassword() {
  const passwordField = document.getElementById("passwordField");
  const toggleIcon = document.getElementById("toggleIcon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

/* Register script */
function togglePassword() {
  const passwordField = document.getElementById("passwordField");
  const toggleIcon = document.getElementById("toggleIcon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

function toggleConfirmPassword() {
  const confirmPasswordField = document.getElementById("confirmPasswordField");
  const toggleConfirmIcon = document.getElementById("toggleConfirmIcon");

  if (confirmPasswordField.type === "password") {
    confirmPasswordField.type = "text";
    toggleConfirmIcon.classList.remove("fa-eye");
    toggleConfirmIcon.classList.add("fa-eye-slash");
  } else {
    confirmPasswordField.type = "password";
    toggleConfirmIcon.classList.remove("fa-eye-slash");
    toggleConfirmIcon.classList.add("fa-eye");
  }
}
function togglePassword() {
  const passwordField = document.getElementById("passwordField");
  const toggleIcon = document.getElementById("toggleIcon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "dashboard.html";
    });
  }
});