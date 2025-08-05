# Multi-stage build für optimierte Image-Größe
FROM node:18-alpine AS builder

# Setze Arbeitsverzeichnis
WORKDIR /app

# Kopiere package.json Dateien
COPY package*.json ./
COPY client/package*.json ./client/

# Installiere Abhängigkeiten
RUN npm ci --only=production
RUN cd client && npm ci --only=production

# Kopiere Quellcode
COPY . .

# Build das Frontend
RUN cd client && npm run build

# Production stage
FROM node:18-alpine

# Setze Arbeitsverzeichnis
WORKDIR /app

# Installiere nur Produktions-Abhängigkeiten
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Kopiere Server-Code und gebautes Frontend
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/build ./client/build

# Erstelle nicht-root Benutzer
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Ändere Besitzer der Dateien
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponiere Port
EXPOSE 5000

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Starte die Anwendung
CMD ["node", "server/index.js"] 