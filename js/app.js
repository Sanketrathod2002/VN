document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    fetchDynamicData();
});

/**
 * Handles the mobile navigation menu toggle
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const icon = mobileMenuToggle?.querySelector('i');

    if (mobileMenuToggle && navMenu && icon) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            
            // Toggle between hamburger and close icons
            icon.classList.toggle('fa-bars', !isActive);
            icon.classList.toggle('fa-times', isActive);
        });
    }
}

/**
 * Fetches and displays dynamic content from Google Sheets
 */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyICZeaCAVLM1a48pbOmNcs90j4W29eKFoT6zgzzjXsxL6f1czJJcFHoWSPSMpI-Pjk-A/exec";

async function fetchDynamicData() {
    const tickerElement = document.getElementById('dynamic-ticker');
    const noticesElement = document.getElementById('dynamic-notices');

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // 1. Populate Latest Updates (Ticker)
        if (tickerElement && data.updates) {
            tickerElement.innerHTML = data.updates
                .map(item => item.text)
                .join(" &nbsp; | &nbsp; ");
        }

        // 2. Populate Notice Board
        if (noticesElement && data.notices) {
            noticesElement.innerHTML = ""; // Clear loader
            
            data.notices.forEach(notice => {
                const li = document.createElement('li');
                
                // Format the date (DD/MM/YYYY)
                const formattedDate = new Date(notice.date).toLocaleDateString('en-GB');
                
                // Create "New" badge if applicable
                const newBadge = notice.isNew ? ' <img src="images/latest-news-blink-img.gif" alt="New">' : '';
                
                li.innerHTML = `<strong>${formattedDate}:</strong> ${notice.text}${newBadge}`;
                noticesElement.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        if (tickerElement) tickerElement.innerText = "Welcome to Jai Janta Education Society.";
        if (noticesElement) noticesElement.innerHTML = "<li>Unable to load notices at this time.</li>";
    }
}
