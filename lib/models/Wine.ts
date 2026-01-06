import mongoose from 'mongoose';

const WineSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "Cabernet Sauvignon Reserve"
        required: true,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Wine || mongoose.model('Wine', WineSchema);
