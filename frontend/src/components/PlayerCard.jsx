function PlayerCard({ player, comparisonData }) {
  const playerName = `${player.first_name} ${player.last_name}`;
  const displayName = comparisonData?.player || playerName;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{displayName}</h2>
        <p className="text-gray-600 mb-4">
          {player.position} • {player.team?.abbreviation || 'Free Agent'}
        </p>

        {comparisonData && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Predicted Points</p>
                <p className="text-2xl font-bold text-purple-700">
                  {comparisonData.prediction?.toFixed(1) || 'N/A'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Betting Line</p>
                <p className="text-2xl font-bold text-blue-700">
                  {comparisonData.betting_line?.toFixed(1) || 'N/A'}
                </p>
              </div>
            </div>

            {comparisonData.confidence && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Model Confidence</p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{comparisonData.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${comparisonData.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {comparisonData.error_margin && (
              <div className="text-sm text-gray-500 text-center">
                Error Margin: ±{comparisonData.error_margin.toFixed(1)} points
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerCard;

