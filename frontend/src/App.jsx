import { useState } from 'react';
import Home from './components/Home';
import PlayerDetail from './components/PlayerDetail';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">🏀 HoopForecast</h1>
          <p className="text-center text-gray-300 mt-2">
            NBA Points Prediction & Betting Comparison
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedPlayer ? (
          <PlayerDetail 
            player={selectedPlayer} 
            onBack={() => setSelectedPlayer(null)} 
          />
        ) : (
          <Home onSelectPlayer={setSelectedPlayer} />
        )}
      </main>

      <footer className="bg-gray-900 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>Powered by balldontlie API & The Odds API</p>
          <p className="mt-1">For entertainment purposes only</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

