import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ODDS_API_KEY = process.env.ODDS_API_KEY;
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4';

/**
 * Fetch player points prop line from TheOddsAPI
 * Note: The Odds API structure may vary. This is a template implementation.
 */
export async function getPlayerOdds(playerId) {
  if (!ODDS_API_KEY || ODDS_API_KEY === 'your_theoddsapi_key_here') {
    console.warn('ODDS_API_KEY not configured. Returning mock data.');
    // Return mock data for development
    return {
      player: 'Mock Player',
      line: 25.5,
      over_odds: -110,
      under_odds: -110,
      source: 'mock'
    };
  }

  try {
    // The Odds API endpoint for NBA player props
    const response = await axios.get(`${ODDS_API_BASE}/sports/basketball_nba/odds`, {
      params: {
        regions: 'us',
        markets: 'player_points',
        apiKey: ODDS_API_KEY
      }
    });

    // Parse the response to find the player's prop line
    // Note: The actual structure depends on TheOddsAPI response format
    // This is a simplified version - you may need to adjust based on actual API response
    const oddsData = response.data;
    
    // Search for player in the odds data
    // This is a placeholder - actual implementation depends on API response structure
    let playerLine = null;
    
    if (Array.isArray(oddsData)) {
      for (const game of oddsData) {
        if (game.bookmakers) {
          for (const bookmaker of game.bookmakers) {
            if (bookmaker.markets) {
              for (const market of bookmaker.markets) {
                if (market.key === 'player_points' && market.outcomes) {
                  // Try to match player by ID or name
                  // This is simplified - adjust based on actual API structure
                  const playerOutcome = market.outcomes.find(
                    outcome => outcome.description?.toLowerCase().includes(playerId.toString())
                  );
                  
                  if (playerOutcome) {
                    playerLine = {
                      line: parseFloat(playerOutcome.point) || 25.5,
                      over_odds: playerOutcome.over_odds || -110,
                      under_odds: playerOutcome.under_odds || -110,
                      bookmaker: bookmaker.title
                    };
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }

    // If no line found, return default
    if (!playerLine) {
      return {
        player: `Player ${playerId}`,
        line: 25.5,
        over_odds: -110,
        under_odds: -110,
        source: 'default',
        note: 'No odds found for this player. Using default line.'
      };
    }

    return {
      player: `Player ${playerId}`,
      ...playerLine,
      source: 'theoddsapi'
    };
  } catch (error) {
    console.error('Error fetching odds:', error);
    // Return mock data on error
    return {
      player: `Player ${playerId}`,
      line: 25.5,
      over_odds: -110,
      under_odds: -110,
      source: 'mock',
      error: error.message
    };
  }
}

