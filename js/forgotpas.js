document.addEventListener("DOMContentLoaded", () => {
    // IMPORTANT: Set your backend API base URL here.
    // This must match where your backend is running (e.g., 'http://localhost:3000' or your Render URL).
    const API_BASE_URL = 'https://petuniverse-backend.onrender.com'; // <<<--- UPDATE THIS TO YOUR ACTUAL BACKEND URL

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('email');
    const messageArea = document.getElementById('forgotPasswordMessage');

    /**
     * Displays a message in the designated message area.
     * @param {string} message - The message text to display.
     * @param {'info' | 'success' | 'error'} type - The type of message (for styling).
     */
    function displayMessage(message, type) {
        messageArea.textContent = message;
        // Set Bootstrap alert classes based on type for visual feedback
        messageArea.className = `alert mt-3 alert-${type}`; 
        messageArea.style.display = 'block';
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission to handle it with JavaScript

            const email = emailInput.value.trim();

            if (!email) {
                displayMessage('Please enter your email address.', 'danger'); // Use 'danger' for error styling
                return;
            }

            // Show a loading/info message while the request is being sent
            displayMessage('Sending reset link...', 'info');

            try {
                // Make a POST request to your backend's forgot password API endpoint
                const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Specify that we're sending JSON
                    },
                    body: JSON.stringify({ email }) // Send the email in JSON format
                });

                const result = await response.json(); // Parse the JSON response from the backend

                if (response.ok) { // Check if the HTTP status code is 2xx (success)
                    // Display success message. Your backend sends 'message' field.
                    // For security, it's generally good practice to give a generic success message
                    // (e.g., "If an account exists...") even if the email isn't found,
                    // to prevent users from guessing valid email addresses.
                    displayMessage(result.message || 'If an account exists, a password reset link has been sent to your email.', 'success');
                    emailInput.value = ''; // Clear the input field on success
                } else {
                    // Handle errors from the backend (e.g., 400 Bad Request, 404 Not Found, 500 Server Error)
                    // Display the error message provided by the backend, or a generic one
                    displayMessage(result.message || 'Failed to send reset link. Please try again.', 'danger');
                    console.error('Backend Error:', result); // Log the full error for debugging
                }
            } catch (error) {
                // Handle network errors (e.g., server is down, no internet connection)
                console.error('Network error during forgot password request:', error);
                displayMessage('Network error. Could not connect to the server. Please check your internet connection or the API URL.', 'danger');
            }
        });
    }
});
