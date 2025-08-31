// --- Global State Variables and Constants ---
const API_URL = "https://digi-gaurdian-backend.onrender.com/api/users"; // Set your actual API URL here!
const SURVEY_URLS = {
    women: "https://docs.google.com/forms/d/e/1FAIpQLSe4HjKyM5alkA4Zv8DOKdNQ4sBQNnKKo_i7gqVdy4dz2pYn7A/viewform?usp=dialog",
    financial: "https://docs.google.com/forms/d/e/1FAIpQLSeuYIbN9KlLACi8FOqFUtmQOj7yRoyIVswXNOJn6hePXPV-kw/viewform?usp=dialog",
    other: "https://docs.google.com/forms/d/e/1FAIpQLScsg1n1EKGJtpUxWxzsNqVpPKwgeJsuFFeyicWkArfN6Hsiig/viewform?usp=dialog"
};
let currentModuleId = '';
let sliderInterval;
const slidesContainer = document.querySelector('.slides');
const slideItems = document.querySelectorAll('.slide');
 let counter = 0; // Add this line here

// --- Main Form Toggling and Portal Visibility Functions ---
function showLogin() {
    document.getElementById('registerSection').classList.remove('active');
    document.getElementById('loginSection').classList.add('active');
    document.getElementById('main-portal').classList.remove('visible-content');
}

function showRegister() {
    document.getElementById('loginSection').classList.remove('active');
    document.getElementById('registerSection').classList.add('active');
    document.getElementById('main-portal').classList.remove('visible-content');
}

function showMainPortal() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('main-portal').classList.add('visible-content');
    goBackToHome();

    // Reset and start the slider only when the main portal is shown
    counter = 0; // Reset the counter
    showSlide(); // Show the first slide
    clearInterval(sliderInterval); // Clear any existing interval
    sliderInterval = setInterval(() => {
        counter++;
        if (counter >= slideItems.length) counter = 0;
        showSlide();
    }, 4000);
}

// --- Registration Logic ---
const regForm = document.getElementById('registerForm');
regForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const mobile = document.getElementById('mobile').value;
    if (!/^\d{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit contact number.');
        return;
    }
    const formData = new FormData(regForm);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            regForm.reset();
            showLogin();
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again later.');
    }
});

// --- Login Logic ---
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('usernameLogin').value;
    const password = document.getElementById('passwordLogin').value;
    const button = loginForm.querySelector('.btn');
    button.classList.add('loading');
    loginMessage.classList.remove('show', 'success', 'error');

    // Simulate a successful login for demonstration purposes
    const isLoginSuccessful = true; // Set this to false to test an error case

    try {
        if (isLoginSuccessful) {
            // Replace this with your actual fetch call to the backend
            // const response = await fetch(`${API_URL}/login`, { ... });
            // const result = await response.json();
            // if (response.ok) { showMainPortal(); } else { ... }

            // Temporary success logic:
            loginMessage.textContent = "Login successful!";
            loginMessage.className = 'message show success';
            setTimeout(() => {
                showMainPortal();
            }, 1000); // 1-second delay before showing the portal
        } else {
            loginMessage.textContent = "Invalid username or password.";
            loginMessage.className = 'message show error';
        }
    } catch (error) {
        console.error('Login failed:', error);
        loginMessage.textContent = 'Login failed. Could not connect to the server.';
        loginMessage.className = 'message show error';
    } finally {
        button.classList.remove('loading');
    }
});

