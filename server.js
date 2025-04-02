const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const socketHandler = require('./sockets');
const { connectDB } = require('./config/db');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/chat', chatRoutes);

// Handle sockets
socketHandler.init(io);

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

