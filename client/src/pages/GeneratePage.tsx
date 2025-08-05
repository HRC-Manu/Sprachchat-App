import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const GeneratePage: React.FC = () => {
  const [driverName, setDriverName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQRCode = async () => {
    if (!driverName.trim()) {
      setError('Bitte gib deinen Namen ein');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driverName: driverName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen des QR-Codes');
      }

      setRoomId(data.roomId);
      setQrCodeUrl(data.qrCodeUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `lkw-chat-${driverName}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    alert('Link kopiert!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">QR-Code erstellen</h1>
        <p className="text-blue-100">
          Erstelle einen QR-Code für deinen Bus und lade andere LKW-Fahrer zum Chatten ein
        </p>
      </div>

      {!roomId ? (
        <div className="card">
          <div className="mb-6">
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-2">
              Dein Name
            </label>
            <input
              type="text"
              id="driverName"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="z.B. Max Mustermann"
              className="input-field"
              maxLength={50}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={generateQRCode}
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                QR-Code wird erstellt...
              </span>
            ) : (
              'QR-Code erstellen'
            )}
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              QR-Code für {driverName}
            </h2>
            <p className="text-gray-600">
              Drucke diesen QR-Code aus und klebe ihn an deinen Bus
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <QRCode
                value={qrCodeUrl}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chat-Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={qrCodeUrl}
                  readOnly
                  className="input-field rounded-r-none"
                />
                <button
                  onClick={copyLink}
                  className="px-4 py-3 bg-gray-500 text-white rounded-r-lg hover:bg-gray-600 transition-colors"
                >
                  Kopieren
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadQRCode}
                className="btn-primary flex-1"
              >
                QR-Code herunterladen
              </button>
              <button
                onClick={() => {
                  setRoomId('');
                  setQrCodeUrl('');
                  setDriverName('');
                }}
                className="btn-secondary flex-1"
              >
                Neuen QR-Code erstellen
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tipps:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Drucke den QR-Code in A4-Größe für bessere Lesbarkeit</li>
              <li>• Klebe ihn an eine gut sichtbare Stelle am Bus</li>
              <li>• Verwende wasserfestes Papier oder laminiere den Code</li>
              <li>• Der Chat-Raum bleibt 24 Stunden aktiv</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePage; 