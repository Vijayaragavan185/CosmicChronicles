import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Heart, RotateCcw } from 'lucide-react';

interface GameObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Bullet extends GameObject {
  active: boolean;
}

interface Asteroid extends GameObject {
  rotation: number;
  rotationSpeed: number;
}

export const AsteroidShooter: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playerX, setPlayerX] = useState(200);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  const gameWidth = 400;
  const gameHeight = 500;
  const playerWidth = 40;
  const playerHeight = 30;

  const createAsteroid = useCallback((): Asteroid => ({
    id: Math.random(),
    x: Math.random() * (gameWidth - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: 1 + Math.random() * 2,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 10
  }), []);

  const createBullet = useCallback((x: number): Bullet => ({
    id: Math.random(),
    x: x + playerWidth / 2 - 2,
    y: gameHeight - playerHeight - 10,
    width: 4,
    height: 10,
    speed: 5,
    active: true
  }), []);

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setPlayerX(200);
    setBullets([]);
    setAsteroids([]);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
      
      if (e.key === ' ' && gameStarted && !gameOver) {
        e.preventDefault();
        setBullets(prev => [...prev, createBullet(playerX)]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, playerX, createBullet]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setPlayerX(prev => {
        let newX = prev;
        if (keys['ArrowLeft'] || keys['a']) newX -= 5;
        if (keys['ArrowRight'] || keys['d']) newX += 5;
        return Math.max(0, Math.min(gameWidth - playerWidth, newX));
      });

      setBullets(prev => prev
        .map(bullet => ({ ...bullet, y: bullet.y - bullet.speed }))
        .filter(bullet => bullet.y > -10)
      );

      setAsteroids(prev => prev
        .map(asteroid => ({
          ...asteroid,
          y: asteroid.y + asteroid.speed,
          rotation: asteroid.rotation + asteroid.rotationSpeed
        }))
        .filter(asteroid => asteroid.y < gameHeight + 30)
      );

      if (Math.random() < 0.02) {
        setAsteroids(prev => [...prev, createAsteroid()]);
      }

      setBullets(prevBullets => {
        const newBullets = [...prevBullets];
        
        setAsteroids(prevAsteroids => {
          const newAsteroids = [...prevAsteroids];
          
          for (let i = newBullets.length - 1; i >= 0; i--) {
            const bullet = newBullets[i];
            
            for (let j = newAsteroids.length - 1; j >= 0; j--) {
              const asteroid = newAsteroids[j];
              
              if (
                bullet.x < asteroid.x + asteroid.width &&
                bullet.x + bullet.width > asteroid.x &&
                bullet.y < asteroid.y + asteroid.height &&
                bullet.y + bullet.height > asteroid.y
              ) {
                newBullets.splice(i, 1);
                newAsteroids.splice(j, 1);
                setScore(prev => prev + 10);
                break;
              }
            }
          }
          
          return newAsteroids;
        });
        
        return newBullets;
      });

      setAsteroids(prevAsteroids => {
        const newAsteroids = [...prevAsteroids];
        
        for (let i = newAsteroids.length - 1; i >= 0; i--) {
          const asteroid = newAsteroids[i];
          
          if (
            playerX < asteroid.x + asteroid.width &&
            playerX + playerWidth > asteroid.x &&
            gameHeight - playerHeight < asteroid.y + asteroid.height &&
            gameHeight > asteroid.y
          ) {
            newAsteroids.splice(i, 1);
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameOver(true);
              }
              return newLives;
            });
          }
        }
        
        return newAsteroids;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, keys, playerX, createAsteroid]);

  if (!gameStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
          <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Asteroid Defense</h3>
          <p className="text-gray-300 mb-6">
            Protect Earth from incoming asteroids! Use arrow keys or A/D to move, spacebar to shoot.
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold text-white">Score: {score}</div>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-white">{lives}</span>
          </div>
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      <div className="flex justify-center">
        <div 
          className="relative bg-gradient-to-b from-indigo-900/50 to-black/50 border border-white/20 rounded-lg overflow-hidden"
          style={{ width: gameWidth, height: gameHeight }}
        >
          {/* Stars background */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Player */}
          <div
            className="absolute bg-blue-400 rounded-t-lg"
            style={{
              left: playerX,
              bottom: 0,
              width: playerWidth,
              height: playerHeight,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          />

          {/* Bullets */}
          {bullets.map(bullet => (
            <div
              key={bullet.id}
              className="absolute bg-yellow-400 rounded-full"
              style={{
                left: bullet.x,
                top: bullet.y,
                width: bullet.width,
                height: bullet.height
              }}
            />
          ))}

          {/* Asteroids */}
          {asteroids.map(asteroid => (
            <div
              key={asteroid.id}
              className="absolute bg-gray-500 rounded-lg"
              style={{
                left: asteroid.x,
                top: asteroid.y,
                width: asteroid.width,
                height: asteroid.height,
                transform: `rotate(${asteroid.rotation}deg)`
              }}
            />
          ))}

          {/* Game Over overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>
                <p className="text-gray-300 mb-4">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <h4 className="text-white font-medium mb-2">Controls:</h4>
        <div className="text-gray-300 text-sm space-y-1">
          <div>• Arrow Keys or A/D: Move left/right</div>
          <div>• Spacebar: Shoot</div>
          <div>• Destroy asteroids to earn points</div>
          <div>• Avoid collisions to preserve lives</div>
        </div>
      </div>
    </div>
  );
};