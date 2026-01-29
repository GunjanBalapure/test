// Firebase Configuration - Loaded from backend environment variables
let firebaseConfig = null;
let auth;
let db;

// Fallback config for when API is unavailable
const fallbackConfig = {
    apiKey: "AIzaSyAxNI6m2Vbb6vAlOzQkQHa41tzhHelCr3k",
    authDomain: "kaagaz-55163.firebaseapp.com",
    projectId: "kaagaz-55163",
    storageBucket: "kaagaz-55163.firebasestorage.app",
    messagingSenderId: "44711337536",
    appId: "1:447113375361:web:090ae41355c66d3dbfe780"
};

async function loadFirebaseConfig() {
    try {
        const response = await fetch('/api/config', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            console.warn('API config unavailable, using fallback');
            return fallbackConfig;
        }
        
        const config = await response.json();
        return config;
    } catch (error) {
        console.warn('Error loading Firebase config from API, using fallback:', error);
        return fallbackConfig;
    }
}

async function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase SDK not loaded');
        return false;
    }
    
    try {
        // Check if already initialized
        if (firebase.apps && firebase.apps.length > 0) {
            auth = firebase.auth();
            db = firebase.firestore();
            console.log('✅ Firebase already initialized');
            return true;
        }
        
        // Load config from backend or fallback
        if (!firebaseConfig) {
            console.log('Loading Firebase config...');
            firebaseConfig = await loadFirebaseConfig();
        }
        
        if (!firebaseConfig) {
            console.error('❌ Firebase config not available');
            return false;
        }
        
        console.log('Initializing Firebase with config:', {
            projectId: firebaseConfig.projectId,
            authDomain: firebaseConfig.authDomain
        });
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        
        console.log('✅ Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        return false;
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
        // Use redirect instead of popup to avoid CORS issues
        await auth.signInWithRedirect(provider);
        // Note: This will redirect and the callback will be handled on return
        return { success: true };
    } catch (error) {
        console.error('Google login error:', error);
        return { success: false, message: error.message };
    }
}

// Handle redirect result after Google login
async function handleGoogleRedirect() {
    try {
        console.log('Checking for redirect result...');
        const result = await auth.getRedirectResult();
        
        if (result.user) {
            console.log('✅ User authenticated:', result.user.email);
            
            // Try to store user data in Firestore (non-blocking)
            try {
                await db.collection('users').doc(result.user.uid).set({
                    name: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    phone: result.user.phoneNumber || '',
                    lastLogin: new Date(),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                console.log('✅ User data saved to Firestore');
            } catch (firestoreError) {
                console.warn('⚠️ Firestore save failed (non-critical):', firestoreError);
                // Continue anyway - localStorage will have the data
            }
            
            return { success: true, user: result.user };
        }
        
        console.log('No redirect result found');
        return { success: false };
    } catch (error) {
        console.error('❌ Google redirect error:', error);
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
        
        console.log('Verifying OTP...');
        const result = await phoneConfirmationResult.confirm(otp);
        const user = result.user;
        console.log('✅ OTP verified, user authenticated');
        
        // Try to store user data in Firestore (non-blocking)
        try {
            await db.collection('users').doc(user.uid).set({
                phone: user.phoneNumber,
                lastLogin: new Date(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log('✅ User data saved to Firestore');
        } catch (firestoreError) {
            console.warn('⚠️ Firestore save failed (non-critical):', firestoreError);
            // Continue anyway - localStorage will have the data
        }
        
        return { success: true, user };
    } catch (error) {
        console.error('❌ OTP verification error:', error);
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
