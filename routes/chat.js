// routes/chat.js - Chat routes

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Get messages between two users
router.get('/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        }).sort('timestamp');
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Send message
router.post('/', auth, async (req, res) => {
    try {
        const { receiver, text, image } = req.body;
        
        const newMessage = new Message({
            sender: req.user.id,
            receiver,
            text,
            image
        });
        
        const savedMessage = await newMessage.save();
        
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
