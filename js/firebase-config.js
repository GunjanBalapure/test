// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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
            createdAt: new Date()
        }, { merge: true });
        
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Google login error:', error);
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
