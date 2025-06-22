document.addEventListener("DOMContentLoaded", () => {
    // IMPORTANT: Set your backend API base URL here
    const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual backend URL

    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const messageArea = document.getElementById('resetPasswordMessage');

    // Function to display messages (success or error)
    function displayMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`; // Add type class for styling
        messageArea.style.display = 'block';
    }

    // Get the reset token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        displayMessage('Invalid or missing password reset token. Please check your link or request a new one.', 'error');
        // Optionally disable the form if no token is present
        if (resetPasswordForm) resetPasswordForm.querySelector('button[type="submit"]').disabled = true;
        return; // Stop script execution if no token
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (newPassword !== confirmPassword) {
                displayMessage('Passwords do not match.', 'error');
                return;
            }

            if (newPassword.length < 8) { // Example: enforce minimum password length
                displayMessage('Password must be at least 8 characters long.', 'error');
                return;
            }

            displayMessage('Resetting password...', 'info');

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, { // Adjust this endpoint if different in your backend routes
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, newPassword })
                });

                const result = await response.json();

                if (response.ok) {
                    displayMessage(result.message || 'Your password has been reset successfully!', 'success');
                    // Clear inputs
                    newPasswordInput.value = '';
                    confirmPasswordInput.value = '';
                    // Redirect to login page after a short delay
                    setTimeout(() => {
                        window.location.href = 'login.html'; // Assuming you have a login.html page
                    }, 2000); 
                } else {
                    displayMessage(result.message || 'Failed to reset password. Please try again.', 'error');
                    console.error('Backend Error:', result);
                }
            } catch (error) {
                console.error('Network error during password reset request:', error);
                displayMessage('Network error. Could not connect to the server.', 'error');
            }
        });
    }
});
