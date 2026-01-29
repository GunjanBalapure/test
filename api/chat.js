// Vercel Serverless Function - Gemini Chat
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query, systemPrompt } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Missing query' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_MODEL = 'gemini-2.5-flash';

        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY not found in environment variables');
            return res.status(500).json({ 
                error: 'Gemini API key not configured',
                details: 'Please add GEMINI_API_KEY to Vercel environment variables'
            });
        }

        console.log('Using Gemini model:', GEMINI_MODEL);

        const prompt = systemPrompt 
            ? `${systemPrompt}\n\nUser Query: ${query}`
            : query;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                        topP: 0.8,
                        topK: 40
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API error:', data);
            return res.status(response.status).json({ 
                error: data.error?.message || 'Gemini API error',
                statusCode: response.status
            });
        }

        if (!data.candidates || !data.candidates[0]) {
            console.error('No candidates in response:', data);
            return res.status(500).json({ 
                error: 'No response from AI',
                details: 'The AI did not generate a response'
            });
        }

        const text = data.candidates[0]?.content?.parts?.[0]?.text || 'No response';

        return res.status(200).json({ success: true, text });

    } catch (error) {
        console.error('Chat error:', error);
        return res.status(500).json({ 
            error: 'Chat failed',
            message: error.message
        });
    }
};
