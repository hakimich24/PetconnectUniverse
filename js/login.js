/* login page script */
// This function is correctly tied to your password field
function togglePassword() {
    const passwordField = document.getElementById("passwordField");
    const toggleIcon = document.getElementById("toggleIcon");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

// Main logic for the login form submission
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginMessageElement = document.getElementById("loginMessage"); // Get the new message element

    // Define your API Base URL (confirmed from app.js)
    const API_BASE_URL = 'https://petuniverse-backend.onrender.com';

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById("loginUsername").value; // Get value from new ID
            const password = document.getElementById("passwordField").value;

            // Display a loading message
            loginMessageElement.textContent = 'Logging in...';
            loginMessageElement.style.color = '#333'; // Neutral color for loading

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: username, password }), // Backend expects 'email', so map 'username' to 'email' here.
                });

                const data = await response.json(); // Parse the JSON response

                if (response.ok) { // HTTP status 200-299
                    // Login successful! Store the token and user data
                    localStorage.setItem('jwt_token', data.token);
                    localStorage.setItem('user_id', data.user.id);
                    localStorage.setItem('user_email', data.user.email);
                    localStorage.setItem('user_username', data.user.username);
                    localStorage.setItem('user_firstName', data.user.firstName);
                    localStorage.setItem('user_lastName', data.user.lastName);
                    localStorage.setItem('user_role', data.user.role);

                    loginMessageElement.style.color = 'green';
                    loginMessageElement.textContent = data.message || 'Login successful!';
                    // Redirect to your main application dashboard or home page
                    window.location.href = 'dashboard.html'; 
                } else {
                    // Login failed (e.g., 401 Unauthorized, 400 Bad Request)
                    loginMessageElement.style.color = 'red';
                    // Display the error message from the backend, or a generic one
                    loginMessageElement.textContent = data.message || 'Login failed. Please check your credentials.';
                }
            } catch (error) {
                console.error('Network or server error during login:', error);
                loginMessageElement.style.color = 'red';
                loginMessageElement.textContent = 'Could not connect to the server. Please ensure the backend is running.';
            }
        });
    }

    // --- OTHER SCRIPTS (if login.js is a general script for multiple pages) ---
    // Make sure these only run if the relevant elements exist on the page

    /* side bar navigation */
    const sidebarToggle = document.querySelector(".sidebar-toggle-button"); // Assuming you have a button to toggle sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", toggleSidebar);
    }
    function toggleSidebar() {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) {
            sidebar.classList.toggle("show");
        }
    }

    /* COMMUNITY SCREEN SCRIPT */
    const newPostBtn = document.querySelector(".new-post-btn");
    if (newPostBtn) {
        newPostBtn.addEventListener("click", function () {
            alert("New Post feature would open here!");
        });
    }

    // NOTE: The `toggleConfirmPassword` and duplicate `togglePassword` functions were removed
    // as they were either duplicates or for the registration page.
    // If you have a separate `signup.html` with a confirm password field,
    // that logic should go into a `signup.js` file for that page.
});