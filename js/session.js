// Session Check for Protected Pages
// Include this at the top of dashboard, chatbot, upload, vault pages

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('kaagaz_user'));
    if (!user || !user.loggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('kaagaz_user');
    alert('✅ Logged out successfully!');
    window.location.href = 'login.html';
}

// Auto-check on page load (skip for login page)
if (!window.location.pathname.includes('login.html')) {
    checkAuth();
}
