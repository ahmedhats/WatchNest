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
