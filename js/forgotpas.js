document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const emailInput = document.getElementById("email");
    const forgotPasswordMessage = document.getElementById("forgotPasswordMessage");

    // Define your API Base URL (adjust if you get a live backend URL)
    // For now, it's a placeholder since we're mocking.
    const API_BASE_URL = 'http://localhost:3000'; 

    // Helper function to display messages
    function showMessage(message, type = 'info') {
        forgotPasswordMessage.textContent = message;
        // Clear existing Bootstrap alert classes
        forgotPasswordMessage.className = ''; 
        if (type === 'success') {
            forgotPasswordMessage.classList.add('alert', 'alert-success');
        } else if (type === 'error') {
            forgotPasswordMessage.classList.add('alert', 'alert-danger');
        } else {
            forgotPasswordMessage.classList.add('alert', 'alert-info');
        }
        forgotPasswordMessage.style.display = 'block'; // Ensure it's visible
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent default form submission

            const email = emailInput.value.trim();

            // Basic validation
            if (!email) {
                showMessage('Please enter your email address.', 'error');
                return;
            }

            showMessage('Sending reset link...', 'info'); // Display loading message

            // --- MOCKED API CALL FOR FRONTEND DEVELOPMENT ---
            // In a real scenario, you would uncomment the fetch call below
            // and ensure your backend's password reset endpoint is configured.
            
            // try {
            //     const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({ email }),
            //     });

            //     const data = await response.json();

            //     if (response.ok) {
            //         showMessage(data.message || 'Password reset link sent to your email!', 'success');
            //         // Optionally redirect to login or show a confirmation
            //         setTimeout(() => {
            //             window.location.href = 'login.html'; 
            //         }, 3000); 
            //     } else {
            //         showMessage(data.message || 'Failed to send reset link. Please check your email.', 'error');
            //     }
            // } catch (error) {
            //     console.error('Network or server error during password reset request:', error);
            //     showMessage('Could not connect to the server. Please try again later.', 'error');
            // }

            // --- MOCKED SUCCESS/FAILURE LOGIC ---
            // Simulate network delay
            setTimeout(() => {
                // You can toggle this to test success/failure messages
                const mockSuccess = true; // Set to 'false' to test error state

                if (mockSuccess) {
                    showMessage('Password reset link sent to your email! Please check your inbox.', 'success');
                    emailInput.value = ''; // Clear email field
                    // Optional: Redirect back to login page after a short delay
                    setTimeout(() => {
                        window.location.href = 'login.html'; 
                    }, 3000); // Redirect after 3 seconds
                } else {
                    showMessage('Failed to send reset link. Email not found or server error. Please try again.', 'error');
                }
            }, 2000); // Simulate 2-second delay
        });
    }
});
