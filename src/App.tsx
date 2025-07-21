import React, { useState, useEffect } from 'react';
import SpinWheel from './components/SpinWheel';
import PlayerSelector from './components/PlayerSelector';
import AddPlayerModal from './components/AddPlayerModal';
import ResultsHistory from './components/ResultsHistory';
import LoginForm from './components/LoginForm';
import { useDatabase } from './hooks/useDatabase';
import { LogOut } from 'lucide-react';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { 
    players, 
    results, 
    loading, 
    addPlayer, 
    removePlayer, 
    addResult, 
    clearResults 
  } = useDatabase();

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

    const savedSoundEnabled = localStorage.getItem('football-wheel-sound');
    if (savedSoundEnabled) {
      setSoundEnabled(JSON.parse(savedSoundEnabled));
    }
  }, []);

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

  const handleAddPlayer = async (name: string) => {
    if (!players.find(p => p.name === name)) {
      const success = await addPlayer(name);
      if (success) {
        setIsAddPlayerModalOpen(false);
      }
    }
  };

  const handleRemovePlayer = async (playerId: string, playerName: string) => {
    const success = await removePlayer(playerId);
    if (success) {
      // If the removed player was selected, clear the selection
      if (selectedPlayer === playerName) {
        setSelectedPlayer('');
      }
    }
  };

  const handleSpinComplete = async (result: string) => {
    const cleanResult = result.replace(`${selectedPlayer}: `, '');
    await addResult(selectedPlayer, cleanResult);
  };

  const handleClearHistory = async () => {
    await clearResults();
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#2D5A27] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
            E&K
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
              <div className="w-12 h-12 bg-[#2D5A27] rounded-full flex items-center justify-center text-white font-bold text-lg">
                E&K
              </div>
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