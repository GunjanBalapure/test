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
    try {
        if (typeof firebase === 'undefined' || !auth) {
            alert('Firebase not initialized. Please refresh the page.');
            return;
        }
        
        console.log('Starting Google login...');
        
        // This will redirect to Google sign-in
        const result = await firebaseGoogleLogin();
        
        if (!result.success && result.message) {
            alert('Google login error: ' + result.message);
        }
        // If successful, user will be redirected and handled on return
    } catch (error) {
        console.error('Google login handler error:', error);
        alert('Failed to start Google login. Please try again.');
    }
}

// Phone Login Handler
let recaptchaVerifier;
let isOTPSent = false;

function initRecaptcha() {
    try {
        if (!recaptchaVerifier && auth) {
            recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phone-login-btn', {
                'size': 'invisible',
                'callback': () => {
                    console.log('reCAPTCHA solved');
                },
                'error-callback': (error) => {
                    console.error('reCAPTCHA error:', error);
                }
            });
        }
        return true;
    } catch (error) {
        console.error('reCAPTCHA initialization error:', error);
        return false;
    }
}

async function handlePhoneLogin() {
    try {
        if (typeof firebase === 'undefined' || !auth) {
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
            
            // Validate phone number format
            if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
                alert('Invalid phone number format. Use format: +919876543210');
                return;
            }
            
            // Initialize reCAPTCHA
            const recaptchaReady = initRecaptcha();
            if (!recaptchaReady) {
                alert('Security verification failed. Please refresh and try again.');
                return;
            }
            
            console.log('Sending OTP to:', phoneNumber);
            const result = await firebasePhoneLogin(phoneNumber, recaptchaVerifier);
            
            if (result.success) {
                isOTPSent = true;
                
                // Show OTP input
                const otp = prompt('Enter the 6-digit OTP sent to your phone:');
                
                if (!otp) {
                    isOTPSent = false;
                    alert('OTP entry cancelled');
                    return;
                }
                
                if (!/^\d{6}$/.test(otp)) {
                    alert('Invalid OTP format. Please enter 6 digits.');
                    isOTPSent = false;
                    return;
                }
                
                console.log('Verifying OTP...');
                const verifyResult = await verifyOTP(otp);
                
                if (verifyResult.success) {
                    const user = verifyResult.user;
                    
                    // Store or update user in Firestore
                    if (db) {
                        try {
                            await db.collection('users').doc(user.uid).set({
                                phone: user.phoneNumber,
                                lastLogin: new Date(),
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            }, { merge: true });
                        } catch (error) {
                            console.error('Firestore update error:', error);
                        }
                    }
                    
                    localStorage.setItem('kaagaz_user', JSON.stringify({
                        loggedIn: true,
                        uid: user.uid,
                        phone: user.phoneNumber,
                        name: user.displayName || user.phoneNumber,
                        email: user.email || '',
                        photoURL: user.photoURL || ''
                    }));
                    
                    window.location.href = 'dashboard.html';
                } else {
                    alert(verifyResult.message || 'OTP verification failed. Please try again.');
                    isOTPSent = false;
                }
            } else {
                alert(result.message || 'Failed to send OTP. Please check your phone number and try again.');
            }
        }
    } catch (error) {
        console.error('Phone login error:', error);
        alert('Phone login failed: ' + (error.message || 'Unknown error'));
        isOTPSent = false;
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
