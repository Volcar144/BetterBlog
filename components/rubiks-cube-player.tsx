'use client';

import React from 'react';

export type StickeringType = 'OLL' | 'PLL' | 'Cross' | 'CMLL' | 'LSE' | 'none';

export interface RubiksCubePlayerProps {
  title?: string;
  algorithm: string;
  setupAlgorithm?: string;
  autoplay?: boolean;
  stickering?: StickeringType;
  showControls?: boolean;
}

export function RubiksCubePlayer({ title, algorithm, setupAlgorithm, autoplay = false, stickering = 'none', showControls = true }: RubiksCubePlayerProps) {
  const playerRef = React.useRef<any>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(autoplay);
  const [speed, setSpeed] = React.useState(1);
  const [selectedStickering, setSelectedStickering] = React.useState<StickeringType>(stickering);

  // Load the cubing.js script
  React.useEffect(() => {
    let isMounted = true;

    const loadScript = () => {
      if (isMounted) setIsLoaded(true);
    };

    // Check if script is already loaded
    if (typeof window !== 'undefined' && !(window as any).cubing) {
      const script = document.createElement('script');
      script.src = 'https://cdn.cubing.net/v0/js/cubing/twisty';
      script.type = 'module';
      script.onload = loadScript;
      document.head.appendChild(script);
    } else {
      loadScript();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Apply attributes to player
  React.useEffect(() => {
    if (!isLoaded || !playerRef.current) return;

    const player = playerRef.current as any;

    player.setAttribute('puzzle', '3x3x3');
    player.setAttribute('visualization', '3D');
    player.setAttribute('background', 'transparent');
    player.setAttribute('control-panel', 'auto');

    if (algorithm?.trim()) {
      player.setAttribute('alg', algorithm.trim());
    } else {
      player.removeAttribute('alg');
    }

    if (setupAlgorithm?.trim()) {
      player.setAttribute('experimental-setup-alg', setupAlgorithm.trim());
      player.setAttribute('experimental-setup-anchor', 'start');
    } else {
      player.removeAttribute('experimental-setup-alg');
      player.removeAttribute('experimental-setup-anchor');
    }

    if (selectedStickering && selectedStickering !== 'none') {
      player.setAttribute('experimental-stickering', selectedStickering);
    } else {
      player.removeAttribute('experimental-stickering');
    }

    if (autoplay && typeof player.play === 'function') {
      setTimeout(() => player.play(), 100);
    }
  }, [algorithm, setupAlgorithm, autoplay, isLoaded, selectedStickering]);

  React.useEffect(() => {
    if (!isLoaded || !playerRef.current) return;

    const player = playerRef.current as any;

    if (isPlaying && typeof player.play === 'function') {
      player.play();
    } else if (!isPlaying && typeof player.pause === 'function') {
      player.pause();
    }
  }, [isPlaying, isLoaded]);

  React.useEffect(() => {
    if (!isLoaded || !playerRef.current) return;

    const player = playerRef.current as any;
    if (typeof (player as any).playbackSpeed !== 'undefined') {
      (player as any).playbackSpeed = speed;
    }
  }, [speed, isLoaded]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    if (playerRef.current && typeof playerRef.current.reset === 'function') {
      playerRef.current.reset();
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(parseFloat(e.target.value));
  };

  const handleStickeringChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStickering(e.target.value as StickeringType);
  };

  return (
    <div className='my-10 flex flex-col items-center gap-4'>
      {title && <h3 className='text-xl font-semibold'>{title}</h3>}

      <div className='w-full max-w-[520px]'>
        {React.createElement('twisty-player', {
          ref: playerRef,
          style: { width: '100%', height: 360, display: 'block' },
        })}
      </div>

      {showControls && isLoaded && (
        <div className='flex flex-col gap-4 w-full max-w-[520px] bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
          {/* Playback Controls */}
          <div className='flex gap-2'>
            <button onClick={handlePlayPause} className='flex-1 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 font-medium'>
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button onClick={handleRestart} className='flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50 font-medium'>
              ↻ Restart
            </button>
          </div>

          {/* Speed Control */}
          <div className='flex items-center gap-3'>
            <label htmlFor='speed-select' className='font-medium text-sm'>
              Speed:
            </label>
            <select
              id='speed-select'
              value={speed}
              onChange={handleSpeedChange}
              className='flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm'
            >
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x (Normal)</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          {/* Stickering / Highlighting */}
          <div className='flex items-center gap-3'>
            <label htmlFor='stickering-select' className='font-medium text-sm'>
              Highlight:
            </label>
            <select
              id='stickering-select'
              value={selectedStickering}
              onChange={handleStickeringChange}
              className='flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm'
            >
              <option value='none'>None</option>
              <option value='OLL'>OLL (Last Layer)</option>
              <option value='PLL'>PLL (Permutation)</option>
              <option value='Cross'>Cross (Yellow)</option>
              <option value='CMLL'>CMLL (Roux)</option>
              <option value='LSE'>LSE (Roux)</option>
            </select>
          </div>
        </div>
      )}

      <div className='text-sm text-gray-500 text-center max-w-[640px]'>
        {setupAlgorithm?.trim() && <div className='mb-1'>Setup: {setupAlgorithm}</div>}
        {algorithm?.trim() && <div>Algorithm: {algorithm}</div>}
      </div>
    </div>
  );
}
