import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

export const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      const stars: Star[] = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
      
      starsRef.current = stars;
    };

    const animate = (time: number) => {
      // Check if light theme is active
      const isLightTheme = document.documentElement.classList.contains('light-theme');
      
      // Adjust background and star colors based on theme
      if (isLightTheme) {
        ctx.fillStyle = 'rgba(248, 250, 252, 0.1)';
      } else {
        ctx.fillStyle = 'rgba(6, 6, 20, 0.1)';
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        star.opacity += Math.sin(time * star.twinkleSpeed) * 0.3;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));

        ctx.globalAlpha = star.opacity * (isLightTheme ? 0.4 : 1);
        ctx.fillStyle = isLightTheme ? '#1f2937' : '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    animate(0);

    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Theme change detected, stars will adjust automatically in the next animation frame
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        background: document.documentElement.classList.contains('light-theme')
          ? 'radial-gradient(ellipse at center, #e2e8f0 0%, #f8fafc 100%)'
          : 'radial-gradient(ellipse at center, #1a1a3e 0%, #060614 100%)'
      }}
    />
  );
};