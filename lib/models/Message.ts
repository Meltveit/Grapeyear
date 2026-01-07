import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String, // Optional subject or topic (e.g. "General", "Partnership")
        default: 'General Inquiry'
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
