# 🚀 Kaagaz AI - Complete Setup Guide

## 📋 Overview

Kaagaz AI now has a full backend with:
- ✅ **MongoDB Atlas** - User authentication storage
- ✅ **Cloudinary** - Image/document storage
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **REST API** - Express.js backend

---

## 🔧 Setup Instructions

### Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a **FREE** account
3. Create a new cluster (M0 Free tier)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Create a database user:
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
7. Whitelist your IP:
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

8. **Update `.env` file:**
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kaagaz-ai?retryWrites=true&w=majority
   ```

---

### Step 2: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/users/register/free)
2. Create a **FREE** account
3. Go to Dashboard (https://cloudinary.com/console)
4. Copy your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

5. **Update `.env` file:**
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

### Step 3: JWT Secret

Generate a secure random string for JWT:

**Option 1 - Linux/Mac:**
```bash
openssl rand -base64 32
```

**Option 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3 - Manual:**
Just use any long random string (minimum 32 characters)

**Update `.env` file:**
```
JWT_SECRET=your_generated_secret_key_here
```

---

### Step 4: Install Dependencies

```bash
cd /mnt/Storage/Family/Google_Kaagaz_AI-main
npm install
```

---

### Step 5: Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Server will run on:** `http://localhost:5000`

---

### Step 6: Start Frontend (in another terminal)

```bash
python3 -m http.server 8080
```

**Frontend will run on:** `http://localhost:8080`

---

## 📡 API Endpoints

### Authentication Endpoints

#### Register New User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "password": "securepassword123"
}
```

#### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response includes:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Document Endpoints (Require Authentication)

#### Upload Document
```
POST http://localhost:5000/api/documents/upload
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- document: [file]
- name: "My Document"
- type: "Aadhaar Card"
- category: "identity"
```

#### Get All Documents
```
GET http://localhost:5000/api/documents
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Single Document
```
GET http://localhost:5000/api/documents/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete Document
```
DELETE http://localhost:5000/api/documents/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🧪 Testing the Backend

### Using curl:

**1. Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+91 9876543210","password":"test123456"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

**3. Upload Document (replace TOKEN):**
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "document=@/path/to/image.jpg" \
  -F "name=Test Document" \
  -F "type=Aadhaar Card" \
  -F "category=identity"
```

---

## 📁 Complete `.env` File Template

```env
# Gemini AI API Key
GEMINI_API_KEY=AIzaSyBkWDDdibrPgpyVdO3t8GpmQsE-b5Zu6w0

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kaagaz-ai?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (Allow from Anywhere for dev)
- [ ] MongoDB URI added to `.env`
- [ ] Cloudinary account created
- [ ] Cloudinary credentials added to `.env`
- [ ] JWT secret generated and added to `.env`
- [ ] `npm install` completed successfully
- [ ] Backend server starts without errors (`npm run dev`)
- [ ] Frontend server running (`python3 -m http.server 8080`)
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can upload documents

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check internet connection
- Verify username/password in connection string
- Check Network Access whitelist in MongoDB Atlas

### Cloudinary Upload Error
- Verify credentials are correct
- Check Cloudinary dashboard for usage limits

### CORS Errors
- Make sure backend is running on port 5000
- Frontend should be on port 8080

### JWT Token Invalid
- Token expires after 7 days
- Logout and login again to get new token

---

## 🎉 Success!

Once everything is set up:
1. Open `http://localhost:8080/login.html`
2. Register a new account
3. Login with your credentials
4. Upload documents - they'll be stored in Cloudinary
5. View documents in the vault
6. All user data stored in MongoDB Atlas

**Your app is now fully functional with real backend!** 🚀
