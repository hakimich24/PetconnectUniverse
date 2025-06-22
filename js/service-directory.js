// main-scripts.js

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

    // --- Service Directory Search and Filter Functionality 
    const searchInput = document.querySelector('.search-section-bg input[type="text"]');
    const navTabs = document.querySelectorAll('.nav-tabs .nav-link');
    

    // Get all initial service cards to work with them
    const originalServiceCards = Array.from(document.querySelectorAll('.main-content > .card.mb-3'));
    const paginationNav = document.querySelector('.main-content > nav[aria-label="Page navigation"]');

    function renderCards(cardsToDisplay) {
        // Clear all current content below the search/tabs in main-content
        // Find the boundary: the last element of search-section-bg
        const searchSectionEnd = document.querySelector('.search-section-bg');
        let nextSibling = searchSectionEnd.nextElementSibling;
        while (nextSibling) {
            let temp = nextSibling.nextElementSibling;
            nextSibling.remove(); // Remove the element
            nextSibling = temp;
        }

        const mainContent = document.querySelector('.main-content'); // Get the main content container

        if (cardsToDisplay.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.classList.add('text-center', 'text-muted', 'mt-4');
            noResultsMessage.textContent = 'No services found matching your criteria.';
            mainContent.appendChild(noResultsMessage);
        } else {
            cardsToDisplay.forEach(card => {
                mainContent.appendChild(card.cloneNode(true)); // Append a clone of the original card
            });
            // Re-append pagination if it exists
            if (paginationNav) {
                mainContent.appendChild(paginationNav.cloneNode(true));
            }
        }
    }


    // Function to filter services based on search and active tab
    function filterServices() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeTab = document.querySelector('.nav-tabs .nav-link.active').textContent.toLowerCase();

        const filteredCards = originalServiceCards.filter(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-text').textContent.toLowerCase();
            let matchesSearch = true;
            let matchesCategory = true;

            // Check search term
            if (searchTerm && !(title.includes(searchTerm) || description.includes(searchTerm))) {
                matchesSearch = false;
            }

            // Check category (tab)
            if (activeTab === 'veterinarians') {
                if (!(title.includes('dr.') || title.includes('veterinarian') || description.includes('veterinarian') || title.includes('vet'))) {
                    matchesCategory = false;
                }
            } else if (activeTab === 'clinics') {
                if (!(title.includes('clinic') || description.includes('clinic'))) {
                    matchesCategory = false;
                }
            }
            // For 'all' tab, matchesCategory remains true

            return matchesSearch && matchesCategory;
        });

        renderCards(filteredCards);
    }

    // Event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', filterServices);
    }

    // Event listeners for navigation tabs
    navTabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior

            // Remove 'active' class from all tabs
            navTabs.forEach(t => t.classList.remove('active'));

            // Add 'active' class to the clicked tab
            this.classList.add('active');

            filterServices(); // Re-filter based on the new active tab
        });
    });

    // Initial render of all cards when the page loads
    renderCards(originalServiceCards);
});