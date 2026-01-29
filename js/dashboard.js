// js/dashboard.js

// Load configuration from config.js
// API key will be loaded from .env through config.js

/**
 * 1. MOCK AUTHENTICATION OBSERVER
 * Handles UI updates when the user logs in (Name & Profile Picture)
 */
// firebase.auth().onAuthStateChanged((user) => {
    // Mock user for local development without Firebase
    const user = {
        displayName: "Admin User",
        photoURL: "" // Add a valid URL if needed or leave empty
    };

    if (user) {
        // Get name from Google Account or fallback to Explorer
        const name = user.displayName || "Explorer"; 
        
        // Update the sidebar username element
        const nameElement = document.getElementById('userName');
        if (nameElement) {
            nameElement.innerText = name;
        }

        // Update the "Namaste" welcome text (First Name only)
        const welcomeSpan = document.querySelector('h1 span.text-maroon');
        if (welcomeSpan) {
            welcomeSpan.innerText = name.split(' ')[0]; 
        }

        // Update the Profile Picture circle
        const profilePic = document.querySelector('.w-24.h-24');
        if (profilePic && user.photoURL) {
            profilePic.style.backgroundImage = `url('${user.photoURL}')`;
            profilePic.style.backgroundSize = 'cover';
            profilePic.style.backgroundPosition = 'center';
            // Remove initial maroon background to show image clearly
            profilePic.classList.remove('bg-red-800'); 
        }

        console.log("Dashboard active for:", name);
    } else {
        // Redirect to login if session is invalid
        window.location.href = 'index.html';
    }
// });

/**
 * 2. UPLOAD & SCAN LOGIC
 * Captures file, uploads to Firebase, and triggers Gemini AI analysis
 */
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) return;

    // Show loading state
    alert("Gemini is analyzing your document. Please wait...");

    try {
        // Step A: Upload original file to Firebase Storage
        // const storageRef = firebase.storage().ref(`documents/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
        // const snapshot = await storageRef.put(file);
        // const downloadURL = await snapshot.ref.getDownloadURL();
        const downloadURL = ""; // No storage, empty URL

        // Step B: Convert file to base64 for Gemini API
        const base64Data = await toBase64(file);

        // Step C: Send to Gemini for real extraction
        await extractMetadataWithGemini(base64Data, file.name, downloadURL, file.type);

    } catch (error) {
        console.error("Upload/AI Error:", error);
        alert("Failed to process document: " + error.message);
    }
}

// Helper: Convert File to Base64 for Gemini Payload
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

async function extractMetadataWithGemini(base64Data, fileName, downloadURL, mimeType) {
    // Ensure config is loaded
    if (!window.CONFIG) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

    const promptText = `
        Analyze this Indian document image. 
        Extract the following details and return ONLY a valid JSON object:
        {
            "name": "Full name of the person on the document",
            "type": "Specific document type (e.g. Aadhaar, PAN, Marksheet, Insurance)",
            "expiry": "Expiry date in YYYY-MM-DD format if available, else null",
            "issuer": "Issuing authority (e.g. UIDAI, CBSE, Income Tax Dept)",
            "id_number": "Main identification number"
        }
        If a field is missing, use null. No other text.
    `;

    const requestBody = {
        contents: [{
            parts: [
                { text: promptText },
                { inlineData: { mimeType: mimeType, data: base64Data } }
            ]
        }]
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const aiResponseText = data.candidates[0].content.parts[0].text;
        
        // Clean response from Markdown blocks if present
        const cleanJson = aiResponseText.replace(/```json|```/g, "").trim();
        const extractedData = JSON.parse(cleanJson);

        extractedData.url = downloadURL;
        extractedData.fileName = fileName;

        // Step D: Save extracted metadata to user's Firestore vault
        // const user = auth.currentUser;
        // await db.collection('users').doc(user.uid).collection('vault').add(extractedData);
        console.log("Mock save to vault:", extractedData);

        alert(`Success! ${extractedData.type} identified. (Saving disabled)`);
        window.location.href = 'vault.html';

    } catch (error) {
        console.error("Gemini Extraction Error:", error);
        alert("AI could not read the document clearly. It has been saved, but metadata may be missing.");
        
        // Fallback: Save with minimal info if AI fails
        // await db.collection('users').doc(auth.currentUser.uid).collection('vault').add({
        //     name: "Unknown", type: "Unclassified", expiry: null, issuer: "Unknown", url: downloadURL, fileName: fileName
        // });
        console.log("Mock fallback save");
        window.location.href = 'vault.html';
    }
}

/**
 * 3. CHATBOT LOGIC
 * Communicates with Gemini 1.5 Flash for document queries
 */
async function sendToGemini() {
    const input = document.getElementById('aiInput');
    const history = document.getElementById('chatHistory');
    const query = input.value;
    if (!query) return;
    // Ensure config is loaded
    if (!window.CONFIG) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    const systemPrompt = "You are Google Kaagaz AI. Only discuss documents and Indian government schemes. Handle irrelevant questions politely.";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${window.CONFIG.GEMINI_MODEL}:generateContent?key=${window.CONFIG.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt} User Query: ${query}` }] }] })
        });
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        // Append AI response to UI with better visibility
        history.innerHTML += `<div class="ai-msg bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-maroon/20 rounded-2xl p-6 mb-4"><p class="font-bold mb-2 text-maroon">🤖 Gemini AI:</p><p class="font-medium text-gray-800">${text}</p></div>`;
        history.scrollTop = history.scrollHeight;
    } catch (e) {
        history.innerHTML += `<div class="ai-msg bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-4 text-red-700 font-bold">Error connecting to Kaagaz Brain.</div>`;
    }
}

/**
 * 4. LOGOUT FUNCTION
 * Clears session and redirects to landing page
 */
function logout() {
    // firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    // }).catch((error) => {
    //     console.error("Logout failed:", error);
    // });
}