document.addEventListener('DOMContentLoaded', function() {
    // Greeting functionality (already present in the original design)
    const greetingText = document.getElementById('greeting-text');
    const now = new Date();
    const hours = now.getHours();
    let greeting;

    if (hours >= 5 && hours < 12) {
        greeting = 'Good morning';
    } else if (hours >= 12 && hours < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }
    greetingText.textContent = greeting;

    // Dropdown functionality for notifications and profile
    const notifIcon = document.getElementById('notif-icon');
    const notifDropdown = document.getElementById('notif-dropdown');
    const profileIcon = document.getElementById('profile-icon');
    const profileDropdown = document.getElementById('profile-dropdown');

    function toggleDropdown(dropdownElement, iconElement) {
        // Close other dropdown if open
        if (dropdownElement === notifDropdown && profileDropdown.style.display === 'block') {
            profileDropdown.style.display = 'none';
        } else if (dropdownElement === profileDropdown && notifDropdown.style.display === 'block') {
            notifDropdown.style.display = 'none';
        }

        if (dropdownElement.style.display === 'block') {
            dropdownElement.style.display = 'none';
        } else {
            dropdownElement.style.display = 'block';
        }
    }

    notifIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent document click from immediately closing
        toggleDropdown(notifDropdown, notifIcon);
    });

    profileIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent document click from immediately closing
        toggleDropdown(profileDropdown, profileIcon);
    });

    // Close dropdowns when clicking anywhere else on the document
    document.addEventListener('click', function(event) {
        if (notifDropdown.style.display === 'block' && !notifIcon.contains(event.target) && !notifDropdown.contains(event.target)) {
            notifDropdown.style.display = 'none';
        }
        if (profileDropdown.style.display === 'block' && !profileIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.style.display = 'none';
        }
    });


    // --- Filter Functionality ---
    const filterButtons = document.querySelectorAll('.filter-button');
    const resourceCards = document.querySelectorAll('.row > [data-category]'); // Selects all columns with data-category

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' to the clicked button
            this.classList.add('active');

            const filterValue = this.dataset.filter; // Get the filter value (e.g., 'training', 'all')

            resourceCards.forEach(card => {
                const cardCategory = card.dataset.category; // Get the card's category

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block'; // Show the card
                } else {
                    card.style.display = 'none'; // Hide the card
                }
            });
        });
    });
});