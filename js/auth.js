// Demo Mode - Default User
const DEFAULT_USER = {
    uid: 'demo-user-123',
    email: 'demo@kaagaz.ai',
    name: 'Demo User',
    photoURL: null
};

// Login Form Handler
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Demo mode - accept any credentials
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }
    
    // Check if Firebase is available
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const result = await firebaseLogin(email, password);
        
        if (result.success) {
            localStorage.setItem('kaagaz_user', JSON.stringify({
                loggedIn: true,
                uid: result.user.uid,
                email: result.user.email,
                name: result.user.displayName || result.user.email.split('@')[0]
            }));
            
            window.location.href = 'dashboard.html';
            return;
        } else {
            alert(result.message || 'Login failed');
            return;
        }
    }
    
    // Fallback: Demo mode
    localStorage.setItem('kaagaz_user', JSON.stringify({
        loggedIn: true,
        uid: DEFAULT_USER.uid,
        email: email,
        name: email.split('@')[0]
    }));
    
    window.location.href = 'dashboard.html';
}

// Register Form Handler
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (!name || !email || !password) {
        alert('Please fill all fields');
        return;
    }
    
    // Check if Firebase is available
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const result = await firebaseRegister(name, email, password);
        
        if (result.success) {
            localStorage.setItem('kaagaz_user', JSON.stringify({
                loggedIn: true,
                uid: result.user.uid,
                email: result.user.email,
                name: name
            }));
            
            window.location.href = 'dashboard.html';
            return;
        } else {
            alert(result.message || 'Registration failed');
            return;
        }
    }
    
    // Fallback: Demo mode
    localStorage.setItem('kaagaz_user', JSON.stringify({
        loggedIn: true,
        uid: `user-${Date.now()}`,
        email: email,
        name: name
    }));
    
    window.location.href = 'dashboard.html';
}

// Google Login Handler
async function handleGoogleLogin() {
    // Check if Firebase is available
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const result = await firebaseGoogleLogin();
        
        if (result.success) {
            localStorage.setItem('kaagaz_user', JSON.stringify({
                loggedIn: true,
                uid: result.user.uid,
                email: result.user.email,
                name: result.user.displayName,
                photoURL: result.user.photoURL
            }));
            
            window.location.href = 'dashboard.html';
            return;
        } else {
            alert(result.message || 'Google login failed');
            return;
        }
    }
    
    // Fallback: Demo mode
    alert('Google Sign-In not available in demo mode');
}

// Auto-login with default user (for demo)
function autoLoginDemo() {
    console.log('🚀 Demo mode activated!');
    localStorage.setItem('kaagaz_user', JSON.stringify({
        loggedIn: true,
        uid: DEFAULT_USER.uid,
        email: DEFAULT_USER.email,
        name: DEFAULT_USER.name
    }));
    
    window.location.href = 'dashboard.html';
}

// Tab switching functions
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}
