import express from 'express';
import { getPlayerStatsFromNBA } from '../services/nbaApiService.js';
import { getPlayerOdds } from '../services/oddsService.js';
import { predictPointsFromGames } from '../services/predictionService.js';

const router = express.Router();

/**
 * GET /api/player/:id/stats
 * Fetch last 10 games for a player
 * Requires player name as query parameter
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const playerName = req.query.name;
    if (!playerName) {
      return res.status(400).json({ error: 'Player name (name query parameter) is required' });
    }
    const stats = await getPlayerStatsFromNBA(playerName);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch player stats' });
  }
});

/**
 * GET /api/player/:id/prediction
 * Compute prediction from player stats
 * Requires player name as query parameter
 */
router.get('/:id/prediction', async (req, res) => {
  try {
    const playerName = req.query.name;
    if (!playerName) {
      return res.status(400).json({ error: 'Player name (name query parameter) is required' });
    }
    const stats = await getPlayerStatsFromNBA(playerName);
    if (!stats.games || stats.games.length < 3) {
      return res.status(400).json({ error: `Insufficient game data. Need at least 3 games, got ${stats.games?.length || 0}` });
    }
    const prediction = await predictPointsFromGames(stats.games, playerName);
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
 * Requires player name as query parameter
 */
router.get('/:id/compare', async (req, res) => {
  try {
    const playerName = req.query.name;
    if (!playerName) {
      return res.status(400).json({ error: 'Player name (name query parameter) is required' });
    }
    
    console.log(`Fetching compare data for player: ${playerName}`);
    
    // Fetch stats from NBA.com
    const stats = await getPlayerStatsFromNBA(playerName);
    
    // Generate prediction from stats
    if (!stats.games || stats.games.length < 3) {
      throw new Error(`Insufficient game data for prediction. Need at least 3 games, got ${stats.games?.length || 0}.`);
    }
    
    const prediction = await predictPointsFromGames(stats.games, playerName);
    
    // Extract player name from stats
    const finalPlayerName = `${stats.player.first_name} ${stats.player.last_name}`.trim() || playerName;
    console.log(`📝 Using player name: ${finalPlayerName}`);
    
    // OPTIMIZATION: Fetch odds in parallel with next game (non-blocking)
    // Start both requests simultaneously
    const [oddsResult, nextGameResult] = await Promise.allSettled([
      (async () => {
        try {
          const odds = await getPlayerOdds(null, finalPlayerName);
          if (!odds || !odds.line) {
            throw new Error('API returned no line for player');
          }
          console.log(`✅ Got odds from API: ${odds.line} for ${finalPlayerName}`);
          return odds;
        } catch (oddsError) {
          console.error('❌ Failed to get odds from API:', oddsError.message);
          throw oddsError;
        }
      })(),
      // Next game fetch (non-blocking, won't fail the request)
      (async () => {
        try {
          const { getNextGame, searchPlayer } = await import('../services/nbaApiService.js');
          
          // Get team abbreviation from stats
          let teamAbbrev = null;
          
          if (stats?.player) {
            if (typeof stats.player === 'object') {
              teamAbbrev = stats.player.team || stats.player.team?.abbreviation || null;
            }
          }
          
          // Fallback to prediction
          if (!teamAbbrev && prediction?.player_team) {
            teamAbbrev = prediction.player_team;
          }
          
          console.log(`🔍 Next game lookup - teamAbbrev: ${teamAbbrev}, playerName: ${playerName}`);
          
          // If we have a team abbreviation, use ESPN API directly (doesn't need player ID)
          if (teamAbbrev && teamAbbrev !== 'N/A') {
            const nextGame = await getNextGame(null, teamAbbrev);
            if (nextGame) {
              console.log(`✅ Next game found via ESPN: ${teamAbbrev} vs ${nextGame.opponent} on ${nextGame.date}`);
            } else {
              console.log(`⚠️ No next game found for ${teamAbbrev}`);
            }
            return nextGame;
          }
          
          // Fallback: Try to search for player and get team from NBA.com
          if (playerName && playerName !== 'Player 115' && playerName !== 'Unknown') {
            try {
              const nbaPlayer = await searchPlayer(playerName);
              if (nbaPlayer && nbaPlayer.id && nbaPlayer.team) {
                console.log(`✅ Found NBA player: ${nbaPlayer.name} (ID: ${nbaPlayer.id}, Team: ${nbaPlayer.team})`);
                const finalTeamAbbrev = nbaPlayer.team && nbaPlayer.team !== 'N/A' ? nbaPlayer.team : null;
                if (finalTeamAbbrev) {
                  const nextGame = await getNextGame(nbaPlayer.id, finalTeamAbbrev);
                  if (nextGame) {
                    console.log(`✅ Next game found: ${finalTeamAbbrev} vs ${nextGame.opponent} on ${nextGame.date}`);
                  }
                  return nextGame;
                }
              }
            } catch (searchError) {
              console.log(`⚠️ Could not search NBA player: ${searchError.message}`);
            }
          }
          
          console.log(`⚠️ Missing data for next game: teamAbbrev=${teamAbbrev}, playerName=${playerName}`);
          return null;
        } catch (nextGameError) {
          console.log('Could not fetch next game info:', nextGameError.message);
          console.log('Stack:', nextGameError.stack);
          return null;
        }
      })()
    ]);
    
    // Check if odds failed
    if (oddsResult.status === 'rejected') {
      throw new Error(`Failed to fetch betting odds: ${oddsResult.reason?.message || oddsResult.reason}`);
    }
    
    const odds = oddsResult.value;
    const nextGame = nextGameResult.status === 'fulfilled' ? nextGameResult.value : null;

    console.log('Stats:', stats ? 'OK' : 'Failed');
    console.log('Prediction:', prediction ? 'OK' : 'Failed');
    console.log('Odds:', odds ? 'OK' : 'Failed');

    // Use the playerName we already extracted, or fallback
    if (!playerName) {
      playerName = 'Unknown';
      if (stats?.player) {
        playerName = typeof stats.player === 'string' 
          ? stats.player 
          : `${stats.player.first_name || ''} ${stats.player.last_name || ''}`.trim();
      } else if (prediction?.player) {
        playerName = prediction.player;
      } else if (odds?.player) {
        playerName = odds.player;
      }
    }

    // Determine recommendation
    let recommendation = 'N/A';
    const predictedPoints = prediction?.predicted_points || prediction?.predictedPoints || null;
    const bettingLine = odds?.line || null;
    
    if (predictedPoints !== null && bettingLine !== null) {
      if (predictedPoints > bettingLine) {
        recommendation = 'OVER';
      } else if (predictedPoints < bettingLine) {
        recommendation = 'UNDER';
      } else {
        recommendation = 'PUSH';
      }
    }

    // Get team logos
    const { getTeamLogo, getTeamName } = await import('../services/teamLogoService.js');
    
    const opponentTeam = nextGame?.opponent || null;
    
    // Get player team from stats
    let finalPlayerTeam = null;
    if (stats?.player) {
      if (typeof stats.player === 'object') {
        finalPlayerTeam = stats.player.team || stats.player.team?.abbreviation || null;
      }
    }
    // Fallback to prediction
    if (!finalPlayerTeam && prediction?.player_team) {
      finalPlayerTeam = prediction.player_team;
    }
    
    const response = {
      player: finalPlayerName,
      stats: stats?.games || stats?.stats || [],
      prediction: predictedPoints,
      betting_line: bettingLine,
      recommendation,
      confidence: prediction?.confidence || null,
      error_margin: prediction?.error_margin || prediction?.errorMargin || null,
      next_game: nextGame ? {
        ...nextGame,
        opponent_logo: getTeamLogo(opponentTeam),
        opponent_name: getTeamName(opponentTeam)
      } : null,
      player_team: finalPlayerTeam,
      player_team_logo: getTeamLogo(finalPlayerTeam),
      player_team_name: getTeamName(finalPlayerTeam),
      odds_source: odds?.source || 'unknown',
      odds_bookmaker: odds?.bookmaker || null,
      player_image: stats?.player?.nba_id 
        ? `https://cdn.nba.com/headshots/nba/latest/260x190/${stats.player.nba_id}.png` 
        : (stats?.player?.id 
          ? `https://cdn.nba.com/headshots/nba/latest/260x190/${stats.player.id}.png` 
          : null)
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (error) {
    console.error('Error in compare endpoint:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Failed to compare prediction and odds',
      player: 'Unknown',
      stats: [],
      prediction: null,
      betting_line: null,
      recommendation: 'N/A'
    });
  }
});

export { router as playerRoutes };


