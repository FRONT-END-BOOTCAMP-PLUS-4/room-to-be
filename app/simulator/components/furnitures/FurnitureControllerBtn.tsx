'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useViewStore } from '@/stores/useViewStore';

const VALID_ANGLES = [45, 135, 225, 315];
const TOP_VIEW_ANGLES = [0, 90, 180, 270];

function convertForm3DToTop(angle3D: number): number {
  const index3D = VALID_ANGLES.indexOf(angle3D);
  if (index3D !== -1) {
    return TOP_VIEW_ANGLES[index3D];
  }
  return 0;
}

function convertFormTopTo3D(angleTop: number): number {
  const indexTop = TOP_VIEW_ANGLES.indexOf(angleTop);
  if (indexTop !== -1) {
    return VALID_ANGLES[indexTop];
  }

  return 45;
}

interface FurnitureControllerBtnProps {
  icon?: string;
  text?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

export default function FurnitureControllerBtn({
  icon,
  text,
  width,
  height,
  onClick,
}: FurnitureControllerBtnProps) {
  const angle = useViewStore((s) => s.angle);
  const setAngle = useViewStore((s) => s.setAngle);
  const isTopView = useViewStore((s) => s.isTopView);
  const setIsTopView = useViewStore((s) => s.setIsTopView);

  const [viewMode, setViewMode] = useState(text);

  const isViewToggle = text === '3D 뷰' || text === '2D 뷰';

  useEffect(() => {
    if (isViewToggle) {
      setViewMode(isTopView ? '2D 뷰' : '3D 뷰');
    }
  }, [isTopView, isViewToggle]);

  const handleClick = () => {
    if (isViewToggle) {
      if (isTopView) {
        const new3DAngle = convertFormTopTo3D(angle);
        setAngle(new3DAngle);
        setIsTopView(false);
        setViewMode('3D 뷰');
      } else {
        const newTopAngle = convertForm3DToTop(angle);
        setAngle(newTopAngle);
        setIsTopView(true);
        setViewMode('2D 뷰');
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        w-full bg-white/30 py-[7px] h-7
        flex justify-center items-center
        rounded-md cursor-pointer hover:bg-white/40
        transition-colors duration-300 ease-in-out select-none
      `}
    >
      {icon && <Image src={icon} alt='icon' width={width} height={height} />}
      {viewMode && <span className='text-[12px] text-white'>{viewMode}</span>}
    </div>
  );
}
