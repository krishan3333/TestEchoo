// socket-server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config(); // Load .env variables

const app = express();
const server = http.createServer(app);

// Configure Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    // Allow connections from your Next.js frontend URL
    origin: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.SOCKET_PORT || 3001; // Use port from .env or default to 3001

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // Event handler for joining a channel room
  socket.on('join_channel', (channelId) => {
    if (!channelId) {
        console.warn(`Client ${socket.id} tried to join invalid channel: ${channelId}`);
        return; // Avoid joining invalid rooms
    }
    socket.join(channelId);
    console.log(`User ${socket.id} joined channel room: ${channelId}`);
    // Optional: Notify others in the room that a user joined
    // socket.to(channelId).emit('user_joined', { userId: socket.id /* or user data */ });
  });

  // Event handler for leaving a channel room
  socket.on('leave_channel', (channelId) => {
     if (!channelId) {
        console.warn(`Client ${socket.id} tried to leave invalid channel: ${channelId}`);
        return;
    }
    socket.leave(channelId);
    console.log(`User ${socket.id} left channel room: ${channelId}`);
     // Optional: Notify others in the room that a user left
    // socket.to(channelId).emit('user_left', { userId: socket.id /* or user data */ });
  });

  // Event handler for receiving a message from a client
  socket.on('send_message', (messageData) => {
    // Basic validation
    if (!messageData || !messageData.channelId || !messageData.content) {
        console.warn(`Received invalid message data from ${socket.id}:`, messageData);
        return; // Don't broadcast invalid messages
    }
    console.log(`Message received for channel ${messageData.channelId} from ${socket.id}:`, messageData.content);

    // Broadcast the received message to all clients *in that specific channel's room*
    // Use `io.to()` instead of `socket.broadcast.to()` to include the sender
    io.to(messageData.channelId).emit('receive_message', messageData);

    // Alternative: Exclude sender
    // socket.broadcast.to(messageData.channelId).emit('receive_message', messageData);

    // TODO: Consider saving the message to the database here
    // Example: saveMessageToDb(messageData);
  });

  // Event handler for disconnection
  socket.on('disconnect', (reason) => {
    console.log(`🔥 Client disconnected: ${socket.id}. Reason: ${reason}`);
    // Optional: Clean up user status or notify others
  });

   // Handle connection errors
   socket.on('error', (error) => {
        console.error(`Socket Error for ${socket.id}:`, error);
   });

});

// Start the HTTP server (which includes Socket.IO)
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server is running on port ${PORT}`);
});

// Optional: Basic Express route for health check
app.get('/health', (req, res) => {
    res.status(200).send('Socket server is healthy');
});