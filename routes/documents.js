const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Multer config for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
});

// @route   POST /api/documents/upload
// @desc    Upload document to Cloudinary
// @access  Public (Firebase auth handled in frontend)
router.post('/upload', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary using buffer
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'kaagaz-ai-documents',
                resource_type: 'auto',
                transformation: [
                    { quality: 'auto' },
                    { fetch_format: 'auto' }
                ]
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Error uploading to Cloudinary' });
                }

                res.status(201).json({
                    success: true,
                    message: 'Document uploaded successfully',
                    document: {
                        name: req.body.name || req.file.originalname,
                        type: req.body.type || 'Other',
                        url: result.secure_url,
                        publicId: result.public_id,
                        uploadedAt: new Date()
                    }
                });
            }
        );

        // Pipe the file buffer to Cloudinary
        uploadStream.end(req.file.buffer);

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

// @route   DELETE /api/documents/:publicId
// @desc    Delete document from Cloudinary
// @access  Public (Firebase auth handled in frontend)
router.delete('/:publicId', async (req, res) => {
    try {
        const publicId = req.params.publicId.replace(/-/g, '/');
        
        await cloudinary.uploader.destroy(publicId);

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
