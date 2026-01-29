const cloudinary = require('../../config/cloudinary');

module.exports = async (req, res) => {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { publicId } = req.query;
        if (!publicId) {
            return res.status(400).json({ message: 'Missing publicId' });
        }

        const decodedId = publicId.replace(/-/g, '/');
        await cloudinary.uploader.destroy(decodedId, { resource_type: 'auto' });

        return res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Delete document error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
