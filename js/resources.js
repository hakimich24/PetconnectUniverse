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

    // --- Resources Page Specific Logic ---

    // Filter Buttons Logic
    const filterButtons = document.querySelectorAll('.filter-button');
    // Target the parent div of the card (the column itself) for display toggling
    const resourceCardColumns = document.querySelectorAll('.row .col-lg-6.col-md-12.mb-3'); 

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            // Get the data-filter attribute for the clicked button
            const filterType = button.dataset.filter.toLowerCase();

            // Loop through all resource card columns to show/hide based on filter
            resourceCardColumns.forEach(column => {
                const cardCategory = column.dataset.category ? column.dataset.category.toLowerCase() : '';
                
                if (filterType === 'all' || cardCategory === filterType) {
                    column.style.display = 'block'; // Or 'flex' if your column is flex, but 'block' is safer for columns
                } else {
                    column.style.display = 'none'; // Hide the column
                }
            });
        });
    });

    // Search Input Logic (Placeholder)
    const searchInput = document.querySelector('.input-group input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            console.log('Search term:', searchTerm);
            // In a real application, you would:
            // 1. Debounce this input to avoid excessive API calls
            // 2. Send the searchTerm to your API to fetch filtered results
            // 3. Dynamically update the displayed resource cards
            if (searchTerm.length > 2 || searchTerm.length === 0) { // Search when 3+ chars or empty to clear
                // showMessageBox(`Searching for: "${searchTerm}" (mock action)`, 'info'); // Removed this line
            }
        });
    }

    // NOTE: This page does NOT have an "Add a Pet" modal button or modal HTML structure.
    // Therefore, no JavaScript logic for the Add Pet Modal (addPetModal, addPetForm, etc.) is included here
    // to prevent errors and respect your provided HTML structure.
});
