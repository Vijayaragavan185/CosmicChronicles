import React, { useState } from 'react';
import { Gamepad2, Target, Zap, Puzzle } from 'lucide-react';
import { ConstellationGame } from './games/ConstellationGame';
import { SpaceQuiz } from './games/SpaceQuiz';
import { AsteroidShooter } from './games/AsteroidShooter';

type GameType = 'constellation' | 'quiz' | 'shooter' | null;

export const GameCenter: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const games = [
    {
      id: 'constellation' as GameType,
      title: 'Constellation Connect',
      description: 'Connect the stars to form famous constellations and learn their stories',
      icon: <Target className="w-8 h-8" />,
      color: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'quiz' as GameType,
      title: 'Cosmic Quiz',
      description: 'Test your astronomical knowledge with challenging space questions',
      icon: <Puzzle className="w-8 h-8" />,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'shooter' as GameType,
      title: 'Asteroid Defense',
      description: 'Protect Earth from incoming asteroids in this space shooter game',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-red-600 to-orange-600'
    }
  ];

  if (activeGame) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {games.find(g => g.id === activeGame)?.title}
          </h2>
          <button
            onClick={() => setActiveGame(null)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Games
          </button>
        </div>
        
        {activeGame === 'constellation' && <ConstellationGame />}
        {activeGame === 'quiz' && <SpaceQuiz />}
        {activeGame === 'shooter' && <AsteroidShooter />}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Gamepad2 className="w-8 h-8 text-purple-400" />
          <span>Cosmic Game Center</span>
          <Gamepad2 className="w-8 h-8 text-blue-400" />
        </h2>
        <p className="text-gray-300 text-lg">
          Explore the universe through interactive games and challenges
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
          >
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${game.color} rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
                <div className="text-center">
                  <div className={`inline-flex p-4 bg-gradient-to-r ${game.color} rounded-full mb-6 group-hover:scale-110 transition-transform`}>
                    {game.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                    {game.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {game.description}
                  </p>
                  
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform group-hover:scale-105">
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Game Features</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-purple-400 font-medium">Educational</div>
            <div className="text-gray-400">Learn while you play</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-medium">Interactive</div>
            <div className="text-gray-400">Engaging gameplay</div>
          </div>
          <div className="text-center">
            <div className="text-cyan-400 font-medium">Progressive</div>
            <div className="text-gray-400">Increasing difficulty</div>
          </div>
        </div>
      </div>
    </div>
  );
};