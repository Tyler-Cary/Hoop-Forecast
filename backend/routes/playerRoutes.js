import express from 'express';
import { getPlayerStats } from '../services/balldontlieService.js';
import { getPlayerOdds } from '../services/oddsService.js';
import { predictPoints } from '../services/predictionService.js';

const router = express.Router();

/**
 * GET /api/player/:id/stats
 * Fetch last 10 games for a player
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const playerId = req.params.id;
    const stats = await getPlayerStats(playerId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch player stats' });
  }
});

/**
 * GET /api/player/:id/prediction
 * Compute linear regression and return prediction
 */
router.get('/:id/prediction', async (req, res) => {
  try {
    const playerId = req.params.id;
    const prediction = await predictPoints(playerId);
    res.json(prediction);
  } catch (error) {
    console.error('Error generating prediction:', error);
    res.status(500).json({ error: error.message || 'Failed to generate prediction' });
  }
});

/**
 * GET /api/player/:id/odds
 * Fetch player prop line from TheOddsAPI
 */
router.get('/:id/odds', async (req, res) => {
  try {
    const playerId = req.params.id;
    const odds = await getPlayerOdds(playerId);
    res.json(odds);
  } catch (error) {
    console.error('Error fetching odds:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch odds' });
  }
});

/**
 * GET /api/player/:id/compare
 * Return combined object with stats, prediction, odds, and recommendation
 */
router.get('/:id/compare', async (req, res) => {
  try {
    const playerId = req.params.id;
    
    // Fetch all data in parallel
    const [stats, prediction, odds] = await Promise.all([
      getPlayerStats(playerId).catch(() => null),
      predictPoints(playerId).catch(() => null),
      getPlayerOdds(playerId).catch(() => null)
    ]);

    // Determine recommendation
    let recommendation = 'N/A';
    if (prediction && odds && odds.line) {
      if (prediction.predicted_points > odds.line) {
        recommendation = 'OVER';
      } else if (prediction.predicted_points < odds.line) {
        recommendation = 'UNDER';
      } else {
        recommendation = 'PUSH';
      }
    }

    res.json({
      player: stats?.player || prediction?.player || odds?.player || 'Unknown',
      stats: stats?.games || [],
      prediction: prediction?.predicted_points || null,
      betting_line: odds?.line || null,
      recommendation,
      confidence: prediction?.confidence || null,
      error_margin: prediction?.error_margin || null
    });
  } catch (error) {
    console.error('Error in compare endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to compare prediction and odds' });
  }
});

export { router as playerRoutes };

