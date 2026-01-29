# 🚀 Kaagaz AI - Intelligent Life Operating System

AI-powered document management system built with **Gemini 2.0 Pro**

Transform scattered documents into an intelligent Life-Graph that thinks, reasons, and protects your most important data.

---

## 📋 Table of Contents
- [Quick Start](#-quick-start)
- [Website Structure](#-website-structure)
- [Secret Keys Setup](#-secret-keys-setup)
- [Features](#-features)
- [Technologies](#-technologies)
- [Security](#-security)

---

## ⚡ Quick Start

### 1️⃣ Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env
```

### 2️⃣ Add Your Gemini API Key
Edit `.env` file:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Get API Key:** https://makersuite.google.com/app/apikey

### 3️⃣ Update JavaScript File
Edit `js/dashboard.js` (line 4):
```javascript
const GEMINI_API_KEY = "your_actual_api_key_here";
```

### 4️⃣ Run the Website
```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx serve

# Then open: http://localhost:8000
```

---

## 📁 Website Structure

### 🌐 Pages

| Page | Purpose | URL |
|------|---------|-----|
| **Landing** | Introduction & features | `index.html` |
| **Dashboard** | Overview & quick actions | `dashboard.html` |
| **Profile** | User settings | `profile.html` |
| **Chatbot** | AI assistant | `chatbot.html` |
| **Upload** | Document upload | `upload.html` |
| **Documents** | File vault | `vault.html` |

### 🧭 Navigation Menu (All App Pages)

```
┌─────────────────────────────────────────┐
│  Dashboard | Profile | Chatbot | Upload | Documents │
└─────────────────────────────────────────┘
```

- **Dashboard** 🏠 - Main overview with insights
- **Profile** 👤 - Account information & stats
- **Chatbot** 💬 - Ask Gemini AI about documents
- **Upload** 📤 - Scan new documents
- **Documents** 📁 - View all uploaded files

---

## 🔑 Secret Keys Setup

### Required: Gemini API Key

#### What is it?
Google Gemini AI API key for intelligent document analysis

#### Where to get it?
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

#### Where to add it?

**Option 1: Environment File (Recommended)**
```bash
# File: .env
GEMINI_API_KEY=AIzaSyCS6dkrGLsI0CAnnk4yMEj3VyeicNiCP_8
```

**Option 2: JavaScript File**
```javascript
// File: js/dashboard.js (line 4)
const GEMINI_API_KEY = "AIzaSyCS6dkrGLsI0CAnnk4yMEj3VyeicNiCP_8";
```

### ⚠️ Important Notes:
- **Never commit `.env` to GitHub** (already in `.gitignore`)
- Keep your API key private
- For production, use server-side API calls

### No Other Keys Needed ✅
This is a client-side application with no backend authentication required.

---

## 🎨 Features

### ✅ Implemented
- 🤖 **AI Document Scanning** - Gemini 2.0 Pro multimodal analysis
- 📊 **Smart Insights** - Scholarship eligibility, renewal alerts
- 🔗 **Life-Graph** - AI connects related documents
- ⏰ **Deadline Alerts** - Never miss insurance/certificate expiry
- 🔒 **Time-Bomb Sharing** - Self-destructing document links
- 📱 **Offline Access** - Critical documents cached locally
- 🎨 **Government Theme** - Indian tri-color design

### 🚧 Coming Soon
- 🗣️ **Voice Assistant** - Hindi, Tamil, Bengali support
- 📅 **Calendar Sync** - Auto-add deadlines to Google Calendar
- 🌐 **Multi-language** - 12+ Indian languages

---

## 🛠 Technologies

### Frontend
- HTML5 / CSS3 / JavaScript
- **Tailwind CSS** - Styling framework
- **Material Symbols** - Icon library
- **Animate.css** - Animations

### AI & APIs
- **Google Gemini 2.0 Pro** - Document analysis
- **Gemini 1.5 Flash** - Chatbot responses

### Design System
- **Colors:** Maroon (#800000), Saffron (#FF9933), Green (#138808)
- **Fonts:** Sora (body), Space Grotesk (headings)
- **Theme:** Government-inspired, Made in India 🇮🇳

---

## 🔒 Security

### Best Practices
✅ `.env` file in `.gitignore`  
✅ No sensitive data in frontend  
✅ API keys kept private  
✅ Client-side only (no server needed)  

### Production Recommendations
- [ ] Add backend API proxy for Gemini calls
- [ ] Implement user authentication
- [ ] Use server-side environment variables
- [ ] Add rate limiting on API requests

---

## 📝 File Structure

```
Google_Kaagaz_AI-main/
├── index.html              # Landing page
├── dashboard.html          # Main dashboard
├── profile.html            # User profile
├── chatbot.html            # AI chatbot
├── upload.html             # Upload interface
├── vault.html              # Document vault
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── dashboard.js       # Main logic + Gemini API
│   ├── auth.js            # Mock authentication
│   └── vault.js           # Document management
├── .env                    # API keys (DO NOT COMMIT)
├── .env.example            # Template for .env
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

---

## 🚀 Usage Flow

```
1. Open index.html → Landing Page
2. Click "Open App" → Dashboard
3. Choose action:
   ├─ Upload → Scan document
   ├─ Documents → View vault
   ├─ Chatbot → Ask AI questions
   └─ Profile → View settings
```

---

## 🤝 Contributing

This is a demo project. For production use:
1. Fork the repository
2. Add proper backend
3. Implement real authentication
4. Use server-side API calls
5. Add database for document storage

---

## 📄 License

This project is for educational purposes.  
Made with ❤️ in India 🇮🇳

---

## 💡 Support

**Issues?**  
Check that your Gemini API key is correctly set in both `.env` and `js/dashboard.js`

**Need API Key?**  
Visit: https://makersuite.google.com/app/apikey

**Questions?**  
Review the code comments in `js/dashboard.js` for detailed explanations.

---

**Powered by Gemini 2.0 Pro** 🤖  
**Made in India** 🇮🇳
