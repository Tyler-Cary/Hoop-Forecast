import { useState } from 'react';
import Home from './components/Home';
import PlayerDetail from './components/PlayerDetail';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white py-8 shadow-2xl relative overflow-hidden">
        {/* Modern decorative border at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-extrabold text-center tracking-tight text-white drop-shadow-lg">
            ⛈️🏀 HoopForecast
          </h1>
          <p className="text-center text-gray-300 mt-3 text-lg font-light">
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

      <footer className="bg-gray-900 text-white py-6 mt-12 relative overflow-hidden">
        {/* Modern decorative border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
        
        <div className="container mx-auto px-4 text-center text-sm text-gray-400 relative z-10">
          <p>Powered by ESPN API, NBA.com API & SportsGameOdds API</p>
          <p className="mt-1">For entertainment purposes only</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

