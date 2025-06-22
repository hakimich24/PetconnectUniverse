// js/signup.js
// js/signup.js
console.log("signup.js file loaded."); // ADD THIS LINE

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired."); // ADD THIS LINE

    // DOM elements
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const toggleConfirmBtn = document.getElementById("toggleConfirm");
    const passwordMatchMsg = document.getElementById("passwordMatchMsg");
    const signupForm = document.getElementById("signupForm");
    const signupMessageElement = document.getElementById("signupMessage");

    console.log("Form element found:", signupForm); // ADD THIS LINE

    // API Base URL
    const API_BASE_URL = 'http://localhost:8080';

    // ... (rest of your code)

    // Backend Integration for Registration
    if (signupForm) {
        console.log("Attaching submit event listener to form."); // ADD THIS LINE
        signupForm.addEventListener("submit", async (event) => {
            console.log("Form submit event triggered!"); // ADD THIS LINE
            event.preventDefault(); // Prevent default form submission
            console.log("Default form submission prevented."); // ADD THIS LINE

            // Get form values, trimming whitespace
            const firstName = document.getElementById("firstName").value.trim();
            const lastName = document.getElementById("lastName").value.trim();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const roleField = document.getElementById("field").value.trim();

            console.log("Form data collected:", { firstName, lastName, username, email, role: roleField }); // ADD THIS LINE

            // ... (rest of your form submission logic)
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirmPassword");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const toggleConfirmBtn = document.getElementById("toggleConfirm");
    const passwordMatchMsg = document.getElementById("passwordMatchMsg");
    const signupForm = document.getElementById("signupForm"); // Get the form by its new ID
    const signupMessageElement = document.getElementById("signupMessage"); // Get the new message display element

    // API Base URL (confirmed from app.js)
    const API_BASE_URL = 'https://petuniverse-backend.onrender.com';

    // --- Password Toggle Logic ---
    if (togglePasswordBtn && passwordField) {
        togglePasswordBtn.addEventListener("click", () => {
            const type = passwordField.type === "password" ? "text" : "password";
            passwordField.type = type;
            togglePasswordBtn.textContent = type === "password" ? "Show" : "Hide";
        });
    }

    if (toggleConfirmBtn && confirmPasswordField) {
        toggleConfirmBtn.addEventListener("click", () => {
            const type = confirmPasswordField.type === "password" ? "text" : "password";
            confirmPasswordField.type = type;
            toggleConfirmBtn.textContent = type === "password" ? "Show" : "Hide";
        });
    }

    // --- Password Match Check Logic ---
    const checkPasswordMatch = () => {
        if (passwordField.value && confirmPasswordField.value) { // Only check if both have values
            if (passwordField.value !== confirmPasswordField.value) {
                passwordMatchMsg.textContent = "Passwords do not match!";
                passwordMatchMsg.classList.add("text-danger");
                passwordMatchMsg.classList.remove("text-success");
            } else {
                passwordMatchMsg.textContent = "Passwords match!"; // Optional: show positive message
                passwordMatchMsg.classList.add("text-success");
                passwordMatchMsg.classList.remove("text-danger");
            }
        } else {
            passwordMatchMsg.textContent = ""; // Clear message if fields are empty
            passwordMatchMsg.classList.remove("text-danger", "text-success");
        }
    };

    if (passwordField && confirmPasswordField && passwordMatchMsg) {
        passwordField.addEventListener("input", checkPasswordMatch);
        confirmPasswordField.addEventListener("input", checkPasswordMatch);
    }


    // --- Backend Integration for Registration ---
    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent default form submission

            const firstName = document.getElementById("firstName").value.trim();
            const lastName = document.getElementById("lastName").value.trim();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const roleField = document.getElementById("field").value.trim(); // 'field' mapped to 'role'

            // Client-side validation
            if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
                if (signupMessageElement) {
                    signupMessageElement.style.color = 'red';
                    signupMessageElement.textContent = 'Please fill in all required fields.';
                }
                return;
            }

            if (password !== confirmPassword) {
                if (signupMessageElement) {
                    signupMessageElement.style.color = 'red';
                    signupMessageElement.textContent = 'Passwords do not match!';
                }
                return;
            }

            if (signupMessageElement) {
                signupMessageElement.textContent = 'Registering...';
                signupMessageElement.style.color = '#333'; // Neutral color for loading
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        username,
                        email,
                        password,
                        role: roleField || 'PET_OWNER' // Use roleField, default to PET_OWNER if empty
                    }),
                });

                const data = await response.json(); // Parse the JSON response

                if (response.ok) { // HTTP status 200-299 (201 Created for registration)
                    // Registration successful! Store the token and user data
                    localStorage.setItem('jwt_token', data.token);
                    localStorage.setItem('user_id', data.user.id);
                    localStorage.setItem('user_email', data.user.email);
                    localStorage.setItem('user_username', data.user.username);
                    localStorage.setItem('user_firstName', data.user.firstName);
                    localStorage.setItem('user_lastName', data.user.lastName);
                    localStorage.setItem('user_role', data.user.role);

                    if (signupMessageElement) {
                        signupMessageElement.style.color = 'green';
                        signupMessageElement.textContent = data.message || 'Registration successful! Redirecting...';
                    }
                    // Redirect to your main application dashboard or login page
                    setTimeout(() => { // Give user time to read success message before redirect
                        window.location.href = 'login.html'; // Or 'dashboard.html' or 'login.html'
                    }, 1500); // Redirect after 1.5 seconds

                } else {
                    // Registration failed (e.g., 400 Bad Request, 409 Conflict if user exists)
                    if (signupMessageElement) {
                        signupMessageElement.style.color = 'red';
                        signupMessageElement.textContent = data.message || 'Registration failed. Please try again.';
                    }
                }
            } catch (error) {
                console.error('Network or server error during registration:', error);
                if (signupMessageElement) {
                    signupMessageElement.style.color = 'red';
                    signupMessageElement.textContent = 'Could not connect to the server. Please ensure the backend is running.';
                }
            }
        });
    }
});