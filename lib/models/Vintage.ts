import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVintage extends Document {
    regionId: mongoose.Types.ObjectId;
    year: number;
    grapeyearScore: number;
    // Flat Metrics (New Schema)
    gdd?: number;
    rainfall?: number;
    diurnalShiftAvg?: number;
    avgTemperature?: number;
    sunshineHours?: number;
    frostDays?: number;
    // Legacy support for nested (optional)
    metrics?: {
        growingDegreeDays: number;
        totalRainfallMm: number;
        diurnalShiftAvg: number;
        avgTemperature: number;
        sunshineHours: number;
        frostDays: number;
    };
    quality?: 'exceptional' | 'excellent' | 'good' | 'average' | 'challenging';
    vintageSummary?: string;
    aiSummary?: string; // Legacy

    storyMetrics?: {
        flowering: {
            rainMm: number;
            avgTemp: number;
            status: string;
        };
        harvest: {
            rainMm: number;
            heatwaveDays: number;
            conditions: string;
        };
        growingSeason: {
            heatSpikes: number;
            frostEvents: number;
            diurnalRange: number;
            droughtStress: boolean;
        };
    };
    uniqueComposite?: string;
}

const VintageSchema: Schema = new Schema({
    regionId: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
    year: {
        type: Number,
        required: true,
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
    },
    // Main Stats (Aggregated)
    gdd: Number,
    rainfall: Number,
    avgTemperature: Number,
    sunshineHours: Number,
    frostDays: Number,
    heatSpikes: Number, // Days > 35°C
    earlyFrostDays: Number, // Frost in first 60 days
    lateFrostDays: Number, // Frost in last 30 days
    harvestRainMm: Number, // Rain in last 30 days
    droughtStressMaxDays: Number, // Max consecutive days < 1mm rain
    diurnalShiftAvg: Number,

    // New: Advanced Story Metrics for AI Generation
    storyMetrics: {
        flowering: {
            rainMm: Number,
            avgTemp: Number,
            status: String // 'Excellent' | 'Good' | 'Poor'
        },
        harvest: {
            rainMm: Number,
            heatwaveDays: Number,
            conditions: String // 'Dry' | 'Wet' | 'Mixed'
        },
        growingSeason: {
            heatSpikes: Number, // Temp > 35C
            frostEvents: Number, // Temp < 0C (Spring)
            diurnalRange: Number,
            droughtStress: Boolean
        }
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