// --- Main Portal Functions (from second project, slightly modified) ---
function showSection(sectionId) {
    const sections = document.querySelectorAll('.nav-content, .content, #home, .survey-container, .slider, .media-gallery-section, .home-links-section, .home-learning-corner');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    const clickedButton = document.querySelector(`.nav-btn[data-section-id="${sectionId}"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    if (sectionId === 'home') {
        document.getElementById('home').style.display = 'block';
        document.getElementById('home-learning-corner').style.display = 'block';
        document.getElementById('home-media-gallery').style.display = 'block';
        document.getElementById('home-links-section').style.display = 'block';
        if (slidesContainer) {
            slidesContainer.parentElement.style.display = 'block';
        }
    }
}

function showModule(moduleId) {
    currentModuleId = moduleId;
    const homeSection = document.getElementById('home');
    if (homeSection) homeSection.style.display = 'none';
    const sliderElement = document.querySelector('.slider');
    if (sliderElement) sliderElement.style.display = 'none';
    const navSections = document.querySelectorAll('.nav-content, .content');
    navSections.forEach(section => {
        section.style.display = 'none';
    });
    const activeModule = document.getElementById(moduleId);
    if (activeModule) {
        activeModule.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
}

function goBackToHome() {
    const sections = document.querySelectorAll('.nav-content, .content, .survey-container');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('home').style.display = 'block';
    document.getElementById('home-learning-corner').style.display = 'block';
    document.getElementById('home-media-gallery').style.display = 'block';
    document.getElementById('home-links-section').style.display = 'block';
    const sliderElement = document.querySelector('.slider');
    if (sliderElement) sliderElement.style.display = 'block';
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    const homeButton = document.querySelector('.nav-btn[data-section-id="home"]');
    if (homeButton) {
        homeButton.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const homeInfoSections = document.querySelectorAll('#home-learning-corner .info-section.active');
    homeInfoSections.forEach(section => {
        section.classList.remove('active');
    });
}

function toggleSection(sectionId) {
    const infoSection = document.getElementById(sectionId);
    if (infoSection) {
        const parentContainer = infoSection.closest('.learning-corner');
        const allInfoSections = parentContainer.querySelectorAll('.info-section');
        allInfoSections.forEach(section => {
            if (section.id !== sectionId && section.classList.contains('active')) {
                section.classList.remove('active');
            }
        });
        infoSection.classList.toggle('active');
        if (infoSection.classList.contains('active')) {
            infoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function startSurvey(moduleId) {
    currentModuleId = moduleId;
    const moduleElement = document.getElementById(moduleId);
    if (moduleElement) moduleElement.style.display = 'none';
    const sliderElement = document.querySelector('.slider');
    if (sliderElement) sliderElement.style.display = 'none';
    const surveyContainer = document.getElementById('survey-container');
    if (surveyContainer) {
        surveyContainer.style.display = 'block';
        const loadingSpinner = surveyContainer.querySelector('.loading-spinner');
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
        const surveyIframe = document.getElementById('survey-iframe');
        if (surveyIframe) {
            surveyIframe.style.display = 'none';
            surveyIframe.src = SURVEY_URLS[moduleId];
            surveyIframe.onload = () => {
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (surveyIframe) surveyIframe.style.display = 'block';
            };
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goBackFromSurvey() {
    const surveyContainer = document.getElementById('survey-container');
    if (surveyContainer) surveyContainer.style.display = 'none';
    const lastModule = document.getElementById(currentModuleId);
    if (lastModule) {
        lastModule.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        goBackToHome();
    }
}

// --- Slider Functionality ---
function showSlide() {
    if (!slidesContainer || !slideItems || slideItems.length === 0) {
        return;
    }
    const slideWidth = slideItems[0].clientWidth;
    slidesContainer.style.transform = `translateX(${-counter * slideWidth}px)`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial state: show only the forms
    document.getElementById('main-portal').classList.remove('visible-content');
    document.getElementById('loginSection').classList.remove('active');
    document.getElementById('registerSection').classList.add('active');

    // Attach form link event listeners
    document.querySelector('.footer-box a').addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });

    // Attach main portal event listeners
    document.querySelectorAll('.top-nav .nav-btn').forEach(button => {
        button.addEventListener('click', () => showSection(button.dataset.sectionId));
    });
    document.querySelectorAll('.crime-card .start-btn').forEach(button => {
        button.addEventListener('click', () => showModule(button.dataset.moduleId));
    });
    document.querySelectorAll('#home-learning-corner .box').forEach(box => {
        box.addEventListener('click', () => toggleSection(box.dataset.sectionToToggle));
    });
    document.querySelectorAll('#learning .box').forEach(box => {
        box.addEventListener('click', () => toggleSection(box.dataset.sectionToToggle));
    });
    document.querySelectorAll('.content .survey-btn').forEach(button => {
        button.addEventListener('click', () => startSurvey(button.dataset.moduleId));
    });
    const surveyBackButton = document.querySelector('.survey-back-btn[data-back-from-survey]');
    if (surveyBackButton) {
        surveyBackButton.addEventListener('click', goBackFromSurvey);
    }
    document.querySelectorAll('.back-btn[data-back-to-home]').forEach(button => {
        button.addEventListener('click', goBackToHome);
    });
    const homeViewAllLinksButton = document.querySelector('#home-links-section .back-btn[data-section-id="links"]');
    if (homeViewAllLinksButton) {
        homeViewAllLinksButton.addEventListener('click', () => showSection('links'));
    }

    // Initialize slider functionality
    let counter = 0;
    const nextBtn = document.getElementById('nextSlideBtn');
    const prevBtn = document.getElementById('prevSlideBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            counter++;
            if (counter >= slideItems.length) counter = 0;
            showSlide();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            counter--;
            if (counter < 0) counter = slideItems.length - 1;
            showSlide();
        });
    }
    sliderInterval = setInterval(() => {
        counter++;
        if (counter >= slideItems.length) counter = 0;
        showSlide();
    }, 4000);
});

window.addEventListener('load', () => {
    showSlide();
    // Stop the slider when the forms are active
    if (sliderInterval && document.getElementById('main-portal').classList.contains('hidden-content')) {
        clearInterval(sliderInterval);
    }
});