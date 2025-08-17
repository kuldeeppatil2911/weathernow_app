# 🚀 Quick Render Deployment Checklist

## ⚡ 5-Minute Setup

### 1. Get API Key
- [ ] Sign up at [OpenWeatherMap](https://openweathermap.org/api)
- [ ] Copy your API key

### 2. Push to GitHub
```bash
# Run the deployment script
./deploy-to-render.bat    # Windows
./deploy-to-render.sh     # Mac/Linux

# Or manually:
git add .
git commit -m "Deploy to Render"
git push origin main
```

### 3. Deploy on Render
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Connect your repository
- [ ] Set these values:
  - **Build Command**: `npm run render-postbuild`
  - **Start Command**: `npm start`
- [ ] Add environment variables:
  - `NODE_ENV` = `production`
  - `OPENWEATHER_API_KEY` = `your_actual_api_key`
- [ ] Click "Create Web Service"

### 4. Wait & Test
- [ ] Build completes (5-10 minutes)
- [ ] Test your app URL
- [ ] Verify weather search works

## 🔗 Your App Will Be Live At:
`https://your-app-name.onrender.com`

## 📚 Full Guide
See `DEPLOYMENT.md` for detailed instructions.

---
**🎯 That's it! Your weather app will be live on the internet!**
