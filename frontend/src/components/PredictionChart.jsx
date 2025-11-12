import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PredictionChart({ stats, prediction }) {
  if (!stats || stats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Performance</h3>
        <p className="text-gray-500 text-center py-8">No game data available</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = stats.map((game, index) => ({
    game: `Game ${game.game_number}`,
    points: game.points,
    date: game.date?.split('T')[0] || ''
  }));

  // Add prediction point
  if (prediction) {
    chartData.push({
      game: 'Prediction',
      points: prediction,
      date: 'Next Game'
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Points Trend & Prediction
      </h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="game" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Points', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`${value} pts`, 'Points']}
            labelFormatter={(label) => `Game: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="points" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', r: 5 }}
            name="Points Scored"
          />
          {prediction && (
            <Line 
              type="monotone" 
              dataKey="points" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', r: 6 }}
              name="Prediction"
              connectNulls={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600">
        <p>Showing last {stats.length} games with linear regression prediction</p>
      </div>
    </div>
  );
}

export default PredictionChart;

