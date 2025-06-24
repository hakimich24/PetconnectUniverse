document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = 'https://petuniverse-backend.onrender.com';

  const addPetModal = document.getElementById('addPetModal');
  const addPetBtn = document.querySelector('.btn-primary');
  const cancelAddPetBtn = document.getElementById('cancelAddPet');
  const addPetForm = document.getElementById('addPetForm');
  const currentPetCard = document.getElementById('current-pet-card');

  function showMessage(message, type = 'info') {
    alert(message);
  }

  function renderPet(pet) {
    if (!currentPetCard) {
      console.error("Error: #current-pet-card element not found in HTML.");
      return;
    }

    currentPetCard.innerHTML = `
      <div class="d-flex flex-column flex-sm-row align-items-center align-items-sm-start p-4 text-center text-sm-start" style="min-height: 180px; width: 100%; max-width: 600px; border: 2px solid #dee2e6; border-radius: 30px;">
        <img src="images/46046486.jpg" alt="Pet Image" class="rounded-circle me-0 me-sm-3 mb-3 mb-sm-0" style="width: 120px; height: 120px; object-fit: cover" />
        <div>
          <p class="mb-1 fw-bold">Pet Name: <span class="fw-normal">${pet.name}</span></p>
          <p class="mb-1 fw-bold">${pet.age} years old</p>
          <p class="mb-1"><span class="fw-bold">Type:</span> ${pet.type}</p>
          <p class="mb-1">✔ Vaccinated</p>
          <p class="mb-1">✘ Vet Visit</p>
        </div>
      </div>
      <div class="align-self-center mt-3 mt-md-0 ms-md-5">
        <button id="updateHealthBtn" class="btn btn-primary">Update Health Record</button>
      </div>
    `;
  }

  const initialPet = { name: "Benny", age: 2, type: "Labrador" };
  renderPet(initialPet);

  if (addPetBtn && addPetModal && cancelAddPetBtn) {
    addPetBtn.addEventListener('click', () => {
      addPetModal.style.display = 'flex';
    });

    cancelAddPetBtn.addEventListener('click', () => {
      addPetModal.style.display = 'none';
      addPetForm.reset();
    });

    addPetModal.addEventListener('click', (event) => {
      if (event.target === addPetModal) {
        addPetModal.style.display = 'none';
        addPetForm.reset();
      }
    });
  }

  if (addPetForm) {
    addPetForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const petName = document.getElementById('petName').value.trim();
      const petType = document.getElementById('petSpecies').value.trim();
      const petAge = parseInt(document.getElementById('petAge').value, 10);

      if (!petName || !petType || isNaN(petAge) || petAge <= 0) {
        showMessage('Please fill in all pet details correctly.', 'error');
        return;
      }

      const token = localStorage.getItem('jwt_token');
      if (!token) {
        showMessage('You must be logged in to add a pet.', 'error');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/pets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: petName,
            type: petType,
            age: petAge
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          showMessage(errorData.message || 'Failed to add pet. Please try again.', 'error');
          return;
        }

        const data = await response.json();
        const petId = data.id;

        const petResponse = await fetch(`${API_BASE_URL}/api/pets/${petId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!petResponse.ok) {
          showMessage('Pet added but failed to load pet details.', 'warning');
          return;
        }

        const newPet = await petResponse.json();
        showMessage('Pet added successfully!', 'success');
        addPetModal.style.display = 'none';
        addPetForm.reset();
        renderPet(newPet);

      } catch (error) {
        console.error('Error adding pet:', error);
        showMessage('Error connecting to server or adding pet. Please try again later.', 'error');
      }
    });
  }
});