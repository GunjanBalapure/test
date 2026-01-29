// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxNI6m2Vbb6vAlOzQkQHa41tzhHelCr3k",
    authDomain: "kaagaz-55163.firebaseapp.com",
    projectId: "kaagaz-55163",
    storageBucket: "kaagaz-55163.firebasestorage.app",
    messagingSenderId: "44711337536",
    appId: "1:447113375361:web:090ae41355c66d3dbfe780"
};

// Initialize Firebase (will be loaded from CDN in HTML)
let auth;
let db;

function initFirebase() {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log('✅ Firebase initialized');
    }
}

// Authentication Functions
async function firebaseRegister(name, email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile
        await user.updateProfile({ displayName: name });
        
        // Store additional user data in Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            createdAt: new Date()
        });
        
        return { success: true, user };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: error.message };
    }
}

async function firebaseLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: error.message };
    }
}

async function firebaseLogout() {
    try {
        await auth.signOut();
        localStorage.removeItem('kaagaz_user');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function firebaseGoogleLogin() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        
        // Store user data in Firestore
        await db.collection('users').doc(result.user.uid).set({
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            phone: result.user.phoneNumber || '',
            lastLogin: new Date(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Google login error:', error);
        return { success: false, message: error.message };
    }
}

// Phone Authentication
let phoneConfirmationResult = null;

async function firebasePhoneLogin(phoneNumber, recaptchaVerifier) {
    try {
        phoneConfirmationResult = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Phone login error:', error);
        return { success: false, message: error.message };
    }
}

async function verifyOTP(otp) {
    try {
        if (!phoneConfirmationResult) {
            throw new Error('Please request OTP first');
        }
        
        const result = await phoneConfirmationResult.confirm(otp);
        const user = result.user;
        
        // Store user data in Firestore
        await db.collection('users').doc(user.uid).set({
            phone: user.phoneNumber,
            lastLogin: new Date(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        return { success: true, user };
    } catch (error) {
        console.error('OTP verification error:', error);
        return { success: false, message: error.message };
    }
}

// Get user profile from Firestore
async function getUserProfile(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return { success: true, data: doc.data() };
        }
        return { success: false, message: 'User not found' };
    } catch (error) {
        console.error('Get profile error:', error);
        return { success: false, message: error.message };
    }
}

// Update user profile
async function updateUserProfile(uid, data) {
    try {
        await db.collection('users').doc(uid).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update Firebase Auth profile if name is changed
        if (data.name && auth.currentUser) {
            await auth.currentUser.updateProfile({
                displayName: data.name
            });
        }
        
        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, message: error.message };
    }
}

// Auth State Observer
function onAuthStateChanged(callback) {
    if (auth) {
        auth.onAuthStateChanged(callback);
    }
}

// Get current user
function getCurrentUser() {
    return auth ? auth.currentUser : null;
}
