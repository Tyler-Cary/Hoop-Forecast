# 🚀 Quick Start Guide

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your ODDS_API_KEY (optional - app works without it)
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## First Run

1. Open `http://localhost:3000` in your browser
2. Search for a player (e.g., "LeBron James", "Stephen Curry")
3. Click on a player to see their prediction and betting comparison

## API Key Setup (Optional)

The app works with mock betting data if you don't have a The Odds API key. To use real betting data:

1. Sign up at https://the-odds-api.com/
2. Get your API key
3. Add it to `backend/.env`:
   ```
   ODDS_API_KEY=your_actual_key_here
   ```

## Troubleshooting

- **Backend won't start**: Make sure port 5000 is available
- **Frontend won't start**: Make sure port 3000 is available
- **No player results**: Check that balldontlie API is accessible
- **No betting lines**: App will use mock data if The Odds API key is missing

