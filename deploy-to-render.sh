#!/bin/bash

echo "========================================"
echo "    WeatherNow - Render Deployment"
echo "========================================"
echo ""
echo "This script will help you prepare your app for Render deployment"
echo ""

echo "1. Checking if git is initialized..."
if [ ! -d ".git" ]; then
    echo "Git not initialized. Initializing now..."
    git init
    echo "Git initialized successfully!"
else
    echo "Git already initialized."
fi

echo ""
echo "2. Adding all files to git..."
git add .

echo ""
echo "3. Committing changes..."
git commit -m "Prepare for Render deployment"

echo ""
echo "4. Checking remote origin..."
if git remote -v | grep -q "origin"; then
    echo "Remote origin found."
    echo ""
    echo "5. Pushing to GitHub..."
    git push -u origin main
else
    echo "No remote origin found."
    echo "Please add your GitHub repository as origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo ""
    echo "Then run: git push -u origin main"
fi

echo ""
echo "========================================"
echo "    Next Steps for Render Deployment:"
echo "========================================"
echo ""
echo "1. Go to https://render.com and sign up"
echo "2. Create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Set environment variables:"
echo "   - NODE_ENV: production"
echo "   - OPENWEATHER_API_KEY: your_api_key_here"
echo "5. Build Command: npm run render-postbuild"
echo "6. Start Command: npm start"
echo "7. Deploy!"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
echo ""
read -p "Press Enter to continue..."
