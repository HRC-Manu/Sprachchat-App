// In-Memory Storage (für Produktion sollte eine Datenbank verwendet werden)
const chatRooms = new Map();

module.exports = (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { roomId } = req.query;
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
  } catch (error) {
    console.error('Error getting room info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 