'use client';

import { useState } from "react";
import Image from "next/image";

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
  const [viewMode, setViewMode] = useState(text);

  const handleClick = () => {
    if (viewMode === "3D 뷰") {
      setViewMode("2D 뷰");
    } else if (viewMode === "2D 뷰") {
      setViewMode("3D 뷰");
    }

    if (onClick) {
      onClick();
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
      {icon && (
        <Image
          src={icon}
          alt="icon"
          width={width}
          height={height}
        />
      )}
      {viewMode && <span className="text-[12px] text-white">{viewMode}</span>}
    </div>
  );
}