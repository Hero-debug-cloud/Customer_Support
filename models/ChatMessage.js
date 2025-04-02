const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    sender: { type: String, enum: ['customer', 'support_agent'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);