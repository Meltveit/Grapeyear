import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVintage extends Document {
    regionId: mongoose.Types.ObjectId;
    year: number;
    grapeyearScore: number;
    metrics: {
        growingDegreeDays: number;
        totalRainfallMm: number;
        diurnalShiftAvg: number;
        avgTemperature: number;
        sunshineHours: number;
        frostDays: number;
    };
    quality?: 'exceptional' | 'excellent' | 'good' | 'average' | 'challenging';
    aiSummary?: string;
    uniqueComposite?: string;
}

const VintageSchema: Schema = new Schema({
    regionId: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
    year: { type: Number, required: true },
    grapeyearScore: Number,

    metrics: {
        growingDegreeDays: Number,
        totalRainfallMm: Number,
        diurnalShiftAvg: Number,
        avgTemperature: Number,
        sunshineHours: Number,
        frostDays: Number,
        heatSpikes: Number, // Days > 35°C
        earlyFrostDays: Number, // Frost in first 60 days
        lateFrostDays: Number, // Frost in last 30 days
        harvestRainMm: Number, // Rain in last 30 days
        droughtStressMaxDays: Number, // Max consecutive days < 1mm rain
    },

    quality: { type: String, enum: ['exceptional', 'excellent', 'good', 'average', 'challenging'] },
    aiSummary: String,

    // uniqueComposite is useful if we want to enforce unique region+year at the application level easily, 
    // though a compound index is better.
    uniqueComposite: { type: String, unique: true }
}, { timestamps: true });

// Compound index to ensure one vintage per region per year
VintageSchema.index({ regionId: 1, year: 1 }, { unique: true });

const Vintage: Model<IVintage> = mongoose.models.Vintage || mongoose.model<IVintage>('Vintage', VintageSchema);

export default Vintage;
