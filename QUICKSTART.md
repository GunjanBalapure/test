# 🚀 Kaagaz AI - Quick Start

## ✅ Backend is Ready!

Your backend is fully configured with:
- **MongoDB Atlas** - User authentication
- **Cloudinary** - Document storage
- **JWT** - Secure authentication
- **Express.js** - REST API

## 📝 Quick Setup (3 Steps)

### 1. Configure Environment Variables

Edit `.env` file and add your credentials:

```bash
# MongoDB Atlas (get from mongodb.com/cloud/atlas)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/kaagaz-ai

# Cloudinary (get from cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret (generate random string)
JWT_SECRET=your_secret_key_minimum_32_chars
```

### 2. Start Backend

```bash
./start-backend.sh
```

Or manually:
```bash
npm run dev
```

### 3. Start Frontend (new terminal)

```bash
python3 -m http.server 8080
```

## 🌐 Access Your App

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000/api

## 📚 Documentation

- **Detailed Setup**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Backend API**: See [BACKEND_SETUP.md](BACKEND_SETUP.md)

## 🎯 Features

✅ User Registration & Login  
✅ JWT Token Authentication  
✅ Upload Documents to Cloudinary  
✅ Store Metadata in MongoDB  
✅ Retrieve & Display Documents  
✅ Delete Documents  
✅ Gemini AI Integration  

## 🔗 Project Structure

```
kaagaz-ai/
├── server.js              # Backend server
├── config/
│   └── cloudinary.js      # Cloudinary config
├── models/
│   ├── User.js           # User schema
│   └── Document.js       # Document schema
├── routes/
│   ├── auth.js           # Auth endpoints
│   └── documents.js      # Document endpoints
├── middleware/
│   └── auth.js           # JWT verification
├── js/
│   ├── api.js            # Frontend API calls
│   └── auth.js           # Auth handlers
└── [HTML files]          # Frontend pages
```

## 🎉 You're All Set!

Your full-stack document management system is ready to use!
