document.addEventListener("DOMContentLoaded", () => {
    // API Base URL - Placeholder for future backend integration
    const API_BASE_URL = 'http://localhost:3000'; // Adjust if you get a live backend URL

    // --- Message Box Helper Function (consistent across pages) ---
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 9999;
        display: none;
        text-align: center;
        border: 1px solid #ddd;
    `;
    document.body.appendChild(messageBox);

    function showMessageBox(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.style.display = 'block';
        messageBox.style.color = type === 'error' ? 'red' : (type === 'success' ? 'green' : 'black');
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }

    // --- Greeting Logic (Common) ---
    const greetingTextElement = document.getElementById('greeting-text');
    const userDataString = localStorage.getItem('userData'); 
    let username = 'User'; // Default username

    if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData && userData.username) {
            username = userData.username;
        } else if (userData && userData.firstName) {
            username = userData.firstName;
        }
    } else {
        username = 'Guest';
        // Optional: Redirect to login if not logged in and this page requires auth
        // window.location.href = 'login.html'; 
    }

    const hour = new Date().getHours();
    let greetingPrefix = "Hello,";
    if (hour < 12) greetingPrefix = "Good Morning,";
    else if (hour < 18) greetingPrefix = "Good Afternoon,";
    else greetingPrefix = "Good Evening,";

    if (greetingTextElement) {
        greetingTextElement.textContent = `${greetingPrefix} ${username}`;
    }

    // --- Dropdown Toggle Logic (Common: Notifications & Profile) ---
    const notifIcon = document.getElementById('notif-icon');
    const notifDropdown = document.getElementById('notif-dropdown');
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');
    const addPetButton = document.querySelector('.main-content .btn-primary'); // "+ Add a Pet" button

    if (notifIcon && notifDropdown) {
        notifIcon.addEventListener('click', (event) => {
            event.stopPropagation(); 
            notifDropdown.style.display = notifDropdown.style.display === 'none' ? 'block' : 'none';
            if (profileDropdown) profileDropdown.style.display = 'none'; // Close other dropdown
        });
    }

    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', (event) => {
            event.stopPropagation(); 
            profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
            if (notifDropdown) notifDropdown.style.display = 'none'; // Close other dropdown
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        if (notifDropdown && !notifDropdown.contains(event.target) && event.target !== notifIcon) {
            notifDropdown.style.display = 'none';
        }
        if (profileDropdown && !profileDropdown.contains(event.target) && event.target !== profileIcon) {
            profileDropdown.style.display = 'none';
        }
    });

    // --- Profile Dropdown Links Activation (Common) ---
    const settingsLink = document.getElementById('settingsLink'); 
    const logoutLink = document.getElementById('logoutLink'); 

    if (settingsLink) {
        settingsLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if it's an <a> tag
            if (profileDropdown) profileDropdown.style.display = 'none'; // Close dropdown
            window.location.href = 'settings.html'; // Redirect to settings page
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if it's an <a> tag
            localStorage.removeItem('userToken'); 
            localStorage.removeItem('userData');  // Remove all user-related data
            showMessageBox('You have been logged out.', 'success'); 
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to login page
            }, 1000); // Short delay before redirect
            if (profileDropdown) profileDropdown.style.display = 'none'; // Close dropdown
        });
    }

    // --- Pet Profile Specific Logic ---
    // Elements to display pet data
    const petImageDisplay = document.getElementById('petImageDisplay');
    const petNameDisplay = document.getElementById('petNameDisplay');
    const petSpeciesDisplay = document.getElementById('petSpeciesDisplay');
    const petGenderDisplay = document.getElementById('petGenderDisplay');
    const petBreedDisplay = document.getElementById('petBreedDisplay');
    const petAgeDisplay = document.getElementById('petAgeDisplay');
    const petColorDisplay = document.getElementById('petColorDisplay');
    const petDietDisplay = document.getElementById('petDietDisplay');

    // Edit Modal elements
    const editProfileModal = document.getElementById('editProfileModal');
    const editModalPetName = document.getElementById('editModalPetName');
    const editPetForm = document.getElementById('editPetForm');
    const editPetSpeciesInput = document.getElementById('editPetSpecies');
    const editPetGenderInput = document.getElementById('editPetGender');
    const editPetBreedInput = document.getElementById('editPetBreed');
    const editPetAgeInput = document.getElementById('editPetAge');
    const editPetColorInput = document.getElementById('editPetColor');
    const editPetDietInput = document.getElementById('editPetDiet');

    // Buttons
    const editProfileBtn = document.getElementById('editProfileBtn');
    const deletePetBtn = document.getElementById('deletePetBtn');

    // Mock Pet Data (This would come from your backend API in a real app)
    let currentPetData = {
        id: 'pet123',
        name: 'Benny',
        species: 'Dog',
        gender: 'Female',
        breed: 'Labrador Retriever',
        age: '2 years old', // Storing as string for display convenience
        color: 'Cream',
        diet: 'Dry kibble & chicken mix',
        imageUrl: 'images/46046486.jpg'
    };

    // Function to render/update pet profile details on the page
    function renderPetProfile() {
        if (!currentPetData) {
            // Handle case where no pet data is available (e.g., after deletion)
            petImageDisplay.src = 'https://placehold.co/100x100/eeeeee/cccccc?text=No+Pet';
            petNameDisplay.textContent = 'No Pet Selected';
            petSpeciesDisplay.textContent = '';
            petGenderDisplay.textContent = '';
            petBreedDisplay.textContent = '';
            petAgeDisplay.textContent = '';
            petColorDisplay.textContent = '';
            petDietDisplay.textContent = '';
            editProfileBtn.style.display = 'none'; // Hide edit button if no pet
            deletePetBtn.style.display = 'none'; // Hide delete button if no pet
            return;
        }

        if (petImageDisplay) petImageDisplay.src = currentPetData.imageUrl;
        if (petNameDisplay) petNameDisplay.textContent = currentPetData.name;
        if (petSpeciesDisplay) petSpeciesDisplay.textContent = currentPetData.species;
        if (petGenderDisplay) petGenderDisplay.textContent = currentPetData.gender;
        if (petBreedDisplay) petBreedDisplay.textContent = currentPetData.breed;
        if (petAgeDisplay) petAgeDisplay.textContent = currentPetData.age;
        if (petColorDisplay) petColorDisplay.textContent = currentPetData.color;
        if (petDietDisplay) petDietDisplay.textContent = currentPetData.diet;

        // Ensure buttons are visible if a pet is displayed
        editProfileBtn.style.display = 'inline-block';
        deletePetBtn.style.display = 'inline-block';
    }

    // Initial render of pet profile when page loads
    renderPetProfile();

    // --- Edit Pet Profile Logic ---
    if (editProfileBtn && editProfileModal) {
        editProfileBtn.addEventListener('click', () => {
            // Populate the modal fields with current pet data
            if (editModalPetName) editModalPetName.textContent = `Edit ${currentPetData.name}'s Profile`;
            if (editPetSpeciesInput) editPetSpeciesInput.value = currentPetData.species;
            if (editPetGenderInput) editPetGenderInput.value = currentPetData.gender;
            if (editPetBreedInput) editPetBreedInput.value = currentPetData.breed;
            if (editPetAgeInput) editPetAgeInput.value = currentPetData.age;
            if (editPetColorInput) editPetColorInput.value = currentPetData.color;
            if (editPetDietInput) editPetDietInput.value = currentPetData.diet;
        });

        editPetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get updated values from the form
            const updatedSpecies = editPetSpeciesInput.value.trim();
            const updatedGender = editPetGenderInput.value.trim();
            const updatedBreed = editPetBreedInput.value.trim();
            const updatedAge = editPetAgeInput.value.trim();
            const updatedColor = editPetColorInput.value.trim();
            const updatedDiet = editPetDietInput.value.trim();

            if (!updatedSpecies || !updatedGender || !updatedBreed || !updatedAge || !updatedColor || !updatedDiet) {
                showMessageBox('Please fill in all fields.', 'error');
                return;
            }

            showMessageBox('Saving changes...', 'info');

            // --- MOCKED API CALL for Update Pet ---
            setTimeout(() => {
                // Update the currentPetData object with new values
                currentPetData.species = updatedSpecies;
                currentPetData.gender = updatedGender;
                currentPetData.breed = updatedBreed;
                currentPetData.age = updatedAge;
                currentPetData.color = updatedColor;
                currentPetData.diet = updatedDiet;

                renderPetProfile(); // Re-render the profile with updated data
                showMessageBox('Pet profile updated successfully!', 'success');
                // Close modal using Bootstrap's modal API if available, or hide manually
                const modalElement = document.getElementById('editProfileModal');
                const bsModal = bootstrap.Modal.getInstance(modalElement); 
                if (bsModal) {
                    bsModal.hide();
                } else {
                    modalElement.style.display = 'none'; // Fallback if Bootstrap JS not fully loaded or element not initialized
                }
            }, 1500); // Simulate network delay
        });
    }

    // --- Delete Pet Logic ---
    if (deletePetBtn) {
        deletePetBtn.addEventListener('click', () => {
            // Replace browser's confirm with a custom message box for consistency
            // For now, we'll use a simple confirm as a placeholder for a more complex custom modal
            if (confirm(`Are you sure you want to delete ${currentPetData.name}'s profile? This action cannot be undone.`)) {
                showMessageBox('Deleting pet...', 'info');

                // --- MOCKED API CALL for Delete Pet ---
                setTimeout(() => {
                    // In a real app, you'd send a DELETE request to your backend
                    // console.log(`Mocking deletion of pet: ${currentPetData.id}`);
                    
                    // Simulate success
                    showMessageBox('Pet profile deleted successfully!', 'success');
                    currentPetData = null; // Clear pet data
                    renderPetProfile(); // Re-render to show "No Pet" state
                }, 1500); // Simulate network delay
            }
        });
    }

    // --- Add Pet Modal Logic (from Dashboard, ensuring it still works here) ---
    const addPetModal = document.getElementById('addPetModal');
    const addPetForm = document.getElementById('addPetForm');

    // "+ Add a Pet" button is already handled via data-bs-toggle in HTML
    // We only need to handle the form submission for it.
    if (addPetForm) {
        addPetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const petName = document.getElementById('addPetName').value; // Use addPetName ID
            const petSpecies = document.getElementById('addPetSpecies').value; // Use addPetSpecies ID
            const petAge = parseInt(document.getElementById('addPetAge').value, 10); // Use addPetAge ID

            if (!petName || !petSpecies || isNaN(petAge) || petAge <= 0) {
                showMessageBox('Please fill in all pet details correctly.', 'error');
                return;
            }

            showMessageBox('Pet added successfully!', 'success'); // Shortened message
            const modalElement = document.getElementById('addPetModal');
            const bsModal = bootstrap.Modal.getInstance(modalElement); 
            if (bsModal) {
                bsModal.hide();
            } else {
                modalElement.style.display = 'none';
            }
            addPetForm.reset(); 
            // NOTE: In a real app, you would refetch the pet list and render multiple pets.
            // For this single-pet demo, we're not automatically refreshing the displayed profile.
        });
    }
});
