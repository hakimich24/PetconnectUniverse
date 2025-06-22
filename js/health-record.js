document.addEventListener("DOMContentLoaded", () => {
    // API Base URL - IMPORTANT: REPLACE THIS WITH YOUR ACTUAL RENDER BACKEND API URL WHEN LIVE!
    // Example: 'https://your-petuniverse-backend.onrender.com'
    const API_BASE_URL = 'https://petuniverse-backend.onrender.com'; 

    // --- Message Box Helper Function ---
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

    // --- Greeting Logic ---
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
        // In a real app, you might redirect to login if not authenticated
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

    // --- Profile Dropdown Links Activation ---
    const settingsLink = document.getElementById('settingsLink'); 
    const logoutLink = document.getElementById('logoutLink'); 

    if (settingsLink) {
        settingsLink.addEventListener('click', (event) => {
            event.preventDefault(); 
            if (profileDropdown) profileDropdown.style.display = 'none'; 
            window.location.href = 'settings.html'; 
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); 
            localStorage.removeItem('userToken'); 
            localStorage.removeItem('userData');  
            showMessageBox('You have been logged out.', 'success'); 
            setTimeout(() => {
                window.location.href = 'login.html'; 
            }, 1000); 
            if (profileDropdown) profileDropdown.style.display = 'none'; 
        });
    }

    // --- Add Pet Modal Logic ---
    const addPetModal = document.getElementById('addPetModal'); // The main modal container
    const addPetForm = document.getElementById('addPetForm'); // The form inside the modal
    // const addPetBtn = document.getElementById('addPetBtn'); // Removed: Bootstrap handles this click via data-bs-toggle
    const cancelAddPetBtn = document.getElementById('cancelAddPet'); // The "Cancel" button in the modal

    // The "+Add a Pet" button is already handled by Bootstrap's data-bs-toggle="modal" in your HTML.
    // So, we don't need a custom event listener here to SHOW the modal.
    // Bootstrap will handle adding 'show' class and changing display.

    // Add event listener for the "Cancel" button in the modal
    if (cancelAddPetBtn && addPetModal) {
        cancelAddPetBtn.addEventListener('click', () => {
            // Bootstrap's data-bs-dismiss="modal" should handle this automatically too.
            // However, if your HTML for cancel button doesn't have it, this manual hiding is fine.
            // If it does, this is redundant but harmless.
            addPetModal.style.display = 'none'; // Hide the modal
            addPetModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        });
    }

    // Event listener for form submission
    if (addPetForm) {
        addPetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form input values using their IDs as found in your HTML
            const petName = document.getElementById('petName').value;
            const petSpecies = document.getElementById('petSpecies').value;
            const petAge = parseInt(document.getElementById('petAge').value, 10); 

            if (!petName || !petSpecies || isNaN(petAge) || petAge <= 0) {
                showMessageBox('Please fill in all pet details correctly.', 'error');
                return;
            }

            showMessageBox('Adding pet...', 'info');

            // --- MOCK API CALL for Add Pet (Active) ---
            setTimeout(() => {
                showMessageBox('Pet added successfully! (Mocked response)', 'success'); 
                // Programmatically close the Bootstrap modal (best practice)
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
            //             ownerId: currentUserId // Assuming backend expects ownerId
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
            //         // TODO: You might want to refresh pet data display on the page or redirect
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

    // --- NO OTHER HEALTH RECORD LOGIC (STATIC CONTENT ONLY) ---
    // The content for "Basic Information", "Veterinary Contact Information", 
    // "Vaccination History", and "Medical History" will remain as it is in the HTML.
    // There are no JavaScript-driven updates or interactions for these sections in this version.
});
