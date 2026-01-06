import mongoose from 'mongoose';

const WinerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    country: {
        type: String,
    },
    region: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    imageUrl: {
        type: String, // URL from Blob storage
    },
    websiteUrl: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String, // Contact phone
    },
    metaTitle: {
        type: String, // SEO Title
    },
    metaDescription: {
        type: String, // SEO Description
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    tier: {
        type: String,
        enum: ['Basic', 'Premium'], // Premium = "Recommended" / Top of list
        default: 'Basic',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Winery || mongoose.model('Winery', WinerySchema);
