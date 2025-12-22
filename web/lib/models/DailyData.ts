import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailyData extends Document {
    vintageId: mongoose.Types.ObjectId;
    date: Date;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    sunshineHours?: number;
}

const DailyDataSchema: Schema = new Schema({
    vintageId: { type: Schema.Types.ObjectId, ref: 'Vintage', required: true },
    date: { type: Date, required: true },
    tempMax: Number,
    tempMin: Number,
    precipitation: Number,
    sunshineHours: Number
});

// Index for efficient querying by vintage
DailyDataSchema.index({ vintageId: 1, date: 1 }, { unique: true });

const DailyData: Model<IDailyData> = mongoose.models.DailyData || mongoose.model<IDailyData>('DailyData', DailyDataSchema);

export default DailyData;
