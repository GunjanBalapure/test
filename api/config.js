// Vercel Serverless Function - Firebase Config
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Return Firebase config from environment variables
        const config = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        };

        // Validate all keys are present
        const missingKeys = Object.entries(config)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missingKeys.length > 0) {
            return res.status(500).json({ 
                error: 'Missing Firebase configuration',
                missingKeys 
            });
        }

        return res.status(200).json(config);

    } catch (error) {
        console.error('Config error:', error);
        return res.status(500).json({ 
            error: 'Failed to load configuration',
            message: error.message
        });
    }
};
