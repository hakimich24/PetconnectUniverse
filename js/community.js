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
    // NOTE: These elements (greeting text, notification/profile icons/dropdowns)
    // were explicitly removed from community.html in the previous turn.
    // However, the common JavaScript functions for them are kept here in case
    // they are re-introduced or this JS is merged with other common scripts.
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

    // --- Community Page Specific Logic ---

    // New Post Modal Handling
    const newPostModal = document.getElementById('newPostModal');
    const newPostForm = document.getElementById('newPostForm');
    const postContentInput = document.getElementById('postContent'); // Input for the post content

    if (newPostForm) {
        newPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const postContent = postContentInput.value.trim();

            if (!postContent) {
                showMessageBox('Please write something for your post.', 'error');
                return;
            }

            showMessageBox('Submitting post...', 'info');

            // --- MOCK API CALL for New Post ---
            setTimeout(() => {
                showMessageBox('Post successfully sent', 'success'); // Updated message
                postContentInput.value = ''; // Clear the textarea
                const modalInstance = bootstrap.Modal.getInstance(newPostModal);
                if (modalInstance) {
                    modalInstance.hide(); // Close the modal
                }
                // In a real application, you would typically:
                // 1. Send the postContent to your backend API
                // 2. Refresh the list of posts to show the new one
            }, 1500);

            /*
            // --- LIVE API CALL for New Post (Commented out - Uncomment and configure when backend is ready) ---
            // const userToken = localStorage.getItem('userToken');
            // if (!userToken || !currentUserId) {
            //     showMessageBox('Authentication required to create a post. Please log in again.', 'error');
            //     setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            //     return;
            // }
            //
            // try {
            //     const response = await fetch(`${API_BASE_URL}/api/posts`, { // Adjust endpoint as per your backend
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${userToken}` 
            //         },
            //         body: JSON.stringify({ 
            //             content: postContent,
            //             authorId: currentUserId // Assuming backend expects authorId
            //         })
            //     });
            //
            //     const result = await response.json();
            //
            //     if (response.ok) {
            //         showMessageBox(result.message || 'Your post has been submitted!', 'success'); 
            //         postContentInput.value = ''; 
            //         const modalInstance = bootstrap.Modal.getInstance(newPostModal);
            //         if (modalInstance) modalInstance.hide();
            //         // TODO: Refresh posts on page
            //     } else {
            //         if (response.status === 401 || response.status === 403) {
            //              showMessageBox('Authentication failed. Please log in again.', 'error');
            //              setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            //         } else {
            //             showMessageBox(result.message || 'Failed to submit post. Please check console for details.', 'error');
            //         }
            //         console.error('New Post API Error:', result);
            //     }
            // } catch (error) {
            //     console.error('Network error during New Post:', error);
            //     showMessageBox('Network error. Could not connect to the server. (Is backend running and URL correct?)', 'error');
            // }
            */
        });
    }

    // No other page-specific interactive elements identified for this version.
    // The "View More" links for featured posts and "thread.html" links for Q&A are static for now.
});
