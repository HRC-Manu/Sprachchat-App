import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
  userName: string;
}

interface RoomInfo {
  roomId: string;
  driverName: string;
  participantCount: number;
  createdAt: Date;
}

const ChatPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    // Raum-Informationen abrufen
    fetchRoomInfo();

    // Socket.io Verbindung herstellen
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Mit Server verbunden');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Verbindung zum Server verloren');
    });

    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('room-history', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('error', (error: { message: string }) => {
      setError(error.message);
    });

    return () => {
      newSocket.close();
    };
  }, [roomId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchRoomInfo = async () => {
    try {
      const response = await fetch(`/api/room/${roomId}`);
      if (!response.ok) {
        throw new Error('Chat-Raum nicht gefunden');
      }
      const data = await response.json();
      setRoomInfo(data);
    } catch (err) {
      setError('Chat-Raum nicht gefunden');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const joinRoom = () => {
    if (!userName.trim() || !socket || !roomId) return;

    socket.emit('join-room', {
      roomId,
      userName: userName.trim()
    });

    setShowNameInput(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !roomId || !userName) return;

    socket.emit('send-message', {
      roomId,
      message: newMessage.trim(),
      userName
    });

    setNewMessage('');
  };

  const leaveRoom = () => {
    if (socket && roomId && userName) {
      socket.emit('leave-room', { roomId, userName });
    }
    navigate('/');
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Fehler</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Zurück zur Startseite
          </button>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Chat beitreten</h1>
            {roomInfo && (
              <p className="text-gray-600">
                Chat mit {roomInfo.driverName}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Dein Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="z.B. Hans"
              className="input-field"
              maxLength={30}
              onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={joinRoom}
              disabled={!userName.trim()}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Beitreten
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary flex-1">
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Chat mit {roomInfo?.driverName}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{isConnected ? 'Verbunden' : 'Verbindung verloren'}</span>
              {roomInfo && (
                <span>{roomInfo.participantCount} Teilnehmer</span>
              )}
            </div>
          </div>
          <button onClick={leaveRoom} className="btn-secondary">
            Verlassen
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="card flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.userName === userName ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`message-bubble ${
                message.type === 'system' 
                  ? 'message-system w-full' 
                  : message.userName === userName 
                    ? 'message-own' 
                    : 'message-other'
              }`}>
                {message.type === 'user' && (
                  <div className="text-xs opacity-75 mb-1">
                    {message.userName}
                  </div>
                )}
                <div>{message.content}</div>
                <div className="text-xs opacity-75 mt-1">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Nachricht eingeben..."
              className="input-field flex-1"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="btn-primary disabled:opacity-50"
            >
              Senden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 