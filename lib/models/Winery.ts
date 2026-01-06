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
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
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
