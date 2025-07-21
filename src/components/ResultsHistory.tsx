import React from 'react';
import { History, RotateCcw } from 'lucide-react';
import { SpinResult } from '../types/database';

interface ResultsHistoryProps {
  results: SpinResult[];
  onClearHistory: () => void;
}

export default function ResultsHistory({ results, onClearHistory }: ResultsHistoryProps) {
  if (results.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center space-x-2">
          <History size={20} />
          <span>Recent Results</span>
        </h3>
        <button
          onClick={onClearHistory}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear history"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {results.slice(-5).reverse().map((result) => (
          <div key={result.id} className="p-2 bg-gray-50 rounded border">
            <div className="text-sm font-medium">{result.player_name}</div>
            <div className="text-xs text-gray-600">{result.result}</div>
            <div className="text-xs text-gray-400">
              {new Date(result.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}