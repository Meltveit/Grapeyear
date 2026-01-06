import mongoose from 'mongoose';

const WineSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "Cabernet Sauvignon Reserve"
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    wineryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Winery',
        required: true,
    },
    type: {
        type: String,
        enum: ['Red', 'White', 'Sparkling', 'Rosé', 'Dessert', 'Fortified'],
        required: true,
    },
    grapeVarieties: [{
        type: String,
    }],
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    // SEO Fields
    keywords: [{
        type: String, // e.g., ["Full-bodied", "Oaky", "Napa Cab"]
    }],
    seoDescription: {
        type: String, // Meta description specific to this wine
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Wine || mongoose.model('Wine', WineSchema);
