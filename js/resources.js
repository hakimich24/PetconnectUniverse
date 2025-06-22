// resources-main-scripts.js

document.addEventListener('DOMContentLoaded', function() {
  // --- Greeting Logic ---
    const greetingTextElement = document.getElementById('greeting-text'); // This is the single span
    const userDataString = localStorage.getItem('userData'); 
    let username = 'User'; // Default username

    if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData && userData.username) {
            username = userData.username;
        } else if (userData && userData.firstName) {
            username = userData.firstName;
        }
        // Optional: Redirect to login if user data not found (means not logged in)
        // else { window.location.href = 'login.html'; }
    } else {
         // If no user data (not logged in), set to 'Guest' and optionally redirect
         username = 'Guest';
         // Optional: window.location.href = 'login.html'; 
    }

    // Determine the time-based greeting prefix
    const hour = new Date().getHours();
    let greetingPrefix = "Hello,"; // Default prefix
    if (hour < 12) greetingPrefix = "Good Morning,";
    else if (hour < 18) greetingPrefix = "Good Afternoon,";
    else greetingPrefix = "Good Evening,";

    // Combine greeting prefix and username, then set to the HTML element
    if (greetingTextElement) {
        greetingTextElement.textContent = `${greetingPrefix} ${username}`;
    }

    // --- Sidebar Active Link ---
    // This ensures the current page's sidebar link is highlighted.
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.sidebar .nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Resources Search and Filter Functionality ---
    const searchInput = document.querySelector('.input-group .form-control');
    const filterButtons = document.querySelectorAll('.filter-bar .filter-button');
    // Select the direct column wrappers for the cards. This is crucial for preserving layout.
    const resourceCardWrappers = Array.from(document.querySelectorAll('.main-content .row .col-lg-6.col-md-12.mb-3'));
    const resourcesContainerForNoResults = document.querySelector('.main-content'); // To place the 'no results' message

    // Helper function to determine card category based on content
    function determineCategory(cardElement) {
        const title = cardElement.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const description = cardElement.querySelector('p.text-muted')?.textContent.toLowerCase() || '';

        // Prioritize specific keywords for categorization
        if (title.includes('potty training') || title.includes('train') || title.includes('socialise') || description.includes('commands') || title.includes('puppy')) {
            return 'training';
        } else if (title.includes('diet') || title.includes('nutrition') || description.includes('weight') || title.includes('food')) {
            return 'nutrition';
        } else if (title.includes('dental care') || title.includes('vet visits') || description.includes('check-up') || description.includes('health') || title.includes('fit')) {
            return 'health';
        } else if (title.includes('grooming') || description.includes('grooming')) {
            return 'grooming';
        }
        return 'general pet tips'; // Default category
    }

    // Assign categories to the parent column wrappers as data attributes on load
    resourceCardWrappers.forEach(colWrapper => {
        const cardElement = colWrapper.querySelector('.card');
        if (cardElement) {
            colWrapper.setAttribute('data-category', determineCategory(cardElement));
        }
    });

    // Function to filter and display resource cards
    function filterResources() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeFilter = document.querySelector('.filter-bar .filter-button.active')?.textContent.toLowerCase() || 'all';

        let cardsFound = 0;
        let existingNoResultsMessage = resourcesContainerForNoResults.querySelector('.no-results-message');

        resourceCardWrappers.forEach(colWrapper => {
            const cardCategory = colWrapper.getAttribute('data-category');
            const cardElement = colWrapper.querySelector('.card'); // Get the card inside the column
            if (!cardElement) return; // Skip if no card found

            const cardTitle = cardElement.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const cardDescription = cardElement.querySelector('p.text-muted')?.textContent.toLowerCase() || '';

            let showCard = true;

            // Check if card matches search term
            if (searchTerm && !(cardTitle.includes(searchTerm) || cardDescription.includes(searchTerm))) {
                showCard = false;
            }

            // Check if card matches active category filter
            // 'All' filter shows all cards that match the search term
            if (activeFilter !== 'all' && cardCategory !== activeFilter) {
                showCard = false;
            }

            // Show or hide the column wrapper based on filter results
            if (showCard) {
                colWrapper.style.display = ''; // Reset to default display (e.g., block, flex)
                cardsFound++;
            } else {
                colWrapper.style.display = 'none'; // Hide the entire column
            }
        });

        // Add or remove "No results" message based on cardsFound count
        if (cardsFound === 0) {
            if (!existingNoResultsMessage) {
                const noResultsMessage = document.createElement('p');
                noResultsMessage.classList.add('text-center', 'text-muted', 'mt-4', 'no-results-message');
                noResultsMessage.textContent = 'No resources found matching your criteria.';
                // Insert the message after the filter bar, but before the card row
                const filterBar = document.querySelector('.filter-bar');
                if (filterBar) {
                    filterBar.parentNode.insertBefore(noResultsMessage, filterBar.nextSibling);
                } else {
                    resourcesContainerForNoResults.appendChild(noResultsMessage);
                }
            }
        } else {
            if (existingNoResultsMessage) {
                existingNoResultsMessage.remove();
            }
        }
    }

    // --- Event Listeners ---

    // Event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', filterResources);
    }

    // Event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            this.classList.add('active');
            filterResources(); // Re-filter based on the new active button
        });
    });

    // Initial call to filterResources to apply default filters (e.g., 'All')
    // and ensure cards are displayed correctly on page load
    filterResources();
});