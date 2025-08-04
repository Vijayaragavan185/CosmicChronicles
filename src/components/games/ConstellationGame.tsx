import React, { useState, useEffect } from 'react';
import { Star, Check, RotateCcw } from 'lucide-react';

interface StarPoint {
  id: number;
  x: number;
  y: number;
  connected: boolean;
}

interface Constellation {
  name: string;
  stars: StarPoint[];
  connections: [number, number][];
  story: string;
}

const constellations: Constellation[] = [
  {
    name: 'Ursa Major (Big Dipper)',
    stars: [
      { id: 1, x: 100, y: 80, connected: false },
      { id: 2, x: 150, y: 70, connected: false },
      { id: 3, x: 200, y: 75, connected: false },
      { id: 4, x: 250, y: 85, connected: false },
      { id: 5, x: 220, y: 130, connected: false },
      { id: 6, x: 170, y: 140, connected: false },
      { id: 7, x: 120, y: 135, connected: false }
    ],
    connections: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 1]],
    story: 'The Big Dipper is part of Ursa Major, the Great Bear. Ancient cultures saw this as a bear being hunted across the sky.'
  },
  {
    name: 'Orion',
    stars: [
      { id: 1, x: 150, y: 60, connected: false },
      { id: 2, x: 120, y: 100, connected: false },
      { id: 3, x: 180, y: 100, connected: false },
      { id: 4, x: 140, y: 140, connected: false },
      { id: 5, x: 150, y: 150, connected: false },
      { id: 6, x: 160, y: 140, connected: false },
      { id: 7, x: 150, y: 180, connected: false }
    ],
    connections: [[1, 2], [1, 3], [2, 4], [3, 6], [4, 5], [5, 6], [5, 7]],
    story: 'Orion the Hunter is one of the most recognizable constellations, featuring the famous belt of three stars.'
  }
];

export const ConstellationGame: React.FC = () => {
  const [currentConstellation, setCurrentConstellation] = useState(0);
  const [stars, setStars] = useState<StarPoint[]>([]);
  const [connections, setConnections] = useState<[number, number][]>([]);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [completedConnections, setCompletedConnections] = useState<[number, number][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    resetGame();
  }, [currentConstellation]);

  const resetGame = () => {
    const constellation = constellations[currentConstellation];
    setStars(constellation.stars.map(star => ({ ...star, connected: false })));
    setConnections(constellation.connections);
    setCompletedConnections([]);
    setSelectedStar(null);
    setIsComplete(false);
  };

  const handleStarClick = (starId: number) => {
    if (selectedStar === null) {
      setSelectedStar(starId);
    } else if (selectedStar === starId) {
      setSelectedStar(null);
    } else {
      const connection: [number, number] = [Math.min(selectedStar, starId), Math.max(selectedStar, starId)];
      const isValidConnection = connections.some(([a, b]) => 
        (a === connection[0] && b === connection[1])
      );
      
      if (isValidConnection && !completedConnections.some(([a, b]) => 
        a === connection[0] && b === connection[1]
      )) {
        setCompletedConnections(prev => [...prev, connection]);
        setScore(prev => prev + 10);
        
        if (completedConnections.length + 1 === connections.length) {
          setIsComplete(true);
          setScore(prev => prev + 50);
        }
      }
      setSelectedStar(null);
    }
  };

  const nextConstellation = () => {
    if (currentConstellation < constellations.length - 1) {
      setCurrentConstellation(prev => prev + 1);
    } else {
      setCurrentConstellation(0);
    }
  };

  const constellation = constellations[currentConstellation];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{constellation.name}</h3>
          <p className="text-gray-400">Connect the stars to form the constellation</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">Score: {score}</div>
          <button
            onClick={resetGame}
            className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-b from-indigo-900/50 to-purple-900/50 rounded-xl p-8 relative overflow-hidden min-h-[400px]">
        {/* Stars */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Completed connections */}
          {completedConnections.map(([startId, endId], index) => {
            const startStar = stars.find(s => s.id === startId);
            const endStar = stars.find(s => s.id === endId);
            if (!startStar || !endStar) return null;
            
            return (
              <line
                key={index}
                x1={startStar.x}
                y1={startStar.y}
                x2={endStar.x}
                y2={endStar.y}
                stroke="#8b5cf6"
                strokeWidth="2"
                className="animate-pulse"
              />
            );
          })}
          
          {/* Preview connection */}
          {selectedStar && (
            <circle
              cx={stars.find(s => s.id === selectedStar)?.x}
              cy={stars.find(s => s.id === selectedStar)?.y}
              r="15"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Star points */}
        {stars.map((star) => (
          <button
            key={star.id}
            onClick={() => handleStarClick(star.id)}
            className={`absolute w-6 h-6 rounded-full transition-all duration-300 transform hover:scale-125 ${
              selectedStar === star.id
                ? 'bg-blue-400 shadow-lg shadow-blue-400/50'
                : 'bg-yellow-300 hover:bg-yellow-200'
            }`}
            style={{
              left: star.x - 12,
              top: star.y - 12,
            }}
          >
            <Star className="w-4 h-4 text-gray-800 mx-auto" />
          </button>
        ))}

        {/* Completion overlay */}
        {isComplete && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center">
              <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Constellation Complete!</h3>
              <p className="text-gray-300 mb-4">{constellation.story}</p>
              <button
                onClick={nextConstellation}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
              >
                Next Constellation
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <h4 className="text-white font-medium mb-2">How to Play:</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Click on stars to select them</li>
          <li>• Connect stars in the correct order to form the constellation</li>
          <li>• Complete all connections to unlock the constellation's story</li>
        </ul>
      </div>
    </div>
  );
};