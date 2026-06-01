if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'dashboard.html';
}

const darkToggle = document.getElementById('darkToggle');
const body = document.body;
const icon = darkToggle.querySelector('i');
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    icon.className = 'bi bi-sun-fill';
}
darkToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    localStorage.setItem('darkMode', isDark);
});

document.getElementById('passwordToggle').addEventListener('click', function () {
    const input = document.getElementById('password');
    const icon = this.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'bi bi-eye-fill';
    } else {
        input.type = 'password';
        icon.className = 'bi bi-eye-slash-fill';
    }
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    errorDiv.style.display = 'none';
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        if (email === 'admin@email.com' && password === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('rememberEmail', email);
            } else {
                localStorage.removeItem('rememberEmail');
            }
            window.location.href = 'dashboard.html';
        } else {
            errorDiv.style.display = 'block';
            const card = document.querySelector('.login-card');
            card.style.animation = 'none';
            void card.offsetHeight;
            card.style.animation = 'shake 0.5s ease';
        }
    }, 1200);
});

const remembered = localStorage.getItem('rememberEmail');
if (remembered) {
    document.getElementById('email').value = remembered;
    document.getElementById('rememberMe').checked = true;
}
document.getElementById('email').focus();
