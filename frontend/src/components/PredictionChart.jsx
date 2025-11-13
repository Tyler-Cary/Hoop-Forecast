import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

function PredictionChart({ stats, prediction }) {
  if (!stats || stats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Performance</h3>
        <p className="text-gray-500 text-center py-8">No game data available</p>
      </div>
    );
  }

  // Prepare chart data - stats come with Game 1 = most recent, Game 10 = oldest
  // We want to display most recent on the right, so we reverse the order
  const sortedStats = [...stats].sort((a, b) => (a.game_number || 0) - (b.game_number || 0));
  // Reverse so most recent (Game 1) is on the right
  const reversedStats = sortedStats.reverse();
  
  const chartData = reversedStats.map((game, index) => {
    // Use opponent abbreviation, or fallback
    const opponent = game.opponent && game.opponent !== 'N/A' ? game.opponent : `G${game.game_number || index + 1}`;
    const points = typeof game.points === 'number' ? game.points : parseFloat(game.points) || 0;
    
    // Determine bar color based on prediction
    let barColor = '#6b7280'; // Default gray
    if (prediction != null) {
      barColor = points >= prediction ? '#10b981' : '#ef4444'; // Green if over, red if under
    }
    
    return {
      name: opponent, // This will be the X-axis label
      gameNumber: game.game_number || index + 1,
      points: points,
      date: game.date?.split('T')[0] || '',
      opponent: game.opponent || 'N/A',
      fullLabel: `${opponent} (${game.points} pts)`,
      color: barColor
    };
  });

  // Calculate Y-axis domain with padding, rounded to multiples of 5
  const allPoints = chartData.map(d => d.points);
  if (prediction != null) {
    allPoints.push(prediction);
  }
  const rawMin = Math.min(...allPoints);
  const rawMax = Math.max(...allPoints);
  
  // Round min down to nearest multiple of 5, but not below 0
  const minPoints = Math.max(0, Math.floor((rawMin - 5) / 5) * 5);
  // Round max up to nearest multiple of 5
  const maxPoints = Math.ceil((rawMax + 5) / 5) * 5;
  
  // Generate Y-axis ticks in multiples of 5, but only show relevant ones
  const tickInterval = Math.ceil((maxPoints - minPoints) / 8); // Aim for ~8 ticks
  const roundedInterval = Math.ceil(tickInterval / 5) * 5; // Round to nearest multiple of 5
  const yAxisTicks = [];
  for (let i = minPoints; i <= maxPoints; i += roundedInterval) {
    yAxisTicks.push(i);
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        Points Trend & Prediction
      </h3>
      <p className="text-sm text-gray-500 mb-6">Performance vs. Predicted Points</p>
      
      <ResponsiveContainer width="100%" height={500}>
        <BarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
          barCategoryGap="15%"
        >
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
            </linearGradient>
            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9}/>
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            stroke="#9ca3af"
            tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            domain={[minPoints, maxPoints]}
            label={{ value: 'Points', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#374151', fontSize: 13, fontWeight: 700 } }}
            stroke="#6b7280"
            strokeWidth={2}
            tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }}
            tickLine={{ stroke: '#6b7280', strokeWidth: 1.5 }}
            width={50}
            ticks={yAxisTicks}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontSize: '13px'
            }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            formatter={(value, name, props) => {
              if (name === 'Prediction') {
                return [`${value.toFixed(1)} pts (Predicted)`, 'Prediction'];
              }
              const opponent = props.payload.opponent || 'N/A';
              const status = prediction != null && value >= prediction ? 'Over' : 'Under';
              const statusColor = prediction != null && value >= prediction ? '#10b981' : '#ef4444';
              return [
                <span key="value">
                  <span style={{ fontWeight: 600 }}>{value}</span> pts vs {opponent} 
                  <span style={{ color: statusColor, fontWeight: 600, marginLeft: '6px' }}>({status})</span>
                </span>, 
                'Points Scored'
              ];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                const date = payload[0].payload.date;
                return <span style={{ fontWeight: 600, fontSize: '14px' }}>{date ? `${label} - ${date}` : label}</span>;
              }
              return label;
            }}
          />
          
          {/* Historical games bars */}
          <Bar 
            dataKey="points" 
            name="Points Scored"
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color === '#10b981' ? 'url(#greenGradient)' : entry.color === '#ef4444' ? 'url(#redGradient)' : entry.color}
                stroke={entry.color}
                strokeWidth={1.5}
              />
            ))}
          </Bar>
          
          {/* Prediction reference line - purple dotted line */}
          {prediction != null && (
            <ReferenceLine 
              y={prediction} 
              stroke="#a855f7" 
              strokeWidth={2.5}
              strokeDasharray="8 4"
              label={{ 
                value: `Predicted: ${prediction.toFixed(1)} pts`, 
                position: "top", 
                offset: 10,
                fill: '#7c3aed', 
                fontSize: 13,
                fontWeight: 'bold',
                backgroundColor: '#fff',
                padding: '5px 10px',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                border: '2px solid #a855f7'
              }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-sm">
        <p className="text-gray-500 font-medium">
          Showing last {stats.length} games with prediction comparison
        </p>
        {prediction != null && (
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded shadow-sm"></div>
              <span className="text-gray-700 font-medium">Over Prediction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded shadow-sm"></div>
              <span className="text-gray-700 font-medium">Under Prediction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-purple-500 border-dashed border-2 border-purple-500"></div>
              <span className="text-gray-700 font-medium">Predicted: <span className="font-bold text-purple-600">{prediction.toFixed(1)} pts</span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionChart;

