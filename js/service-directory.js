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
        username = '';
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

    // --- Service Directory Page Specific Logic ---

    // Filter Tabs Logic
    const serviceFilterTabs = document.querySelectorAll('#serviceFilterTabs .nav-link');
    const serviceCards = document.querySelectorAll('#serviceCardsContainer .card'); 

    serviceFilterTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior

            // Remove active class from all tabs
            serviceFilterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to the clicked tab
            tab.classList.add('active');

            const filterType = tab.dataset.filter.toLowerCase();

            // Filter service cards
            serviceCards.forEach(card => {
                const cardCategory = card.dataset.category ? card.dataset.category.toLowerCase() : '';
                
                if (filterType === 'all' || cardCategory === filterType) {
                    card.style.display = 'block'; // Or 'flex' depending on card's display property
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Search Input Logic
    const searchInput = document.getElementById('mainSearchInput'); // ID for the main search input
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            
            // Filter cards based on search term
            serviceCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-text').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block'; // Show card
                } else {
                    card.style.display = 'none'; // Hide card
                }
            });
        });
    }

    // Initialize display based on "All" filter being active by default
    // This ensures all cards are visible on page load before any filter is applied.
    // This is optional if your HTML already shows all by default and the initial 'active' class on 'All' tab is enough.
    // However, it's good practice for dynamic content.
    serviceFilterTabs.forEach(tab => {
        if (tab.classList.contains('active') && tab.dataset.filter === 'all') {
            serviceCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    });

});
