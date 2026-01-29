// Vercel Serverless Function - Gemini Document Analysis
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
        const { imageData, mimeType } = req.body;

        if (!imageData || !mimeType) {
            return res.status(400).json({ error: 'Missing imageData or mimeType' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_MODEL = 'gemini-2.5-flash';

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }

        const prompt = `Analyze this document image and extract all relevant information. Provide a detailed analysis in the following JSON format:
{
  "documentType": "type of document (e.g., Aadhaar, PAN, Marksheet, Insurance, etc.)",
  "category": "category (Identity/Education/Financial/Medical/Legal/Other)",
  "title": "descriptive title",
  "issuer": "issuing authority or organization",
  "holderName": "name of the person",
  "documentNumber": "document ID or number if visible",
  "issueDate": "issue date if visible",
  "expiryDate": "expiry date if visible or 'N/A'",
  "keyDetails": ["list", "of", "important", "details", "extracted"],
  "summary": "brief 2-3 sentence summary"
}

Be thorough and extract as much information as possible. If information is not clearly visible, use 'Not visible' or 'N/A'.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: imageData
                                }
                            }
                        ]
                    }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API error:', data);
            return res.status(response.status).json({ 
                error: data.error?.message || 'Gemini API error',
                details: data
            });
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            return res.status(500).json({ 
                error: 'Invalid API response: No candidates returned',
                details: data
            });
        }

        const analysisText = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!analysis) {
            return res.status(500).json({ 
                error: 'Failed to parse analysis',
                rawText: analysisText
            });
        }

        return res.status(200).json({ success: true, analysis });

    } catch (error) {
        console.error('Analysis error:', error);
        return res.status(500).json({ 
            error: 'Analysis failed',
            message: error.message
        });
    }
};
