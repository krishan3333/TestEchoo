const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js app URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.SOCKET_PORT || 3001;

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // Event to join a specific channel's room
  socket.on('join_channel', (channelId) => {
    socket.join(channelId);
    console.log(`User ${socket.id} joined channel room: ${channelId}`);
  });

  // Event to leave a channel's room
  socket.on('leave_channel', (channelId) => {
    socket.leave(channelId);
    console.log(`User ${socket.id} left channel room: ${channelId}`);
  });

  // Listen for a new message from a client
  socket.on('send_message', (messageData) => {
    // Broadcast the received message to all clients in that channel's room
    io.to(messageData.channelId).emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    console.log(`🔥 Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server is running on port ${PORT}`);
});
