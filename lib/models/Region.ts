import mongoose from 'mongoose';

const RegionSchema = new mongoose.Schema({
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
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        // Not required YET to allow migration of existing data, but intended to be required.
        // Making it optional for now to prevent breaking existing queries if any assume shape.
    },
    country: {
        type: String, // Kept for backward compatibility/Legacy
        required: true,
    },
    countryCode: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    imageUrl: {
        type: String,
    },
    isTopRegion: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.models.Region || mongoose.model('Region', RegionSchema);
