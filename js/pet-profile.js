document.addEventListener("DOMContentLoaded", () => {
  const greetingSpan = document.getElementById("greeting-text");
  const notifIcon = document.getElementById("notif-icon");
  const profileIcon = document.getElementById("profile-icon");
  const notifDropdown = document.getElementById("notif-dropdown");
  const profileDropdown = document.getElementById("profile-dropdown");

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

  // BACKEND BASE URL
  const BASE_URL = "http://localhost:3000/api/pets";

  // DELETE PET
  document.getElementById("deletePetBtn")?.addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete this pet?");
    if (confirmDelete) {
      try {
        // TODO: Replace this with actual pet ID, e.g. from data attribute or variable
        const petId = "replace-this-with-actual-id";
        const res = await fetch(`${BASE_URL}/${petId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete pet");
        alert("Pet deleted");
        location.reload();
      } catch (err) {
        console.error(err);
        alert("An error occurred while deleting the pet.");
      }
    }
  });

  // ADD PET
  document.getElementById("addPetForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    // Adjust selectors if your inputs have names or IDs
    const name = form.querySelector("input[name='name']")?.value || form.querySelector("input:nth-child(1)")?.value;
    const species = form.querySelector("input[name='species']")?.value || form.querySelector("input:nth-child(2)")?.value;
    const age = form.querySelector("input[name='age']")?.value || form.querySelector("input:nth-child(3)")?.value;

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, species, age })
      });
      if (!res.ok) throw new Error("Failed to add pet");
      alert("Pet added successfully");
      location.reload();
    } catch (err) {
      console.error(err);
      alert("An error occurred while adding the pet.");
    }
  });

  // EDIT PET
  document.getElementById("edit-profile-btn")?.addEventListener("click", () => {
    const profileData = {
      name: "Benny",
      species: "Dog",
      gender: "Female",
      breed: "Labrador Retriever",
      age: "2 years old",
      color: "Cream",
      diet: "Dry kibble & chicken mix",
    };

    const formHTML = `
      <div class="modal d-flex align-items-center justify-content-center" id="editProfileModal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;z-index:1050;">
        <div class="bg-white p-4 rounded" style="width:100%;max-width:500px;">
          <h5 class="mb-3">Edit Pet Profile</h5>
          <form id="editPetForm">
            ${Object.entries(profileData).map(([key, val]) => `
              <div class="mb-3">
                <label class="form-label">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input type="text" class="form-control" name="${key}" value="${val}" required>
              </div>`).join("")}
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" id="cancelEditBtn">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", formHTML);

    const modal = document.getElementById("editProfileModal");
    const form = document.getElementById("editPetForm");
    const cancelBtn = document.getElementById("cancelEditBtn");

    cancelBtn?.addEventListener("click", () => modal.remove());

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Collect all fields including 'name'
      const updatedPet = {
        name: form.elements["name"].value,
        species: form.elements["species"].value,
        gender: form.elements["gender"].value,
        breed: form.elements["breed"].value,
        age: form.elements["age"].value,
        color: form.elements["color"].value,
        diet: form.elements["diet"].value,
      };

      try {
        // TODO: Replace with actual pet ID
        const petId = "replace-this-with-actual-id";
        const res = await fetch(`${BASE_URL}/${petId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPet)
        });
        if (!res.ok) throw new Error("Failed to update pet");
        alert("Pet profile updated!");
        location.reload();
      } catch (err) {
        console.error(err);
        alert("An error occurred while updating the pet.");
      }

      modal.remove();
    });
  });
});