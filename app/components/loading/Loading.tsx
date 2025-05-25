'use client';

import { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

interface ProgressProps {
  className?: string;
  value?: number;
}

const Progress = ({ className = '', value = 0 }: ProgressProps) => (
  <div
    className={`relative h-2 w-full overflow-hidden rounded-full bg-white/20 ${className}`}
  >
    <div
      className='h-full w-full flex-1 bg-gradient-to-r from-[#FF9600] to-[#A20FD2] transition-all duration-300 ease-out'
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </div>
);

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        const newProgress = prev + Math.random() * 3 + 1;
        return Math.min(newProgress, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='fixed inset-0 z-50 overflow-hidden bg-black'>
      <div className='absolute inset-0 bg-gradient-to-br from-[#FF9600] to-[#A20FD2] opacity-20' />
      <div className='absolute inset-0 bg-gradient-to-tl from-[#FF9600] to-[#A20FD2] opacity-30' />

      <div className='relative z-10 flex flex-col items-center justify-center h-full'>
        <div className='flex flex-col items-center'>
          <div className='relative'>
            <Player
              autoplay
              loop
              src='/assets/images/furnitures_gradient_strong_gradient.json'
              style={{ height: '200px', width: '200px' }}
            />
          </div>

          <div className='w-80'>
            <Progress value={progress} className='h-2 bg-white/10' />
          </div>
        </div>
      </div>
    </div>
  );
}
