//log in form handling throw DOM
const authForm = document.getElementById('authForm');//the form as a whole
const formTitle = document.getElementById('form-title');//log in / sign up to WatchNest
const confirmPasswordGroup = document.getElementById('confirm-password-group');//confirm password if signing up
const authButton = document.getElementById('authButton');//the submit button wich is signup or login
const messageEl = document.getElementById('message');//the messege that inform user about any thing 
const toggleForm = document.getElementById('toggleForm');//should used to change from log in to sign up or vice versa

let isSignUp = false; // log in by deafault

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);//encoding data to match the crypto.subtl.digest format
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    //converting the binary data retuned from hashing API into a unit8 java script normal array then mapping it into hexadecimal finally making it an intact string
}

// Function to set a cookie if user clicked remember me 
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    //setting the date to the current date+added days in milliseconds
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Get a cookie value
export function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        let [key, value] = cookie.split('=');
        if (key === name) return value;
        //if we found the logged in key then we return the value wich is boolean
    }
    return null;
}

// Redirect if user is already logged in throw searching the cookies
if (window.location.pathname.includes('index.html')) {
    window.addEventListener('load', () => {
        if (getCookie('loggedIn') === 'true') {
            window.location.href = '../HTML/home.html'; // Redirect to home page if cookie found to be looged in :)
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (toggleForm) {
        toggleForm.addEventListener('click', () => {
            isSignUp = !isSignUp;
            formTitle.textContent = isSignUp ? 'Sign Up for WatchNest' : 'Login to WatchNest';
            authButton.textContent = isSignUp ? 'Sign Up' : 'Log In';
            toggleForm.innerHTML = isSignUp
                ? 'Already have an account? <a href="#">Log In</a>'
                : 'Don\'t have an account? <a href="#">Sign Up</a>';
            confirmPasswordGroup.style.display = isSignUp ? 'block' : 'none';
        });
    }
    if (authForm) {

        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            //prevent reloading the page or sending the data to a server
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            if (!email || !password) {
                messageEl.textContent = 'Please fill in all fields!';
                messageEl.style.color = 'red';
                return;
            }

            const storedUser = JSON.parse(localStorage.getItem('user'));
            const hashedPassword = await hashPassword(password);

            if (isSignUp) {
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (password !== confirmPassword) {
                    messageEl.textContent = 'Passwords do not match!';
                    messageEl.style.color = 'red';
                    return;
                }

                if (storedUser && storedUser.email === email) {
                    messageEl.textContent = 'User already exists!';
                    messageEl.style.color = 'red';
                    return;
                }

                localStorage.setItem('user', JSON.stringify({ email, password: hashedPassword }));
                messageEl.textContent = 'Sign Up successful! Please log in.';
                messageEl.style.color = 'green';
                toggleForm.click(); // Switch to Login
            } else {
                if (!storedUser || storedUser.email !== email || storedUser.password !== hashedPassword) {
                    messageEl.textContent = 'Invalid email or password.';
                    messageEl.style.color = 'red';
                    return;
                }

                messageEl.textContent = 'Login successful! Redirecting...';
                messageEl.style.color = 'green';

                setCookie('loggedIn', 'true', rememberMe ? 7 : 1);

                setTimeout(() => {
                    window.location.href = '../HTML/home.html';
                }, 1500);
            }
        });
    }
});


