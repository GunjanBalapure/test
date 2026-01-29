#!/bin/bash

echo "🚀 Starting Kaagaz AI Backend..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with MongoDB, Cloudinary, and JWT credentials"
    echo "See SETUP_GUIDE.md for instructions"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "✅ Starting server on http://localhost:5000"
echo "📝 Logs:"
echo ""
npm run dev
