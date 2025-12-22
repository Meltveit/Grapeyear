import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegion extends Document {
    slug: string;
    name: string;
    country: string;
    countryCode: string;
    location: {
        type: string;
        coordinates: number[];
    };
    description?: string;
    imageUrl?: string;
}

const RegionSchema: Schema = new Schema({
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    description: String,
    imageUrl: String,
}, { timestamps: true });

const Region: Model<IRegion> = mongoose.models.Region || mongoose.model<IRegion>('Region', RegionSchema);

export default Region;
