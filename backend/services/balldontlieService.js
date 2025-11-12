import axios from 'axios';

const BALLDONTLIE_API = 'https://www.balldontlie.io/api/v1';

/**
 * Search for a player by name
 */
export async function searchPlayer(playerName) {
  try {
    const response = await axios.get(`${BALLDONTLIE_API}/players`, {
      params: {
        search: playerName,
        per_page: 10
      }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error searching player:', error);
    throw new Error('Failed to search for player');
  }
}

/**
 * Get player's last 10 games stats
 */
export async function getPlayerStats(playerId) {
  try {
    // First, get player info
    const playerResponse = await axios.get(`${BALLDONTLIE_API}/players/${playerId}`);
    const player = playerResponse.data;

    // Get current season stats (last 10 games)
    // Note: balldontlie API structure - we'll get stats from the stats endpoint
    const statsResponse = await axios.get(`${BALLDONTLIE_API}/stats`, {
      params: {
        player_ids: [playerId],
        per_page: 10,
        seasons: [2023] // Adjust season as needed
      }
    });

    const stats = statsResponse.data.data || [];
    
    // Format games data
    const games = stats.map((stat, index) => ({
      game_number: index + 1,
      date: stat.game?.date || 'Unknown',
      points: stat.pts || 0,
      minutes: stat.min || '0',
      opponent: stat.game?.visitor_team?.abbreviation || stat.game?.home_team?.abbreviation || 'N/A',
      home: stat.game?.home_team?.id === stat.team?.id
    }));

    return {
      player: {
        id: player.id,
        first_name: player.first_name,
        last_name: player.last_name,
        position: player.position,
        team: player.team?.abbreviation || 'N/A'
      },
      games: games.reverse() // Most recent first
    };
  } catch (error) {
    console.error('Error fetching player stats:', error);
    // Fallback: return mock data structure if API fails
    throw new Error(`Failed to fetch stats for player ${playerId}: ${error.message}`);
  }
}

/**
 * Get all active NBA players
 */
export async function getActivePlayers() {
  try {
    const response = await axios.get(`${BALLDONTLIE_API}/players`, {
      params: {
        per_page: 100
      }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching active players:', error);
    throw new Error('Failed to fetch active players');
  }
}

