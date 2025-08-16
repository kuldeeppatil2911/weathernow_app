#!/bin/bash

echo "Starting Weather Application..."
echo ""
echo "1. Installing dependencies..."
npm install

echo ""
echo "2. Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "3. Starting the application..."
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

npm run dev
