import React, { useState, useRef, useEffect } from 'react';
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
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const sectorAngle = 360 / wheelOptions.length; // Degrees per sector

  const spinWheel = () => {
    if (isSpinning || !selectedPlayer) return;

    setIsSpinning(true);
    
    if (soundEnabled) {
      // Simple beep sound using Web Audio API
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

    // Calculate spin: multiple full rotations plus random final position
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomAngle;
    
    setRotation(totalRotation);

    setTimeout(() => {
      // Calculate which option is selected based on final rotation
      // The arrow points down, so we need to account for that
      const normalizedRotation = (360 - (totalRotation % 360)) % 360;
      const selectedIndex = Math.floor(normalizedRotation / sectorAngle) % wheelOptions.length;
      const result = wheelOptions[selectedIndex];
      
      onSpinComplete(`${selectedPlayer}: ${result.text}`);
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div className="relative mx-auto" style={{ maxWidth: '600px' }}>
        {/* Static Arrow Pointer - pointing down at center */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-[#2D5A27] shadow-lg"></div>
        </div>
        
        {/* Horizontal wheel container */}
        <div className="w-full h-20 overflow-hidden border-4 border-[#2D5A27] rounded-full bg-white shadow-lg relative">
          <div 
            ref={wheelRef}
            className={`absolute inset-0 ${isSpinning ? 'transition-transform duration-[4s] ease-out' : 'transition-none'}`}
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
          >
            {wheelOptions.map((option, index) => {
              const angle = index * sectorAngle;
              return (
                <div
                  key={index}
                  className="absolute flex items-center justify-center text-white font-bold text-xs"
                  style={{
                    backgroundColor: option.color,
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: 'center',
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - sectorAngle/2) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - sectorAngle/2) * Math.PI / 180)}%, ${50 + 50 * Math.cos((angle + sectorAngle/2) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle + sectorAngle/2) * Math.PI / 180)}%)`
                  }}
                >
                  <span 
                    className="break-words text-center leading-tight px-1"
                    style={{
                      transform: `rotate(${-angle}deg)`,
                      fontSize: '10px',
                      maxWidth: '80px'
                    }}
                  >
                    {option.text}
                  </span>
                </div>
              );
            })}
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
