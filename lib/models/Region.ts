import mongoose, { Document } from 'mongoose';

export interface IRegion extends Document {
    name: string;
    slug: string;
    countryId?: mongoose.Types.ObjectId;
    country: string;
    countryCode: string;
    description?: string;
    location: {
        type: 'Point';
        coordinates: number[];
    };
    imageUrl?: string;
    isTopRegion: boolean;
    createdAt: Date;
    updatedAt: Date;
}

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
        // Not required YET to allow migration of existing data
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

export default mongoose.models.Region || mongoose.model<IRegion>('Region', RegionSchema);
