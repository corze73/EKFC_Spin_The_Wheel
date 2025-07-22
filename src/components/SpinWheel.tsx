import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SpinWheelProps {
  selectedPlayer: string;
  onSpinComplete: (result: string) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

const wheelOptions = [
  { text: 'Wear bibs tucked into shorts', color: '#ef4444', weight: 6 },
  { text: 'Sing a song of team\'s choice', color: '#dc2626', weight: 6 },
  { text: 'Speech: Why I\'m the best player', color: '#b91c1c', weight: 6 },
  { text: '50 burpees after training', color: '#991b1b', weight: 6 },
  { text: 'Read 3 Google searches aloud', color: '#f97316', weight: 6 },
  { text: 'Bring snacks next session', color: '#eab308', weight: 6 },
  { text: 'Clean all bibs after training', color: '#84cc16', weight: 6 },
  { text: 'Say Yes coach before every sentence', color: '#22c55e', weight: 6 },
  { text: 'Take warm-up next game', color: '#10b981', weight: 6 },
  { text: 'Make tea or coffee for coaches', color: '#06b6d4', weight: 6 },
  { text: '3 pitch laps before kick-off', color: '#3b82f6', weight: 6 },
  { text: 'Call parent on speaker', color: '#6366f1', weight: 6 },
  { text: 'Do a teammate impression', color: '#8b5cf6', weight: 6 },
  { text: 'Wear shirt backwards', color: '#a855f7', weight: 6 },
  { text: 'Embarrassing selfie in group chat', color: '#d946ef', weight: 6 },
  { text: 'Bring Lucozade for the team', color: '#ec4899', weight: 6 },
  { text: 'Wear Sondico boots for 15 mins', color: '#f43f5e', weight: 6 },
  { text: 'Unlucky! Pay double fine', color: '#7c2d12', weight: 2 }
];

export default function SpinWheel({ selectedPlayer, onSpinComplete, soundEnabled, onSoundToggle }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const sectorHeight = 80;
  const totalHeight = wheelOptions.length * sectorHeight;

  const spinWheel = () => {
    if (isSpinning || !selectedPlayer) return;

    setIsSpinning(true);

    if (soundEnabled) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (error) {
        console.log('Audio not supported');
      }
    }

    const fullCycles = 3 + Math.random() * 3;
    const randomOffset = Math.random() * totalHeight;

    // Lock target to mid-stack (cycle 2) for visual stability
    const finalTarget = (2 * totalHeight) + randomOffset;
    const newPosition = finalTarget;

    setCurrentPosition(newPosition);

    setTimeout(() => {
      const visibleHeight = 384;
      const pointerPosition = visibleHeight / 2;

      const finalPosition = newPosition % totalHeight;
      const positionAtPointer = (finalPosition + pointerPosition) % totalHeight;
      const selectedIndex = Math.floor(positionAtPointer / sectorHeight) % wheelOptions.length;
      const result = wheelOptions[selectedIndex];

      onSpinComplete(`${selectedPlayer}: ${result.text}`);
      setIsSpinning(false);
      // No reset to avoid flicker
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div className="relative mx-auto" style={{ maxWidth: '600px' }}>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <div className="w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[20px] border-r-[#2D5A27] shadow-lg"></div>
        </div>

        <div className="w-full h-96 overflow-hidden border-4 border-[#2D5A27] rounded-lg bg-white shadow-lg relative">
          <div
            ref={wheelRef}
            className={`absolute left-0 top-0 w-full flex flex-col ${isSpinning ? 'transition-transform duration-[4s] ease-out' : ''}`}
            style={{
              transform: `translateY(-${currentPosition}px)`,
              height: `${totalHeight * 4}px`
            }}
          >
            {[...Array(4)].map((_, cycle) =>
              wheelOptions.map((option, index) => (
                <div
                  key={`${cycle}-${index}`}
                  className="flex items-center justify-center text-white font-bold text-sm border-b border-white/20 flex-shrink-0"
                  style={{
                    backgroundColor: option.color,
                    height: `${sectorHeight}px`,
                    width: '100%',
                    minHeight: `${sectorHeight}px`,
                    maxHeight: `${sectorHeight}px`
                  }}
                >
                  <span className="break-words text-center leading-tight px-2 text-xs">
                    {option.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4 mt-6">
        <button
          onClick={spinWheel}
          disabled={isSpinning || !selectedPlayer}
          className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
            isSpinning || !selectedPlayer
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#2D5A27] text-white hover:bg-[#1a3318] active:scale-95 shadow-lg'
          }`}
        >
          {isSpinning ? 'Spinning...' : 'SPIN!'}
        </button>

        <button
          onClick={onSoundToggle}
          className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {!selectedPlayer && (
        <p className="text-red-500 text-center">Please select a player first!</p>
      )}
    </div>
  );
}
