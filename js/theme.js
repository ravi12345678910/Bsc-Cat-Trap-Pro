// Theme Toggle and Navigation Highlight -

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

// Update button text
function updateThemeButton() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = isDark ? '☀️' : '🌓';
}
updateThemeButton();

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton();
});

// =============================================
// NAVIGATION HIGHLIGHT - FIXED
// =============================================
function setActiveNavLink() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page:', currentPage);

    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current page link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            console.log('Active link set:', href);
        }

        // Special case for index.html
        if (currentPage === '' || currentPage === 'index.html') {
            if (href === 'index.html' || href === '/') {
                link.classList.add('active');
            }
        }
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Run when URL changes (for SPAs, though we don't have one)
window.addEventListener('popstate', setActiveNavLink);