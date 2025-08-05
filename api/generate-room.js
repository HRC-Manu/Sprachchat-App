const { v4: uuidv4 } = require('uuid');

// In-Memory Storage (für Produktion sollte eine Datenbank verwendet werden)
const chatRooms = new Map();

module.exports = (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    res.json({
      roomId,
      qrCodeUrl: `${baseUrl}/chat/${roomId}`,
      message: 'Chat-Raum erfolgreich erstellt!'
    });
  } catch (error) {
    console.error('Error generating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 