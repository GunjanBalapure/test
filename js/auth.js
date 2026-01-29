// Login Form Handler
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }
    
    // Check if Firebase is available
    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert('Firebase not initialized. Please refresh the page.');
        return;
    }
    
    const result = await firebaseLogin(email, password);
    
    if (result.success) {
        localStorage.setItem('kaagaz_user', JSON.stringify({
            loggedIn: true,
            uid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName || result.user.email.split('@')[0],
            photoURL: result.user.photoURL || ''
        }));
        
        window.location.href = 'dashboard.html';
    } else {
        alert(result.message || 'Login failed');
    }
}

// Register Form Handler
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!name || !email || !password) {
        alert('Please fill all required fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    // Check if Firebase is available
    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert('Firebase not initialized. Please refresh the page.');
        return;
    }
    
    const result = await firebaseRegister(name, email, password);
    
    if (result.success) {
        // Update Firestore with phone number if provided
        if (phone && db) {
            await db.collection('users').doc(result.user.uid).update({
                phone: phone
            });
        }
        
        localStorage.setItem('kaagaz_user', JSON.stringify({
            loggedIn: true,
            uid: result.user.uid,
            email: result.user.email,
            name: name,
            phone: phone || '',
            photoURL: ''
        }));
        
        window.location.href = 'dashboard.html';
    } else {
        alert(result.message || 'Registration failed');
    }
}

// Google Login Handler
async function handleGoogleLogin() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert('Firebase not initialized. Please refresh the page.');
        return;
    }
    
    // This will redirect to Google sign-in
    const result = await firebaseGoogleLogin();
    
    if (!result.success && result.message) {
        alert(result.message || 'Google login failed');
    }
    // If successful, user will be redirected and handled on return
}

// Phone Login Handler
let recaptchaVerifier;
let isOTPSent = false;

function initRecaptcha() {
    if (!recaptchaVerifier) {
        recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phone-login-btn', {
            'size': 'invisible',
            'callback': () => {
                console.log('reCAPTCHA solved');
            }
        });
    }
}

async function handlePhoneLogin() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert('Firebase not initialized. Please refresh the page.');
        return;
    }
    
    if (!isOTPSent) {
        // Show phone input modal
        const phoneNumber = prompt('Enter your phone number with country code (e.g., +919876543210):');
        
        if (!phoneNumber) return;
        
        if (!phoneNumber.startsWith('+')) {
            alert('Please include country code (e.g., +91 for India)');
            return;
        }
        
        initRecaptcha();
        const result = await firebasePhoneLogin(phoneNumber, recaptchaVerifier);
        
        if (result.success) {
            isOTPSent = true;
            
            // Show OTP input
            const otp = prompt('Enter the 6-digit OTP sent to your phone:');
            
            if (!otp) {
                isOTPSent = false;
                return;
            }
            
            const verifyResult = await verifyOTP(otp);
            
            if (verifyResult.success) {
                localStorage.setItem('kaagaz_user', JSON.stringify({
                    loggedIn: true,
                    uid: verifyResult.user.uid,
                    phone: verifyResult.user.phoneNumber,
                    name: verifyResult.user.phoneNumber,
                    email: '',
                    photoURL: ''
                }));
                
                window.location.href = 'dashboard.html';
            } else {
                alert(verifyResult.message || 'OTP verification failed');
                isOTPSent = false;
            }
        } else {
            alert(result.message || 'Failed to send OTP');
        }
    }
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
