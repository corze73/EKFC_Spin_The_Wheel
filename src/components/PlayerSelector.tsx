import React from 'react';
import { Users, X } from 'lucide-react';

interface PlayerSelectorProps {
  players: string[];
  selectedPlayer: string;
  onPlayerSelect: (player: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (player: string) => void;
  isAdmin: boolean;
}

export default function PlayerSelector({ players, selectedPlayer, onPlayerSelect, onAddPlayer, onRemovePlayer, isAdmin }: PlayerSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <label htmlFor="player-select" className="flex items-center space-x-2 text-lg font-medium text-gray-700">
          <Users size={20} />
          <span>Select Player</span>
        </label>
        {isAdmin && (
          <button
            onClick={onAddPlayer}
            className="px-3 py-1 bg-[#2D5A27] text-white text-sm rounded hover:bg-[#1a3318] transition-colors"
          >
            Add Player
          </button>
        )}
      </div>
      
      <select
        id="player-select"
        value={selectedPlayer}
        onChange={(e) => onPlayerSelect(e.target.value)}
        className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-lg focus:border-[#2D5A27] focus:outline-none transition-colors"
      >
        <option value="">Choose a player...</option>
        {players.map((player) => (
          <option key={player} value={player}>
            {player}
          </option>
        ))}
      </select>
      
      {isAdmin && players.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Manage Players:</h3>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {players.map((player) => (
              <div key={player} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{player}</span>
                <button
                  onClick={() => onRemovePlayer(player)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                  title={`Remove ${player}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}