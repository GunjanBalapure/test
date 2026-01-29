# Kaagaz AI - Backend Setup

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

1. **MongoDB Atlas Setup:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (Free tier available)
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Update `MONGODB_URI` in `.env`

2. **Cloudinary Setup:**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Create a free account
   - Go to Dashboard
   - Copy: Cloud Name, API Key, API Secret
   - Update in `.env`:
     ```
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

3. **JWT Secret:**
   - Generate a secure random string (or use: `openssl rand -base64 32`)
   - Update `JWT_SECRET` in `.env`

## 🚀 Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on: `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Documents
- `POST /api/documents/upload` - Upload document (requires auth)
- `GET /api/documents` - Get all user documents (requires auth)
- `GET /api/documents/:id` - Get single document (requires auth)
- `DELETE /api/documents/:id` - Delete document (requires auth)

## 🔑 Authentication

Include JWT token in headers:
```
Authorization: Bearer <your_token_here>
```

## 📁 Project Structure

```
kaagaz-ai/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
├── config/
│   └── cloudinary.js      # Cloudinary config
├── models/
│   ├── User.js           # User model
│   └── Document.js       # Document model
├── routes/
│   ├── auth.js           # Auth routes
│   └── documents.js      # Document routes
├── middleware/
│   └── auth.js           # JWT authentication middleware
└── public/               # Frontend files (HTML/CSS/JS)
```

## 🧪 Testing

Use Postman or curl to test endpoints:

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
