document.addEventListener("DOMContentLoaded", () => {
    // --- Greeting Logic ---
    const usernameDisplay = document.getElementById('username-display');
    const userDataString = localStorage.getItem('userData'); // Get stored user data

    if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData && userData.username) {
            // Prefer username if available
            usernameDisplay.textContent = userData.username;
        } else if (userData && userData.firstName) {
            // Fallback to first name if username is not present (less ideal for unique display)
            usernameDisplay.textContent = userData.firstName;
        } else {
            // Default if no identifiable name (should ideally not happen with proper signup)
            usernameDisplay.textContent = 'User'; 
        }
    } else {
        // If no user data is found (e.g., not logged in, or token expired/cleared)
        // You might want to redirect to login.html here for security
        usernameDisplay.textContent = 'Guest'; 
        // Example: Redirect to login if not logged in
        // window.location.href = 'login.html'; 
    }

    // --- Existing Dropdown Toggle Logic (Notifications & Profile) ---
    const notifIcon = document.getElementById('notif-icon');
    const notifDropdown = document.getElementById('notif-dropdown');
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');

    // Toggle Notification Dropdown
    if (notifIcon && notifDropdown) {
        notifIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from closing immediately
            notifDropdown.style.display = notifDropdown.style.display === 'none' ? 'block' : 'none';
            // Close other dropdown if open
            if (profileDropdown) profileDropdown.style.display = 'none';
        });
    }

    // Toggle Profile Dropdown
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from closing immediately
            profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
            // Close other dropdown if open
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
    const addPetBtn = document.querySelector('.main-content .btn-primary'); // Assumes this is the "+ Add a Pet" button
    const cancelAddPetBtn = document.getElementById('cancelAddPet');
    const updateHealthBtn = document.getElementById('updateHealthBtn');
    const cancelHealthUpdateBtn = document.getElementById('cancelHealthUpdate');
    const addPetForm = document.getElementById('addPetForm');
    const updateHealthForm = document.getElementById('updateHealthForm');


    // Add Pet Modal Logic
    if (addPetBtn && addPetModal && cancelAddPetBtn) {
        addPetBtn.addEventListener('click', () => {
            addPetModal.style.display = 'flex';
        });
        cancelAddPetBtn.addEventListener('click', () => {
            addPetModal.style.display = 'none';
            if (addPetForm) addPetForm.reset(); // Clear form on cancel
        });
    }

    // Update Health Modal Logic
    if (updateHealthBtn && updateHealthModal && cancelHealthUpdateBtn) {
        updateHealthBtn.addEventListener('click', () => {
            updateHealthModal.style.display = 'flex';
        });
        cancelHealthUpdateBtn.addEventListener('click', () => {
            updateHealthModal.style.display = 'none';
            if (updateHealthForm) updateHealthForm.reset(); // Clear form on cancel
        });
    }

    // Dummy form submission for Add Pet (replace with actual API call later)
    if (addPetForm) {
        addPetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you would collect data and send it to your backend
            const petName = document.getElementById('petName').value;
            const petSpecies = document.getElementById('petSpecies').value;
            const petAge = document.getElementById('petAge').value;
            console.log('Adding Pet (Dummy Data):', { petName, petSpecies, petAge });
            // Close modal
            if (addPetModal) addPetModal.style.display = 'none';
            // Use a custom message box instead of alert() for better UI
            alert('Pet added successfully (this is a dummy message)!'); 
            addPetForm.reset();
        });
    }

    // Dummy form submission for Update Health (replace with actual API call later)
    if (updateHealthForm) {
        updateHealthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updateVacc = document.getElementById('updateVacc').checked;
            const updateDeworm = document.getElementById('updateDeworm').checked;
            const updateSurgery = document.getElementById('updateSurgery').checked;
            console.log('Updating Health (Dummy Data):', { updateVacc, updateDeworm, updateSurgery });
            if (updateHealthModal) updateHealthModal.style.display = 'none';
            // Use a custom message box instead of alert() for better UI
            alert('Health record updated (this is a dummy message)!'); 
            updateHealthForm.reset();
        });
    }

    // --- Logout Logic ---
    // Assuming the logout button is within the profileDropdown, and it's the last <p> tag
    const logoutBtn = profileDropdown ? profileDropdown.querySelector('p:last-child') : null;
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userToken'); // Clear JWT token
            localStorage.removeItem('userData');  // Clear stored user data
            window.location.href = 'login.html'; // Redirect to login page
        });
    }
});
