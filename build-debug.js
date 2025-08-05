const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Build Debug Script Starting...');
console.log('📁 Current directory:', process.cwd());

try {
  // 1. Root-Verzeichnis überprüfen
  console.log('\n📂 Root directory contents:');
  const rootFiles = fs.readdirSync('.');
  console.log(rootFiles);

  // 2. Client-Verzeichnis überprüfen
  console.log('\n📁 Client directory:');
  const clientPath = path.join('.', 'client');
  if (fs.existsSync(clientPath)) {
    const clientFiles = fs.readdirSync(clientPath);
    console.log('Client files:', clientFiles);
    
    // 3. package.json überprüfen
    const packagePath = path.join(clientPath, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      console.log('Client package.json scripts:', packageJson.scripts);
    }
  } else {
    console.log('❌ Client directory not found!');
  }

  // 4. Build-Prozess starten
  console.log('\n🔨 Starting build process...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  console.log('✅ npm install completed');
  
  execSync('cd client && npm run build', { stdio: 'inherit' });
  console.log('✅ npm run build completed');

  // 5. Build-Ergebnis überprüfen
  console.log('\n📁 Build result:');
  const buildPath = path.join(clientPath, 'build');
  if (fs.existsSync(buildPath)) {
    const buildFiles = fs.readdirSync(buildPath);
    console.log('Build files:', buildFiles);
    
    // index.html überprüfen
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✅ index.html exists');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      console.log('index.html size:', indexContent.length, 'characters');
    } else {
      console.log('❌ index.html not found!');
    }
  } else {
    console.log('❌ Build directory not found!');
  }

  console.log('\n🎉 Build debug completed successfully!');

} catch (error) {
  console.error('❌ Build debug failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
} 