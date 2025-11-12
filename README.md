# 🏀 HoopForecast

A full-stack web application that predicts NBA player points for upcoming games using linear regression and compares those predictions to sportsbook prop lines.

## Features

- 🔍 Search for any active NBA player
- 📊 Linear regression model for points prediction
- 🎯 Compare predictions vs. sportsbook betting lines
- 📈 Interactive charts showing recent performance and predictions
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js + Express
- **APIs**: 
  - balldontlie API (player stats)
  - The Odds API (betting lines)
- **ML**: ml-regression (linear regression)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- The Odds API key (optional - app works with mock data if not provided)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Edit `.env` and add your The Odds API key:
```
ODDS_API_KEY=your_actual_api_key_here
PORT=5000
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Backend Routes

- `GET /api/health` - Health check
- `GET /api/search?q=playerName` - Search for players
- `GET /api/player/:id/stats` - Get player's last 10 games
- `GET /api/player/:id/prediction` - Get points prediction
- `GET /api/player/:id/odds` - Get betting line
- `GET /api/player/:id/compare` - Get combined comparison data

## How It Works

1. **Player Search**: Users search for NBA players by name
2. **Data Collection**: Backend fetches last 10 games from balldontlie API
3. **Prediction**: Linear regression model analyzes points trend and predicts next game
4. **Odds Fetching**: Backend retrieves betting line from The Odds API
5. **Comparison**: App compares prediction vs. betting line and provides recommendation
6. **Visualization**: Charts show recent performance and prediction point

## Project Structure

```
Project/
├── backend/
│   ├── routes/
│   │   ├── playerRoutes.js
│   │   └── searchRoutes.js
│   ├── services/
│   │   ├── balldontlieService.js
│   │   ├── oddsService.js
│   │   └── predictionService.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── PlayerDetail.jsx
│   │   │   ├── PlayerCard.jsx
│   │   │   ├── PredictionChart.jsx
│   │   │   └── ComparisonBox.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## Notes

- The app uses mock betting data if The Odds API key is not configured
- Linear regression requires at least 3 games of data
- Predictions include confidence scores and error margins
- All predictions are for entertainment purposes only

## Future Enhancements

- Add favorites section using localStorage
- Display regression confidence intervals
- Track model accuracy over time
- Support for other prop bets (assists, rebounds, etc.)
- Historical accuracy metrics

