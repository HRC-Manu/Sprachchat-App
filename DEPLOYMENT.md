# 🚀 Deployment Guide

Hier findest du Anleitungen zum Deployment der LKW-Chat App auf verschiedenen Plattformen.

## 📋 Voraussetzungen

- Node.js 18+ installiert
- Git installiert
- Account bei einer Hosting-Plattform

## 🌐 Vercel (Empfohlen)

Vercel ist ideal für React-Apps und bietet einfaches Deployment.

### 1. Vorbereitung

```bash
# Build das Projekt
npm run build
```

### 2. Vercel CLI Installation

```bash
npm install -g vercel
```

### 3. Deployment

```bash
# Login bei Vercel
vercel login

# Deploy
vercel

# Für Produktion
vercel --prod
```

### 4. Umgebungsvariablen

Setze diese in den Vercel-Einstellungen:

```
CLIENT_URL=https://deine-app.vercel.app
NODE_ENV=production
```

## 🐳 Docker

### 1. Dockerfile erstellen

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/build ./client/build

EXPOSE 5000
CMD ["node", "server/index.js"]
```

### 2. Docker Compose

```yaml
version: '3.8'
services:
  lkw-chat:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - CLIENT_URL=http://localhost:5000
```

### 3. Deployment

```bash
# Build und starten
docker-compose up -d

# Oder mit Docker
docker build -t lkw-chat .
docker run -p 5000:5000 lkw-chat
```

## ☁️ Heroku

### 1. Heroku CLI Installation

```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download von https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Deployment

```bash
# Login
heroku login

# App erstellen
heroku create deine-lkw-chat-app

# Umgebungsvariablen setzen
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://deine-lkw-chat-app.herokuapp.com

# Deploy
git push heroku main
```

## 🐙 GitHub Pages

Für statisches Hosting (nur Frontend):

### 1. Build

```bash
cd client
npm run build
```

### 2. GitHub Pages aktivieren

1. Gehe zu Repository Settings
2. Scrolle zu "Pages"
3. Wähle "Deploy from a branch"
4. Wähle `gh-pages` Branch

### 3. GitHub Actions (automatisches Deployment)

Erstelle `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        npm install
        cd client && npm install
        
    - name: Build
      run: |
        cd client && npm run build
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./client/build
```

## 🔧 Umgebungsvariablen

### Entwicklung
```bash
# .env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Produktion
```bash
# .env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://deine-domain.com
```

## 📊 Monitoring

### Health Check

Die App bietet einen Health Check Endpoint:

```
GET /api/health
```

### Logs

```bash
# Vercel
vercel logs

# Heroku
heroku logs --tail

# Docker
docker logs container-name
```

## 🔒 SSL/HTTPS

Für Produktionsumgebungen:

- **Vercel**: Automatisch
- **Heroku**: Automatisch
- **Docker**: Reverse Proxy (Nginx) verwenden
- **GitHub Pages**: Automatisch

## 🚨 Troubleshooting

### Häufige Probleme

1. **CORS-Fehler**
   - Prüfe `CLIENT_URL` in Umgebungsvariablen
   - Stelle sicher, dass Backend und Frontend auf derselben Domain sind

2. **Socket.io Verbindungsfehler**
   - Prüfe, ob der Server läuft
   - Stelle sicher, dass Port 5000 erreichbar ist

3. **Build-Fehler**
   - Prüfe Node.js Version (18+)
   - Lösche `node_modules` und installiere neu

### Support

Bei Problemen:
1. Prüfe die Logs
2. Erstelle ein Issue auf GitHub
3. Kontaktiere das Team

---

**Viel Erfolg beim Deployment! 🚛💬** 