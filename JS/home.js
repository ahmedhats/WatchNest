import { getCookie } from '../JS/auth.js';
const colorModeBtn = document.getElementById("light");
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
    const currentTheme = localStorage.getItem('theme') || 'dark';
    //get the theme from localsorage and set it to dark by deafault
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    //toggle the theme
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}
if (window.location.pathname.includes('home.html')) {
window.addEventListener('load', () => {
    if (getCookie('loggedIn') !== 'true') {
        window.location.href = '../HTML/index.html';// Redirect to home page if cookie found to be looged in :)
    }
});
}