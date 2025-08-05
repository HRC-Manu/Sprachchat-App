const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  console.log('🔍 Debug API called');
  
  try {
    // Aktuelles Verzeichnis
    const cwd = process.cwd();
    console.log('📁 Current working directory:', cwd);
    
    // Verzeichnis-Inhalt
    const rootFiles = fs.readdirSync(cwd);
    console.log('📂 Root files:', rootFiles);
    
    // Client-Verzeichnis
    const clientPath = path.join(cwd, 'client');
    const clientExists = fs.existsSync(clientPath);
    console.log('📁 Client directory exists:', clientExists);
    
    if (clientExists) {
      const clientFiles = fs.readdirSync(clientPath);
      console.log('📂 Client files:', clientFiles);
      
      // Build-Verzeichnis
      const buildPath = path.join(clientPath, 'build');
      const buildExists = fs.existsSync(buildPath);
      console.log('📁 Build directory exists:', buildExists);
      
      if (buildExists) {
        const buildFiles = fs.readdirSync(buildPath);
        console.log('📂 Build files:', buildFiles);
        
        // index.html existiert?
        const indexPath = path.join(buildPath, 'index.html');
        const indexExists = fs.existsSync(indexPath);
        console.log('📄 index.html exists:', indexExists);
      }
    }
    
    // Vercel-Umgebungsvariablen
    console.log('🌍 VERCEL_ENV:', process.env.VERCEL_ENV);
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    
    res.json({
      success: true,
      debug: {
        cwd,
        rootFiles,
        clientExists,
        buildExists: clientExists ? fs.existsSync(path.join(clientPath, 'build')) : false,
        indexExists: clientExists ? fs.existsSync(path.join(clientPath, 'build', 'index.html')) : false,
        env: {
          VERCEL_ENV: process.env.VERCEL_ENV,
          NODE_ENV: process.env.NODE_ENV
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}; 