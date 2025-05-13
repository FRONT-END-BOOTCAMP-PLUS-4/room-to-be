// app/simulator/components/room/Room.tsx
'use client';

import Floor from './Floor';
import Wall from './Wall';

interface RoomProps {
  width: number; // meters
  height: number; // meters
  wallTexture: string; // public 경로 또는 import된 이미지
  floorTexture: string;
}

export default function Room({ width, height, wallTexture, floorTexture }: RoomProps) {
  return (
    <>
      <Floor width={width} height={height} texture={floorTexture} />
      <Wall width={width} height={height} texture={wallTexture} />
    </>
  );
}
