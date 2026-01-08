
import mongoose from 'mongoose';

const TravelGuideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the guide.'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    url: {
        type: String,
        required: [true, 'Please provide the URL.'],
        unique: true,
    },
    summary: {
        type: String,
        maxlength: [500, 'Summary cannot be more than 500 characters'],
    },
    source: {
        type: String, // e.g. "Conde Nast", "Wine Folly"
        required: true,
    },
    imageUrl: {
        type: String,
    },
    regionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true,
    },
    country: {
        type: String, // Denormalized for easier filtering
        required: true,
        index: true,
    },
    keywords: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.TravelGuide || mongoose.model('TravelGuide', TravelGuideSchema);
