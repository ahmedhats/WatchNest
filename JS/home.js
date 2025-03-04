import { getCookie } from '../JS/auth.js';
const colorModeBtn = document.getElementById("light");
let lastScrollTop = 0;
const navbar = document.getElementById("nav");
export function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
        colorModeBtn.classList.replace('fa-sun', 'fa-moon');
    } else {
        root.removeAttribute('data-theme');
        colorModeBtn.classList.replace('fa-moon', 'fa-sun');
    }
}
export function toggleTheme() {
    console.log("HI FROM HOME");
    const currentTheme = localStorage.getItem('theme') || 'dark';
    //get the theme from localsorage and set it to dark by deafault
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    //toggle the theme
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}
if (window.location.pathname.includes('home.html')) {
    window.addEventListener('load', () => {
        applyTheme(localStorage.getItem('theme'));
        if (getCookie('loggedIn') !== 'true') {
            window.location.href = '../HTML/index.html';// Redirect to home page if cookie found to be looged in :)
        }
    });
    colorModeBtn.addEventListener('click', () => {
        toggleTheme();
    });

    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY;

        if (scrollTop > lastScrollTop) {
            navbar.style.top = "-100px";
        } else {
            navbar.style.top = "0";
        }
        lastScrollTop = scrollTop;
    });
}