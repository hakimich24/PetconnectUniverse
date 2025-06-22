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

    // --- Greeting Logic (Copied from common.js) ---
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

    // --- Dropdown Toggle Logic (Copied from common.js) ---
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

    // --- Profile Dropdown Links Activation (Copied from common.js, adapted for settings.html) ---
    // These IDs are expected to be on the <a> tags within the <p> elements in settings.html
    const settingsLink = document.querySelector('#profile-dropdown a[href="settings.html"]'); 
    const logoutLink = document.querySelector('#profile-dropdown a[href="logout.html"]'); 

    if (settingsLink) {
        settingsLink.addEventListener('click', (event) => {
            // Already on settings.html, so prevent default and just close dropdown
            event.preventDefault(); 
            if (profileDropdown) profileDropdown.style.display = 'none'; 
            // No redirection needed as we are already on this page
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            localStorage.removeItem('userToken'); 
            localStorage.removeItem('userData');  // Remove all user-related data
            showMessageBox('You have been logged out.', 'success'); 
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to login page
            }, 1000); // Short delay before redirect
            if (profileDropdown) profileDropdown.style.display = 'none'; // Close dropdown
        });
    }


    // --- Profile Information Form ---
    const profileInfoForm = document.querySelector('.col-md-6 .card:nth-of-type(1) form'); // Select first form in first col-md-6 card
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    const userLocationInput = document.getElementById('userLocation');

    // Load user data on page load
    // The username from localStorage usually contains `username` or `firstName`, not combined `firstName lastName`.
    // Let's ensure the `userNameInput` correctly displays `firstName` and `lastName`.
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData) {
            userNameInput.value = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
            userEmailInput.value = userData.email || '';
            // userLocationInput.value = userData.location || ''; // Location is not in your current userData
        }
    }

    if (profileInfoForm) {
        profileInfoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedName = userNameInput.value.trim();
            const updatedEmail = userEmailInput.value.trim();
            const updatedLocation = userLocationInput.value.trim(); // Get updated location

            if (!updatedName || !updatedEmail) {
                showMessageBox('Name and Email are required.', 'error');
                return;
            }

            showMessageBox('Saving profile changes...', 'info');

            // --- MOCKED API CALL for Profile Update ---
            setTimeout(() => {
                // In a real app, you'd send this data to your backend
                // console.log("Mocking profile update:", { name: updatedName, email: updatedEmail, location: updatedLocation });
                
                // You might update localStorage here to simulate persistence for demo purposes
                let currentLocalUserData = JSON.parse(localStorage.getItem('userData')) || {};
                const nameParts = updatedName.split(' ');
                currentLocalUserData.firstName = nameParts[0] || '';
                currentLocalUserData.lastName = nameParts.slice(1).join(' ') || '';
                currentLocalUserData.email = updatedEmail;
                // currentLocalUserData.location = updatedLocation; // Uncomment if location is handled by backend

                localStorage.setItem('userData', JSON.stringify(currentLocalUserData));

                showMessageBox('Profile updated successfully!', 'success');
            }, 1500); // Simulate network delay
        });
    }

    // --- Password Management Form ---
    // More robust selector, as forms inside cards might not always be the 2nd overall form
    const passwordForm = document.querySelector('.col-md-6 .card:nth-of-type(2) form') || document.querySelectorAll('.card form')[1]; 
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                showMessageBox('All password fields are required.', 'error');
                return;
            }
            if (newPassword !== confirmPassword) {
                showMessageBox('New passwords do not match.', 'error');
                return;
            }
            if (newPassword.length < 6) { 
                showMessageBox('New password must be at least 6 characters long.', 'error');
                return;
            }

            showMessageBox('Changing password...', 'info');

            // --- MOCKED API CALL for Password Change ---
            setTimeout(() => {
                showMessageBox('Password changed successfully!', 'success');
                passwordForm.reset(); // Clear fields
            }, 1500); // Simulate network delay
        });
    }

    // --- Notification Preferences Form ---
    const notificationForm = document.querySelector('.col-md-12 .card form') || document.querySelector('.card:last-child .btn.btn-primary').closest('form');
    const emailNotifsCheckbox = document.getElementById('emailNotifs');
    const smsNotifsCheckbox = document.getElementById('smsNotifs');
    const appNotifsCheckbox = document.getElementById('appNotifs');

    // Load mock preferences on page load (from localStorage for basic persistence demo)
    if (localStorage.getItem('notificationPreferences')) {
        const storedPreferences = JSON.parse(localStorage.getItem('notificationPreferences'));
        emailNotifsCheckbox.checked = storedPreferences.email;
        smsNotifsCheckbox.checked = storedPreferences.sms;
        appNotifsCheckbox.checked = storedPreferences.app;
    }


    if (notificationForm) {
        notificationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const preferences = {
                email: emailNotifsCheckbox.checked,
                sms: smsNotifsCheckbox.checked,
                app: appNotifsCheckbox.checked
            };

            showMessageBox('Updating preferences...', 'info');

            // --- MOCKED API CALL for Notification Preferences ---
            setTimeout(() => {
                showMessageBox('Notification preferences updated!', 'success');
                // Save to localStorage to simulate persistence
                localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
            }, 1500); // Simulate network delay
        });
    }
});
