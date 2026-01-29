// Session Check for Protected Pages
// Include this at the top of dashboard, chatbot, upload, vault pages

let authCheckComplete = false;

async function checkAuth() {
    const user = JSON.parse(localStorage.getItem('kaagaz_user') || 'null');
    
    // If no user in localStorage, redirect to login
    if (!user || !user.loggedIn || !user.uid) {
        console.log('No authenticated user found, redirecting to login...');
        localStorage.removeItem('kaagaz_user'); // Clear any stale data
        window.location.href = 'login.html';
        return false;
    }
    
    // If Firebase is available, verify the session
    if (typeof firebase !== 'undefined' && firebase.auth) {
        try {
            // Wait for Firebase auth state
            const firebaseUser = await new Promise((resolve) => {
                const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    unsubscribe();
                    resolve(user);
                });
            });
            
            // If Firebase user doesn't exist but localStorage says logged in, clear it
            if (!firebaseUser) {
                console.log('Firebase session expired, clearing localStorage...');
                localStorage.removeItem('kaagaz_user');
                window.location.href = 'login.html';
                return false;
            }
            
            // Verify the UIDs match
            if (firebaseUser.uid !== user.uid) {
                console.log('UID mismatch, clearing session...');
                localStorage.removeItem('kaagaz_user');
                window.location.href = 'login.html';
                return false;
            }
            
            console.log('Authentication verified:', firebaseUser.email || firebaseUser.phoneNumber);
        } catch (error) {
            console.error('Auth check error:', error);
            // If Firebase check fails, still allow localStorage-based auth for backwards compatibility
        }
    }
    
    authCheckComplete = true;
    return true;
}

function logout() {
    // Clear localStorage
    localStorage.removeItem('kaagaz_user');
    
    // If Firebase is available, sign out
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth()) {
        firebase.auth().signOut().then(() => {
            console.log('Firebase logout successful');
            alert('✅ Logged out successfully!');
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Firebase logout error:', error);
            alert('✅ Logged out successfully!');
            window.location.href = 'login.html';
        });
    } else {
        alert('✅ Logged out successfully!');
        window.location.href = 'login.html';
    }
}

// Auto-check on page load (skip for login and index pages)
if (!window.location.pathname.includes('login.html') && 
    !window.location.pathname.includes('index.html') &&
    window.location.pathname !== '/') {
    
    // Run auth check after a small delay to ensure page is ready
    document.addEventListener('DOMContentLoaded', function() {
        checkAuth();
    });
    
    // Also run immediately in case DOMContentLoaded already fired
    if (document.readyState === 'loading') {
        // Still loading, wait for DOMContentLoaded
    } else {
        // Already loaded
        checkAuth();
    }
}
