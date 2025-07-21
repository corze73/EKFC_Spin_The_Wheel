import React, { useState, useEffect } from 'react';
import SpinWheel from './components/SpinWheel';
import PlayerSelector from './components/PlayerSelector';
import AddPlayerModal from './components/AddPlayerModal';
import ResultsHistory from './components/ResultsHistory';
import LoginForm from './components/LoginForm';
import { LogOut } from 'lucide-react';

interface Result {
  id: string;
  player: string;
  result: string;
  timestamp: Date;
}

function App() {
  const [players, setPlayers] = useState<string[]>([
    'John Smith', 'Mike Johnson', 'David Wilson', 'Chris Brown', 'Tom Davis'
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Load saved data from localStorage
    const savedPlayers = localStorage.getItem('football-wheel-players');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }

    const savedResults = localStorage.getItem('football-wheel-results');
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      setResults(parsedResults.map((r: any) => ({
        ...r,
        timestamp: new Date(r.timestamp)
      })));
    }

    const savedSoundEnabled = localStorage.getItem('football-wheel-sound');
    if (savedSoundEnabled) {
      setSoundEnabled(JSON.parse(savedSoundEnabled));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('football-wheel-players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('football-wheel-results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('football-wheel-sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleLogin = (adminStatus: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setSelectedPlayer('');
  };

  const handleAddPlayer = (name: string) => {
    if (!players.includes(name)) {
      setPlayers([...players, name]);
    }
  };

  const handleRemovePlayer = (name: string) => {
    setPlayers(players.filter(player => player !== name));
    // If the removed player was selected, clear the selection
    if (selectedPlayer === name) {
      setSelectedPlayer('');
    }
  };
  const handleSpinComplete = (result: string) => {
    const newResult: Result = {
      id: Date.now().toString(),
      player: selectedPlayer,
      result: result.replace(`${selectedPlayer}: `, ''),
      timestamp: new Date()
    };
    setResults([...results, newResult]);
  };

  const handleClearHistory = () => {
    setResults([]);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/Screenshot 2025-01-23 at 07.38.49.png" 
                alt="E&KFC Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#2D5A27]">E&KFC</h1>
                <span className="text-sm text-gray-500">
                  {isAdmin ? 'Admin Mode' : 'User Mode'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-xl text-gray-600 mb-1">Spin the Wheel</h2>
            <p className="text-sm text-gray-500">Alternative to player fines - let fate decide!</p>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-lg mx-auto space-y-8">
          {/* Player Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <PlayerSelector
              players={players}
              selectedPlayer={selectedPlayer}
              onPlayerSelect={setSelectedPlayer}
              onAddPlayer={() => setIsAddPlayerModalOpen(true)}
              onRemovePlayer={handleRemovePlayer}
              isAdmin={isAdmin}
            />
          </div>

          {/* Spin Wheel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <SpinWheel
              selectedPlayer={selectedPlayer}
              onSpinComplete={handleSpinComplete}
              soundEnabled={soundEnabled}
              onSoundToggle={handleSoundToggle}
            />
          </div>

          {/* Results History */}
          <ResultsHistory
            results={results}
            onClearHistory={handleClearHistory}
          />
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>Install this app on your phone for the best experience!</p>
        </footer>
      </div>

      {/* Add Player Modal */}
      {isAdmin && (
        <AddPlayerModal
          isOpen={isAddPlayerModalOpen}
          onClose={() => setIsAddPlayerModalOpen(false)}
          onAddPlayer={handleAddPlayer}
        />
      )}
    </div>
  );
}

export default App;