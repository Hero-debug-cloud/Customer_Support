const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const router = express.Router();
const ActiveSessions = require('../models/ActiveSessions');

// Start chat session
router.post('/start-chat', async (req, res) => {
    let {role,sessionId} = req.body;

    //connect support agent to the active session;
    if(role=="support_agent" && sessionId){
        const activeSession = await ActiveSessions.findOne({sessionId});
        if(!activeSession){
            return res.status(400).json({ message: 'No active session available' });
        }
    }
    //create new session for customer;
    else if(role=="customer"){
         sessionId = Math.random().toString(36).substr(2, 9);
         await ActiveSessions.create({ sessionId });
    }
    //get active session for support agent;
    else{
        const activeSession = await ActiveSessions.findOne({isActive:true}).sort({_id:-1}).limit(1);
        if(activeSession){
            sessionId = activeSession.sessionId;
        }else{
            //400 with not active session;
            return res.status(400).json({ message: 'No active session available' });
        }
    }
    
    return res.status(200).json({ sessionId });
    
});

// Get messages for a session
router.get('/messages', async (req, res) => {
    const { sessionId } = req.query;
    if(!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
    }
    const messages = await ChatMessage.find({ sessionId }).sort({timestamp:1});
    res.json(messages);
});

// Save a message
router.post('/messages', async (req, res) => {
    const { sessionId, sender, message } = req.body;
    const newMessage = new ChatMessage({ sessionId, sender, message });
    await newMessage.save();
    res.status(201).json(newMessage);
});

//get all active sessions
router.get('/active-sessions', async (req, res) => {
    const activeSessions = await ActiveSessions.find({isActive:true}).sort({_id:-1}).limit(5);
    res.status(200).json(activeSessions);
});

module.exports = router;