'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FurnitureControllerBtnProps {
  icon?: string;
  text?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  disabled?: boolean;
}

export default function FurnitureControllerBtn({
  icon,
  text,
  width,
  height,
  onClick,
  disabled = false, 
}: FurnitureControllerBtnProps) {
  const [viewMode, setViewMode] = useState(text);

  useEffect(() => {
    setViewMode(text);
  }, [text]);

  const handleClick = () => {
    if (disabled) return;  // disabled면 클릭 무시
    if (onClick) {
      onClick();
      return;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        w-full py-[7px] h-7 flex justify-center items-center rounded-md select-none
        cursor-pointer transition-colors duration-300 ease-in-out
        ${disabled
          ? 'bg-white/10 text-white/50 cursor-not-allowed' 
          : 'bg-white/30 hover:bg-white/40 text-white'
        }
      `}
    >
      {icon && <Image src={icon} alt='icon' width={width} height={height} />}
      {viewMode && <span className='text-[12px]'>{viewMode}</span>}
    </div>
  );
}