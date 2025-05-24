// server.js - Backend server for WhatsApp Clone

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/whatsapp-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Message = require('./models/Message');

// Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

// Socket.io for real-time communication
io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Join room for a specific user
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
        
        // Update user status to online
        User.findByIdAndUpdate(userId, { status: 'online' }, { new: true })
            .then(user => {
                io.emit('status-change', { userId: user._id, status: 'online' });
            });
    });
    
    // Handle new messages
    socket.on('send-message', async (data) => {
        try {
            const { sender, receiver, text, image } = data;
            
            // Save message to database
            const newMessage = new Message({
                sender,
                receiver,
                text: text || null,
                image: image || null,
                timestamp: new Date()
            });
            
            const savedMessage = await newMessage.save();
            
            // Emit to receiver
            io.to(receiver).emit('receive-message', savedMessage);
            
            // Also emit back to sender for UI update
            io.to(sender).emit('message-sent', savedMessage);
            
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
    
    // Handle status updates
    socket.on('update-status', async (data) => {
        try {
            const { userId, status } = data;
            
            const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
            
            if (user) {
                io.emit('status-change', { userId: user._id, status: user.status });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
