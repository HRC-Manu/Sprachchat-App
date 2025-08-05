import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <span className="text-6xl mb-4 block">🚛</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            LKW-Chat App
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Die moderne Alternative zum CB-Funk
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/generate" className="btn-primary text-lg">
            QR-Code erstellen
          </Link>
          <button className="btn-secondary text-lg">
            Wie funktioniert's?
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold mb-2">Einfach scannen</h3>
          <p className="text-gray-600">
            Scanne den QR-Code am Bus und starte sofort das Chatten
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Echtzeit-Chat</h3>
          <p className="text-gray-600">
            Chatte in Echtzeit mit anderen LKW-Fahrern
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Sicher & Privat</h3>
          <p className="text-gray-600">
            Deine Daten bleiben sicher und privat
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">So funktioniert's</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-truck-blue">
              Als Bus-Besitzer:
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="bg-truck-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <span>Gehe zu "QR-Code erstellen"</span>
              </li>
              <li className="flex items-start">
                <span className="bg-truck-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <span>Gib deinen Namen ein</span>
              </li>
              <li className="flex items-start">
                <span className="bg-truck-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <span>Drucke den QR-Code aus</span>
              </li>
              <li className="flex items-start">
                <span className="bg-truck-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                <span>Klebe ihn an deinen Bus</span>
              </li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-truck-orange">
              Als Chat-Teilnehmer:
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="bg-truck-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <span>Scanne den QR-Code</span>
              </li>
              <li className="flex items-start">
                <span className="bg-truck-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <span>Gib deinen Namen ein</span>
              </li>
              <li className="flex items-start">
                <span className="bg-truck-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <span>Starte das Chatten!</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="card bg-gradient-to-r from-truck-blue to-blue-600 text-white">
          <h2 className="text-2xl font-bold mb-4">Bereit loszulegen?</h2>
          <p className="text-blue-100 mb-6">
            Erstelle jetzt deinen ersten QR-Code und verbinde dich mit anderen LKW-Fahrern!
          </p>
          <Link to="/generate" className="btn-secondary">
            Jetzt QR-Code erstellen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 