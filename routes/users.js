// routes/users.js - User routes

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-contacts');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/', auth, async (req, res) => {
    try {
        const { name, bio } = req.body;
        
        const user = await User.findByIdAndUpdate(req.user.id, {
            name,
            bio
        }, { new: true });
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add contact
router.post('/contacts', auth, async (req, res) => {
    try {
        const { phone } = req.body;
        
        // Find contact by phone
        const contact = await User.findOne({ phone });
        if (!contact) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if already a contact
        const user = await User.findById(req.user.id);
        if (user.contacts.includes(contact._id)) {
            return res.status(400).json({ message: 'Contact already added' });
        }
        
        // Add contact
        user.contacts.push(contact._id);
        await user.save();
        
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user contacts
router.get('/contacts/list', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('contacts', 'name phone avatar status');
        res.json(user.contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
