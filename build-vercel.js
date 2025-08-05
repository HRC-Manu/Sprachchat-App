const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Talk2me Vercel Build...');

try {
  // Install client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });

  // Build client
  console.log('🔨 Building client...');
  execSync('cd client && npm run build', { stdio: 'inherit' });

  console.log('✅ Build completed!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 