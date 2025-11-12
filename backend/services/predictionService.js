import { LinearRegression } from 'ml-regression';
import { getPlayerStats } from './balldontlieService.js';

/**
 * Predict next game points using linear regression
 * Uses the player's last 10 games to build a regression model
 */
export async function predictPoints(playerId) {
  try {
    // Fetch player stats
    const statsData = await getPlayerStats(playerId);
    const games = statsData.games;
    const player = statsData.player;

    if (!games || games.length < 3) {
      throw new Error('Insufficient game data for prediction. Need at least 3 games.');
    }

    // Prepare data for regression
    // X: game number (1, 2, 3, ...)
    // Y: points scored in that game
    const gameNumbers = games.map((game, index) => index + 1);
    const playerPoints = games.map(game => game.points);

    // Calculate mean for confidence calculation
    const meanPoints = playerPoints.reduce((a, b) => a + b, 0) / playerPoints.length;
    const variance = playerPoints.reduce((sum, pts) => sum + Math.pow(pts - meanPoints, 2), 0) / playerPoints.length;
    const stdDev = Math.sqrt(variance);

    // Create linear regression model
    const regression = new LinearRegression(gameNumbers, playerPoints);

    // Predict next game (game number = games.length + 1)
    const nextGameNumber = games.length + 1;
    const predictedPoints = regression.predict(nextGameNumber);

    // Calculate confidence based on:
    // 1. Number of data points (more = better)
    // 2. Standard deviation (lower = better)
    // 3. R-squared (model fit)
    const rSquared = calculateRSquared(gameNumbers, playerPoints, regression);
    const confidence = Math.min(100, Math.max(0, 
      (games.length / 10) * 50 + // Up to 50% for data points
      (1 - Math.min(stdDev / meanPoints, 1)) * 30 + // Up to 30% for consistency
      rSquared * 20 // Up to 20% for model fit
    ));

    // Error margin: 1 standard deviation
    const errorMargin = stdDev;

    return {
      player: `${player.first_name} ${player.last_name}`,
      predicted_points: Math.round(predictedPoints * 10) / 10, // Round to 1 decimal
      confidence: Math.round(confidence * 10) / 10,
      error_margin: Math.round(errorMargin * 10) / 10,
      games_used: games.length,
      regression_stats: {
        slope: regression.slope,
        intercept: regression.intercept,
        r_squared: rSquared
      }
    };
  } catch (error) {
    console.error('Error in prediction service:', error);
    throw new Error(`Failed to generate prediction: ${error.message}`);
  }
}

/**
 * Calculate R-squared (coefficient of determination)
 * Measures how well the regression line fits the data
 */
function calculateRSquared(x, y, regression) {
  const yMean = y.reduce((a, b) => a + b, 0) / y.length;
  
  let totalSumSquares = 0; // Total variation
  let residualSumSquares = 0; // Unexplained variation
  
  for (let i = 0; i < x.length; i++) {
    const predicted = regression.predict(x[i]);
    totalSumSquares += Math.pow(y[i] - yMean, 2);
    residualSumSquares += Math.pow(y[i] - predicted, 2);
  }
  
  // R² = 1 - (RSS / TSS)
  const rSquared = 1 - (residualSumSquares / totalSumSquares);
  return Math.max(0, Math.min(1, rSquared)); // Clamp between 0 and 1
}

