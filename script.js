document.addEventListener('DOMContentLoaded', function() {
    // *CRITICAL STEP:* Replace the placeholder URL below with the actual "shareable" link from your Google Form.
    const GOOGLE_FORM_URL = "YOUR_GOOGLE_FORM_LINK_GOES_HERE"; 

    // Get the main registration button element
    const mainRegisterButton = document.getElementById('register-btn-main');
    
    // Get the registration button in the navigation bar
    const navRegisterButton = document.getElementById('register-btn-nav');

    // Function to handle redirection
    function redirectToRegistration() {
        // Redirect the user to the Google Form URL
        window.location.href = GOOGLE_FORM_URL;
    }

    // Attach the event listener to the main button
    if (mainRegisterButton) {
        mainRegisterButton.addEventListener('click', redirectToRegistration);
    }

    // Attach the event listener to the navigation button
    if (navRegisterButton) {
        navRegisterButton.addEventListener('click', redirectToRegistration);
    }

    // Optional: Smooth scrolling for 'Home' and 'About' links in the nav
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
