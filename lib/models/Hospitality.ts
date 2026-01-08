
import mongoose from 'mongoose';

const HospitalitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
    },
    type: {
        type: String,
        enum: ['hotel', 'restaurant', 'experience'],
        required: true,
        index: true,
    },
    regionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true,
    },
    country: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
    },
    address: {
        type: String,
    },
    websiteUrl: {
        type: String,
    },
    bookingUrl: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    tier: {
        type: String,
        enum: ['standard', 'featured', 'premium'],
        default: 'standard',
        index: true,
    },
    paymentStatus: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Hospitality || mongoose.model('Hospitality', HospitalitySchema);
