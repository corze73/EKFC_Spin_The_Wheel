import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (name: string) => void;
}

export default function AddPlayerModal({ isOpen, onClose, onAddPlayer }: AddPlayerModalProps) {
  const [playerName, setPlayerName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <UserPlus size={24} />
            <span>Add New Player</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-[#2D5A27] focus:outline-none"
            autoFocus
          />
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!playerName.trim()}
              className="flex-1 px-4 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#1a3318] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}