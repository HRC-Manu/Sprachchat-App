const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-Memory Storage (für Produktion sollte eine Datenbank verwendet werden)
const chatRooms = new Map();
const activeUsers = new Map();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Talk2me Server läuft!' });
});

// QR-Code Generator Endpoint
app.post('/api/generate-room', (req, res) => {
  const { driverName } = req.body;
  
  if (!driverName || driverName.trim().length < 2) {
    return res.status(400).json({ error: 'Name muss mindestens 2 Zeichen lang sein' });
  }

  const roomId = uuidv4();
  const roomData = {
    id: roomId,
    driverName: driverName.trim(),
    createdAt: new Date(),
    messages: [],
    participants: []
  };

  chatRooms.set(roomId, roomData);
  
  res.json({
    roomId,
    qrCodeUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/chat/${roomId}`,
    message: 'Chat-Raum erfolgreich erstellt!'
  });
});

// Chat-Raum Informationen abrufen
app.get('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = chatRooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Chat-Raum nicht gefunden' });
  }
  
  res.json({
    roomId: room.id,
    driverName: room.driverName,
    participantCount: room.participants.length,
    createdAt: room.createdAt
  });
});

// Socket.io Event Handling
io.on('connection', (socket) => {
  console.log('Neuer Benutzer verbunden:', socket.id);

  // Benutzer tritt einem Chat-Raum bei
  socket.on('join-room', ({ roomId, userName }) => {
    const room = chatRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Chat-Raum nicht gefunden' });
      return;
    }

    // Benutzer zum Raum hinzufügen
    socket.join(roomId);
    
    const userData = {
      id: socket.id,
      name: userName,
      joinedAt: new Date()
    };
    
    room.participants.push(userData);
    activeUsers.set(socket.id, { roomId, userName });

    // Willkommensnachricht senden
    const welcomeMessage = {
      id: uuidv4(),
      type: 'system',
      content: `${userName} ist dem Chat beigetreten`,
      timestamp: new Date(),
      userName: 'System'
    };
    
    room.messages.push(welcomeMessage);
    io.to(roomId).emit('message', welcomeMessage);
    io.to(roomId).emit('user-joined', userData);
    
    // Aktuelle Nachrichten an neuen Benutzer senden
    socket.emit('room-history', room.messages);
    
    console.log(`${userName} ist Raum ${roomId} beigetreten`);
  });

  // Nachricht senden
  socket.on('send-message', ({ roomId, message, userName }) => {
    const room = chatRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Chat-Raum nicht gefunden' });
      return;
    }

    const newMessage = {
      id: uuidv4(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      userName: userName
    };

    room.messages.push(newMessage);
    
    // Nachricht an alle im Raum senden
    io.to(roomId).emit('message', newMessage);
    
    console.log(`Nachricht in Raum ${roomId}: ${userName}: ${message}`);
  });

  // Benutzer verlässt den Raum
  socket.on('leave-room', ({ roomId, userName }) => {
    const room = chatRooms.get(roomId);
    
    if (room) {
      room.participants = room.participants.filter(p => p.id !== socket.id);
      
      const leaveMessage = {
        id: uuidv4(),
        type: 'system',
        content: `${userName} hat den Chat verlassen`,
        timestamp: new Date(),
        userName: 'System'
      };
      
      room.messages.push(leaveMessage);
      io.to(roomId).emit('message', leaveMessage);
      io.to(roomId).emit('user-left', { id: socket.id, name: userName });
    }
    
    socket.leave(roomId);
    activeUsers.delete(socket.id);
    
    console.log(`${userName} hat Raum ${roomId} verlassen`);
  });

  // Verbindung getrennt
  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id);
    
    if (userData) {
      const { roomId, userName } = userData;
      const room = chatRooms.get(roomId);
      
      if (room) {
        room.participants = room.participants.filter(p => p.id !== socket.id);
        
        const disconnectMessage = {
          id: uuidv4(),
          type: 'system',
          content: `${userName} hat die Verbindung verloren`,
          timestamp: new Date(),
          userName: 'System'
        };
        
        room.messages.push(disconnectMessage);
        io.to(roomId).emit('message', disconnectMessage);
      }
      
      activeUsers.delete(socket.id);
      console.log(`${userName} hat die Verbindung verloren`);
    }
  });
});

// Cleanup alte Chat-Räume (älter als 24 Stunden)
setInterval(() => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  for (const [roomId, room] of chatRooms.entries()) {
    if (room.createdAt < oneDayAgo && room.participants.length === 0) {
      chatRooms.delete(roomId);
      console.log(`Alter Chat-Raum ${roomId} gelöscht`);
    }
  }
}, 60 * 60 * 1000); // Jede Stunde prüfen

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚐 Talk2me Server läuft auf Port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
}); 