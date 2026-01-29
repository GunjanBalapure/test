const cloudinary = require('../../config/cloudinary');
const formidable = require('formidable');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const form = formidable({
        maxFileSize: 10 * 1024 * 1024,
        keepExtensions: true,
        multiples: false
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parse error:', err);
            return res.status(400).json({ message: 'Invalid upload data' });
        }

        const file = files.document;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const result = await cloudinary.uploader.upload(file.filepath, {
                folder: 'kaagaz-ai-documents',
                resource_type: 'auto',
                transformation: [
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            });

            return res.status(201).json({
                success: true,
                message: 'Document uploaded successfully',
                document: {
                    name: fields.name || file.originalFilename,
                    type: fields.type || 'Other',
                    url: result.secure_url,
                    publicId: result.public_id,
                    uploadedAt: new Date()
                }
            });
        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return res.status(500).json({ message: 'Error uploading to Cloudinary' });
        }
    });
};

module.exports.config = {
    api: {
        bodyParser: false
    }
};
