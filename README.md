# Talk2me App

Eine moderne Alternative zum CB-Funk für LKW-Fahrer. Scanne QR-Codes und chatte mit anderen Fahrern in Echtzeit!

## 🎯 Features

- **QR-Code Generator**: Erstelle einen QR-Code für deinen Bus
- **Echtzeit-Chat**: Chatte mit anderen Fahrern über dein Smartphone
- **Einfache Bedienung**: Scan QR-Code → Name eingeben → Loschatten!
- **Offline-fähig**: Funktioniert auch bei schlechtem Empfang
- **Open Source**: Jeder kann mitentwickeln und erweitern

## 🚀 Schnellstart

### Voraussetzungen
- Node.js (Version 18 oder höher)
- npm oder yarn

### Installation

```bash
# Repository klonen
git clone https://github.com/dein-username/talk2me-app.git
cd talk2me-app

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App ist dann unter `http://localhost:3000` verfügbar.

## 📱 Verwendung

### Als Bus-Besitzer:
1. Gehe zu `/generate` in der App
2. Gib deinen Namen ein
3. Generiere deinen QR-Code
4. Drucke ihn aus und klebe ihn an deinen Bus

### Als Chat-Teilnehmer:
1. Scanne den QR-Code mit deinem Smartphone
2. Gib deinen Namen ein
3. Starte das Chatten!

## 🛠️ Technologie-Stack

- **Frontend**: React.js mit TypeScript
- **Backend**: Node.js mit Express
- **Echtzeit-Kommunikation**: Socket.io
- **Styling**: Tailwind CSS
- **QR-Codes**: qrcode.js
- **Deployment**: Vercel/Netlify ready

## 🤝 Mitentwickeln

Wir freuen uns über Beiträge! So kannst du helfen:

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

### Entwicklungssetup

```bash
# Abhängigkeiten installieren
npm install

# Tests ausführen
npm test

# Code formatieren
npm run format

# Linting
npm run lint
```

## 📋 Roadmap

- [ ] Push-Benachrichtigungen
- [ ] Standort-Sharing
- [ ] Sprach-Nachrichten
- [ ] Gruppen-Chats
- [ ] Offline-Modus verbessern
- [ ] Dark Mode
- [ ] Mehrsprachigkeit

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

## 🙏 Danksagungen

- Inspiriert von der CB-Funk Community
- Built with ❤️ für Talk2me Community weltweit

## 📞 Support

Hast du Fragen oder Probleme? Erstelle ein Issue auf GitHub oder kontaktiere uns!

---

**Fahre sicher und chatte verantwortungsvoll! 🚐💬** 
