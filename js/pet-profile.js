document.addEventListener("DOMContentLoaded", () => {
    // API Base URL - IMPORTANT: REPLACE THIS WITH YOUR ACTUAL RENDER BACKEND API URL WHEN LIVE!
    // Example: 'https://your-petuniverse-backend.onrender.com'
    const API_BASE_URL = 'https://petuniverse-backend.onrender.com'; 

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
    let currentUserId = null; // To store the logged-in user's ID for future API use

    if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData && userData.username) {
            username = userData.username;
        } else if (userData && userData.firstName) {
            username = userData.firstName;
        }
        if (userData && userData.id) { // Assuming 'id' is part of userData from login
            currentUserId = userData.id; 
        }
    } else {
        username = 'Guest';
        // Optional: In a real app, you might redirect to login if not authenticated
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

    // --- Dropdown Toggle Logic (Notifications & Profile) ---
    const notifIcon = document.getElementById('notif-icon');
    const notifDropdown = document.getElementById('notif-dropdown');
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');

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
    // Ensure these IDs are added to your HTML <a> tags as suggested previously
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

    // --- Add Pet Modal Logic ---
    const addPetModal = document.getElementById('addPetModal'); // The main modal container
    const addPetForm = document.getElementById('addPetForm'); // The form inside the modal

    if (addPetForm) {
        addPetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form input values using their IDs as found in your HTML
            const petName = document.getElementById('petName').value;
            // CORRECTED: Use 'species' as the ID, not 'petSpecies' to match your HTML
            const petSpecies = document.getElementById('species').value; 
            const petAge = parseInt(document.getElementById('age').value, 10); 

            if (!petName || !petSpecies || isNaN(petAge) || petAge <= 0) {
                showMessageBox('Please fill in all pet details correctly.', 'error');
                return;
            }

            showMessageBox('Adding pet...', 'info');

            // --- MOCK API CALL for Add Pet (Active) ---
            setTimeout(() => {
                showMessageBox('Pet added successfully! (Mocked response)', 'success'); 
                // Programmatically close the Bootstrap modal
                const modalInstance = bootstrap.Modal.getInstance(addPetModal);
                if (modalInstance) {
                    modalInstance.hide();
                } else {
                    // Fallback for manual hide if Bootstrap's JS isn't initialized or modal not registered
                    addPetModal.style.display = 'none';
                    addPetModal.classList.remove('show');
                    document.body.classList.remove('modal-open');
                }
                addPetForm.reset(); // Clear the form fields
                // In a real application, you would typically re-fetch and display the updated list of pets here.
                // For this example, since Benny is hardcoded, no visual change will happen from 'add pet'.
            }, 1500); 

            /*
            // --- LIVE API CALL for Add Pet (Commented out - Uncomment and configure when backend is ready) ---
            // const userToken = localStorage.getItem('userToken');
            // if (!userToken || !currentUserId) {
            //     showMessageBox('Authentication required to add pet. Please log in again.', 'error');
            //     setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            //     return;
            // }
            //
            // try {
            //     const response = await fetch(`${API_BASE_URL}/api/pets`, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${userToken}` 
            //         },
            //         body: JSON.stringify({ 
            //             name: petName, 
            //             species: petSpecies, 
            //             age: petAge,
            //             ownerId: currentUserId 
            //         })
            //     });
            //
            //     const result = await response.json();
            //
            //     if (response.ok) {
            //         showMessageBox(result.message || 'Pet added successfully!', 'success'); 
            //         const modalInstance = bootstrap.Modal.getInstance(addPetModal);
            //         if (modalInstance) modalInstance.hide();
            //         addPetForm.reset(); 
            //         // TODO: Refresh pet data display on the page
            //     } else {
            //         if (response.status === 401 || response.status === 403) {
            //              showMessageBox('Authentication failed. Please log in again.', 'error');
            //              setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            //         } else {
            //             showMessageBox(result.message || 'Failed to add pet. Please check console for details.', 'error');
            //         }
            //         console.error('Add Pet API Error:', result);
            //     }
            // } catch (error) {
            //     console.error('Network error during Add Pet:', error);
            //     showMessageBox('Network error. Could not connect to the server. (Is backend running and URL correct?)', 'error');
            // }
            */
        });
    }

    // --- Pet Profile Specific Logic for Edit and Delete ---
    const deletePetBtn = document.getElementById('deletePetBtn');
    const editProfileBtn = document.getElementById('editProfileBtn'); // The button to open the edit modal
    const editProfileModal = document.getElementById('editProfileModal'); // The edit pet modal container
    const editPetForm = document.getElementById('editPetForm'); // The form inside the edit modal

    // Select Benny's pet card. This will need to be dynamic if you have multiple pets
    const bennyCard = document.querySelector('.profile-card'); 

    // Function to populate the Edit Pet Modal with the currently displayed pet's data (Benny's data)
    function populateEditPetModal() {
        if (bennyCard) {
            // Extract text content and clean it up
            document.getElementById('editSpecies').value = bennyCard.querySelector('p:nth-of-type(1)').textContent.replace('Species:', '').trim();
            document.getElementById('editGender').value = bennyCard.querySelector('p:nth-of-type(2)').textContent.replace('Gender:', '').trim();
            document.getElementById('editBreed').value = bennyCard.querySelector('p:nth-of-type(3)').textContent.replace('Breed:', '').trim();
            // For age, parse as int and remove " years old"
            document.getElementById('editAge').value = parseInt(bennyCard.querySelector('p:nth-of-type(4)').textContent.replace('Age:', '').replace('years old', '').trim(), 10);
            document.getElementById('editColor').value = bennyCard.querySelector('p:nth-of-type(5)').textContent.replace('Color:', '').trim();
            document.getElementById('editDiet').value = bennyCard.querySelector('p:nth-of-type(6)').textContent.replace('Diet:', '').trim();
        }
    }

    // Event listener for the "Edit Profile" button
    if (editProfileBtn && editProfileModal) {
        editProfileBtn.addEventListener('click', () => {
            populateEditPetModal(); // Populate the modal with existing data
            const modalInstance = new bootstrap.Modal(editProfileModal); // Initialize Bootstrap modal
            modalInstance.show(); // Show the modal
        });
    }

    // Event listener for the "Delete Pet" button
    if (deletePetBtn) {
        deletePetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete Benny\'s profile? This action cannot be undone.')) {
                showMessageBox('Deleting pet...', 'info');

                // --- MOCK API CALL for Delete Pet ---
                setTimeout(() => {
                    // Simulate deletion by removing Benny's card from the DOM
                    if (bennyCard) {
                        bennyCard.closest('.col-md-4').remove(); // Remove the parent column that holds the card
                        showMessageBox('Benny\'s profile deleted successfully! (Mocked response)', 'success');
                    } else {
                        showMessageBox('Could not find pet card to delete.', 'error');
                    }
                }, 1000);

                /*
                // --- LIVE API CALL for Delete Pet (Commented out - Uncomment and configure when backend is ready) ---
                // In a real app, you would have a pet ID associated with the card.
                // For example: const petIdToDelete = bennyCard.dataset.petId; // Assuming you add data-pet-id="[id]" to the card
                // if (!userToken || !petIdToDelete) { ... }
                // try {
                //     const response = await fetch(`${API_BASE_URL}/api/pets/${petIdToDelete}`, {
                //         method: 'DELETE',
                //         headers: {
                //             'Authorization': `Bearer ${userToken}`
                //         }
                //     });
                //
                //     if (response.ok) {
                //         showMessageBox('Pet deleted successfully!', 'success');
                //         if (bennyCard) bennyCard.closest('.col-md-4').remove(); // Remove the HTML card
                //     } else {
                //         const result = await response.json();
                //         showMessageBox(result.message || 'Failed to delete pet.', 'error');
                //         console.error('Delete Pet API Error:', result);
                //     }
                // } catch (error) {
                //     console.error('Network error during Delete Pet:', error);
                //     showMessageBox('Network error. Could not connect to the server.', 'error');
                // }
                */
            }
        });
    }

    // Event listener for the Edit Pet Form submission
    if (editPetForm) {
        editPetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get updated values from the edit form's input fields
            const editedSpecies = document.getElementById('editSpecies').value;
            const editedGender = document.getElementById('editGender').value;
            const editedBreed = document.getElementById('editBreed').value;
            const editedAge = parseInt(document.getElementById('editAge').value, 10);
            const editedColor = document.getElementById('editColor').value;
            const editedDiet = document.getElementById('editDiet').value;

            // Basic validation
            if (!editedSpecies || isNaN(editedAge) || editedAge <= 0) {
                showMessageBox('Please fill in required fields for editing (Species, Age).', 'error');
                return;
            }

            showMessageBox('Saving changes...', 'info');

            // --- MOCK API CALL for Edit Pet ---
            setTimeout(() => {
                // Simulate updating the Benny card's displayed information directly in the DOM
                if (bennyCard) {
                    bennyCard.querySelector('p:nth-of-type(1)').innerHTML = `<strong>Species:</strong> ${editedSpecies}`;
                    bennyCard.querySelector('p:nth-of-type(2)').innerHTML = `<strong>Gender:</strong> ${editedGender}`;
                    bennyCard.querySelector('p:nth-of-type(3)').innerHTML = `<strong>Breed:</strong> ${editedBreed}`;
                    bennyCard.querySelector('p:nth-of-type(4)').innerHTML = `<strong>Age:</strong> ${editedAge} years old`;
                    bennyCard.querySelector('p:nth-of-type(5)').innerHTML = `<strong>Color:</strong> ${editedColor}`;
                    bennyCard.querySelector('p:nth-of-type(6)').innerHTML = `<strong>Diet:</strong> ${editedDiet}`;
                    showMessageBox('Pet profile updated successfully! (Mocked response)', 'success');
                } else {
                    showMessageBox('Error: Could not find pet card to update.', 'error');
                }

                // Programmatically close the Bootstrap modal after successful update
                const modalInstance = bootstrap.Modal.getInstance(editProfileModal);
                if (modalInstance) {
                    modalInstance.hide();
                } else {
                    // Fallback for manual hide
                    editProfileModal.style.display = 'none';
                    editProfileModal.classList.remove('show');
                    document.body.classList.remove('modal-open');
                }
            }, 1500); // Simulate API call delay

            /*
            // --- LIVE API CALL for Edit Pet (Commented out - Uncomment and configure when backend is ready) ---
            // In a real app, you would have a pet ID (e.g., from a hidden input or data attribute on the modal).
            // const petIdToEdit = document.getElementById('editPetId').value; // Assuming a hidden input for pet ID
            // if (!userToken || !petIdToEdit) { ... }
            // try {
            //     const response = await fetch(`${API_BASE_URL}/api/pets/${petIdToEdit}`, {
            //         method: 'PUT', // Or PATCH
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${userToken}`
            //         },
            //         body: JSON.stringify({
            //             species: editedSpecies,
            //             gender: editedGender,
            //             breed: editedBreed,
            //             age: editedAge,
            //             color: editedColor,
            //             diet: editedDiet
            //             // Include all fields your backend expects for an update
            //         })
            //     });
            //
            //     const result = await response.json();
            //     if (response.ok) {
            //         showMessageBox(result.message || 'Pet profile updated successfully!', 'success');
            //         // TODO: Re-render the pet card(s) or refresh the data to show changes
            //         const modalInstance = bootstrap.Modal.getInstance(editProfileModal);
            //         if (modalInstance) modalInstance.hide();
            //     } else {
            //         if (response.status === 401 || response.status === 403) {
            //             showMessageBox('Authentication failed. Please log in again.', 'error');
            //             setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            //         } else {
            //             showMessageBox(result.message || 'Failed to update pet profile. Please check console.', 'error');
            //         }
            //         console.error('Edit Pet API Error:', result);
            //     }
            // } catch (error) {
            //     console.error('Network error during Edit Pet:', error);
            //     showMessageBox('Network error. Could not connect to the server.', 'error');
            // }
            */
        });
    }

    // --- NO OTHER HEALTH RECORD LOGIC (STATIC CONTENT ONLY) ---
    // The content for "Basic Information", "Veterinary Contact Information", 
    // "Vaccination History", and "Medical History" will remain as it is in the HTML.
    // There are no JavaScript-driven updates or interactions for these sections in this version.
});