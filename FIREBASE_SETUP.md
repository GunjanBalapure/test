# 🔥 Firebase Setup Guide for Kaagaz AI

## ✅ MongoDB Removed - Firebase Authentication Active

## 🚀 Firebase Setup Steps

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `kaagaz-ai` (or any name you prefer)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left menu
2. Click "Get started"
3. Enable sign-in methods:
   - **Email/Password** - Toggle ON
   - **Google** - Toggle ON (optional)

### Step 3: Register Your Web App

1. In project overview, click the **Web icon** (</>)
2. Register app name: "Kaagaz AI Web"
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the Firebase configuration** that appears:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### Step 4: Update Configuration Files

**1. Update `js/firebase-config.js`:**

Replace the placeholder config with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

**2. Update `.env` (optional, for reference):**

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
```

### Step 5: Enable Firestore (Document Storage)

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in **test mode**" (for development)
4. Select location (closest to you)
5. Click "Enable"

**Set Security Rules (in Firestore Rules tab):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /documents/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🎉 Testing Firebase Authentication

### Start the Application:

```bash
# Frontend (already running)
python3 -m http.server 8080

# Backend (optional, for Cloudinary uploads)
npm run dev
```

### Test Registration:

1. Go to http://localhost:8080/login.html
2. Click "Sign Up" tab
3. Enter name, email, password
4. Click "Create Account"
5. You should be redirected to dashboard

### Test Login:

1. Go to http://localhost:8080/login.html
2. Enter your registered email and password
3. Click "Sign In"
4. You should be redirected to dashboard

### Verify in Firebase Console:

1. Go to Firebase Console → Authentication
2. Click "Users" tab
3. You should see your registered user!

## 🔧 Features Now Available

✅ **Firebase Email/Password Authentication**  
✅ **Google Sign-In** (if enabled)  
✅ **User Data Storage** in Firestore  
✅ **Cloudinary Document Upload** (with Firebase user ID)  
✅ **Gemini AI Chatbot**  
✅ **Session Management**  

## ❌ Removed

- ❌ MongoDB Atlas
- ❌ JWT Tokens
- ❌ bcrypt password hashing (handled by Firebase)
- ❌ Manual user management

## 📁 Updated Files

- ✅ `package.json` - Removed MongoDB packages
- ✅ `server.js` - Removed MongoDB connection
- ✅ `.env` - Added Firebase config
- ✅ `js/firebase-config.js` - NEW Firebase configuration
- ✅ `js/auth.js` - Using Firebase authentication
- ✅ `js/session.js` - Using Firebase auth state
- ✅ `login.html` - Added Firebase SDK scripts
- ✅ `routes/documents.js` - Simplified (no MongoDB)

## 🐛 Troubleshooting

### "Firebase is not defined"
- Check that Firebase CDN scripts are loaded in login.html
- Check browser console for script loading errors

### "auth/invalid-email"
- Use a valid email format
- Example: `user@example.com`

### "auth/weak-password"
- Password must be at least 6 characters

### "Permission denied" in Firestore
- Check Firestore security rules
- Make sure user is authenticated

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Firebase config copied to `js/firebase-config.js`
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] `npm install` completed
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] User appears in Firebase Console
- [ ] Dashboard loads after login

Your app now uses Firebase for all authentication! 🚀
