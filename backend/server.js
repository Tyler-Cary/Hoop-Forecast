import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { playerRoutes } from './routes/playerRoutes.js';
import { searchRoutes } from './routes/searchRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HoopForecast API is running' });
});

// API routes
app.use('/api/player', playerRoutes);
app.use('/api/search', searchRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🏀 HoopForecast API server running on http://localhost:${PORT}`);
});

