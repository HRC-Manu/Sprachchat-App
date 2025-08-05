#!/bin/bash

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
npm run build
cd ..

echo "Build completed successfully!" 