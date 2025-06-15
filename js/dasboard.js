document.addEventListener("DOMContentLoaded", () => {
  const greetingSpan = document.getElementById("greeting-text");
  const notifIcon = document.getElementById("notif-icon");
  const profileIcon = document.getElementById("profile-icon");
  const notifDropdown = document.getElementById("notif-dropdown");
  const profileDropdown = document.getElementById("profile-dropdown");

  const addPetModal = document.getElementById("addPetModal");
  const addPetBtn = document.querySelector(".btn-primary.btn-sm");
  const cancelAddPet = document.getElementById("cancelAddPet");
  const addPetForm = document.getElementById("addPetForm");

  const updateBtn = document.getElementById("updateHealthBtn");
  const updateModal = document.getElementById("updateHealthModal");
  const cancelUpdateBtn = document.getElementById("cancelHealthUpdate");
  const updateHealthForm = document.getElementById("updateHealthForm");

  // Greeting logic
  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good Morning,";
  else if (hour < 18) greeting = "Good Afternoon,";
  else greeting = "Good Evening,";
  if (greetingSpan) greetingSpan.textContent =`${greeting} Ada`;

  // Toggle notifications
  notifIcon?.addEventListener("click", () => {
    notifDropdown.style.display = notifDropdown.style.display === "none" ? "block" : "none";
    profileDropdown.style.display = "none";
    hideAddPetModal();
  });

  // Toggle profile
  profileIcon?.addEventListener("click", () => {
    profileDropdown.style.display = profileDropdown.style.display === "none" ? "block" : "none";
    notifDropdown.style.display = "none";
    hideAddPetModal();
  });

  // Add Pet Modal Open
  addPetBtn?.addEventListener("click", () => {
    showAddPetModal();
    notifDropdown.style.display = "none";
    profileDropdown.style.display = "none";
  });

  // Add Pet Modal Close
  cancelAddPet?.addEventListener("click", hideAddPetModal);

  // Add Pet Form Submit (no popup)
  addPetForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    addPetForm.reset();
    hideAddPetModal();
  });

  // Update Health Modal Open
  updateBtn?.addEventListener("click", () => {
    updateModal.classList.remove("d-none");
    updateModal.classList.add("d-flex");
  });

  // Update Health Modal Cancel
  cancelUpdateBtn?.addEventListener("click", () => {
    updateModal.classList.remove("d-flex");
    updateModal.classList.add("d-none");
  });

  // Update Health Form Submit (no popup)
  updateHealthForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    // Just close modal and reset form silently
    updateModal.classList.remove("d-flex");
    updateModal.classList.add("d-none");
    updateHealthForm.reset();
  });

  // Close dropdowns/modals if clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#notif-icon") && !e.target.closest("#notif-dropdown")) {
      notifDropdown.style.display = "none";
    }
    if (!e.target.closest("#profile-icon") && !e.target.closest("#profile-dropdown")) {
      profileDropdown.style.display = "none";
    }
    if (!e.target.closest(".btn-primary.btn-sm") && !e.target.closest("#addPetModal .bg-white")) {
      hideAddPetModal();
    }
    if (!e.target.closest("#updateHealthModal .bg-white") && !e.target.closest("#updateHealthBtn")) {
      updateModal.classList.remove("d-flex");
      updateModal.classList.add("d-none");
    }
  });

  function showAddPetModal() {
    addPetModal.style.display = "flex";
    addPetModal.classList.add("d-flex");
  }

  function hideAddPetModal() {
    addPetModal.style.display = "none";
    addPetModal.classList.remove("d-flex");
  }
});