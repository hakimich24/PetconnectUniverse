document.addEventListener("DOMContentLoaded", () => {
    // API Base URL - Make sure this matches your backend's actual deployed URL or localhost:3000
    // IMPORTANT: If you deploy your frontend and want to connect to a live backend,
    // this URL must be updated to your Render backend API URL (e.g., 'https://your-petuniverse-backend.onrender.com')
    const API_BASE_URL = 'http://localhost:3000'; 

    // --- Greeting Logic ---
    const greetingTextElement = document.getElementById('greeting-text'); // This is the single span
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
    }

    // Determine the time-based greeting prefix
    const hour = new Date().getHours();
    let greetingPrefix = "Hello,"; // Default prefix
    if (hour < 12) greetingPrefix = "Good Morning,";
    else if (hour < 18) greetingPrefix = "Good Afternoon,";
    else greetingPrefix = "Good Evening,";

    // Combine greeting prefix and username, then set to the HTML element
    if (greetingTextElement) {
        greetingTextElement.textContent = `${greetingPrefix} ${username}`;
    }


    // --- Existing Dropdown Toggle Logic (Notifications & Profile) ---
    const notifIcon = document.getElementById('notif-icon');
    const notifDropdown = document.getElementById('notif-dropdown');
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');

    // Toggle Notification Dropdown
    if (notifIcon && notifDropdown) {
        notifIcon.addEventListener('click', (event) => {
            event.stopPropagation(); 
            notifDropdown.style.display = notifDropdown.style.display === 'none' ? 'block' : 'none';
            if (profileDropdown) profileDropdown.style.display = 'none';
        });
    }

    // Toggle Profile Dropdown
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', (event) => {
            event.stopPropagation(); 
            profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
            if (notifDropdown) notifDropdown.style.display = 'none';
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

    // --- Modal Logic (Add Pet & Update Health) ---
    const addPetModal = document.getElementById('addPetModal');
    const updateHealthModal = document.getElementById('updateHealthModal');
    const addPetBtn = document.querySelector('.main-content .btn-primary'); 
    const cancelAddPetBtn = document.getElementById('cancelAddPet');
    const updateHealthBtn = document.getElementById('updateHealthBtn'); 
    const cancelHealthUpdateBtn = document.getElementById('cancelHealthUpdate');
    const addPetForm = document.getElementById('addPetForm');
    const updateHealthForm = document.getElementById('updateHealthForm');
    
    // Message box element (to replace alert())
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


    // Add Pet Modal Logic
    if (addPetBtn && addPetModal && cancelAddPetBtn) {
        addPetBtn.addEventListener('click', () => {
            addPetModal.style.display = 'flex';
        });
        cancelAddPetBtn.addEventListener('click', () => {
            addPetModal.style.display = 'none';
            if (addPetForm) addPetForm.reset(); 
        });
        // Close modal when clicking outside
        addPetModal.addEventListener('click', (event) => {
            if (event.target === addPetModal) {
                addPetModal.style.display = 'none';
                if (addPetForm) addPetForm.reset();
            }
        });
    }

    // Update Health Modal Logic
    if (updateHealthBtn && updateHealthModal && cancelHealthUpdateBtn) {
        updateHealthBtn.addEventListener('click', () => {
            updateHealthModal.style.display = 'flex';
        });
        cancelHealthUpdateBtn.addEventListener('click', () => {
            updateHealthModal.style.display = 'none';
            if (updateHealthForm) updateHealthForm.reset(); 
        });
        // Close modal when clicking outside
        updateHealthModal.addEventListener('click', (event) => {
            if (event.target === updateHealthModal) {
                updateHealthModal.style.display = 'none';
                if (updateHealthForm) updateHealthForm.reset();
            }
        });
    }

    // --- Add Pet Form Submission (MOCKED API Call) ---
    if (addPetForm) {
        addPetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const petName = document.getElementById('petName').value;
            const petSpecies = document.getElementById('petSpecies').value;
            const petAge = parseInt(document.getElementById('petAge').value, 10); 

            // Basic validation
            if (!petName || !petSpecies || isNaN(petAge) || petAge <= 0) {
                showMessageBox('Please fill in all pet details correctly.', 'error');
                return;
            }

            // --- MOCKED SUCCESS LOGIC for Add Pet ---
            showMessageBox('Pet added successfully!', 'success'); 
            if (addPetModal) addPetModal.style.display = 'none'; 
            addPetForm.reset(); 
        });
    }

    // --- Update Health Form Submission (MOCKED API Call) ---
    if (updateHealthForm) {
        updateHealthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updateVacc = document.getElementById('updateVacc').checked;
            const updateDeworm = document.getElementById('updateDeworm').checked;
            const updateSurgery = document.getElementById('updateSurgery').checked;

            console.log('Update Health (Mocked):', { updateVacc, updateDeworm, updateSurgery }); 
            showMessageBox('Health record updated successfully!', 'success'); 
            if (updateHealthModal) updateHealthModal.style.display = 'none'; 
            updateHealthForm.reset(); 
        });
    }

    // --- Profile Dropdown Links Activation ---
    const settingsLink = document.getElementById('settingsLink'); 
    const logoutLink = document.getElementById('logoutLink'); 

    if (settingsLink) {
        settingsLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if it's an <a> tag
            if (profileDropdown) profileDropdown.style.display = 'none'; // Close dropdown first
            window.location.href = 'settings.html'; // Redirect to your settings page
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if it's an <a> tag
            localStorage.removeItem('userToken'); 
            localStorage.removeItem('userData');  // Remove all user-related data
            showMessageBox('You have been logged out.', 'success'); // Optional: show message before redirect
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to login page
            }, 1000); // Short delay before redirect
            if (profileDropdown) profileDropdown.style.display = 'none'; // Close dropdown
        });
    }
});
