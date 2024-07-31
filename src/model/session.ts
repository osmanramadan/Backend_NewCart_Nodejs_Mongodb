import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    order_id: { type: String, unique: true, required: true },
    session_id: { type: String, required: true },
    created_at: { type: Date, default:new Date().toLocaleString('en-EG',{timeZone:'Africa/Cairo'}) },
});

const Session = mongoose.model('Session', sessionSchema);

export default Session