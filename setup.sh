#!/bin/bash

# Setup script for Classic Local Shop

echo "======================================"
echo "Classic Local Shop - Setup Script"
echo "======================================"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed."
    echo "Please install MongoDB first:"
    echo "  Ubuntu/Debian: sudo apt install mongodb"
    echo "  macOS: brew install mongodb-community"
    echo ""
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -f mongod > /dev/null; then
    echo "⚠️  MongoDB is not running."
    echo "Starting MongoDB..."
    sudo systemctl start mongod || mongod --dbpath ~/data/db &
    sleep 2
fi

# Check MongoDB status
if pgrep -f mongod > /dev/null; then
    echo "✓ MongoDB is running"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "✓ Setup complete!"
echo ""
echo "======================================"
echo "Quick Start Commands:"
echo "======================================"
echo ""
echo "Development (runs React + Server):"
echo "  npm run dev"
echo ""
echo "Or run them separately:"
echo "  npm run server    # Backend on port 3001"
echo "  npm start         # React on port 3000"
echo ""
echo "Production:"
echo "  npm run build     # Build React app"
echo "  npm run server    # Serve production build"
echo ""
echo "======================================"
