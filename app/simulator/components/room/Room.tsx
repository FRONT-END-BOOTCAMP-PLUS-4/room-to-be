// app/simulator/components/room/Room.tsx
'use client';

import Floor from './Floor';
import Wall from './Wall';

interface RoomProps {
  width: number; // meters
  height: number; // meters
  wallTexture: string; // public 경로 또는 import된 이미지
  floorTexture: string;
  floorExtension?: number;
}

export default function Room({
  width,
  height,
  wallTexture,
  floorTexture,
  floorExtension = 0.2,
}: RoomProps) {
  return (
    <>
      <Floor
        width={width}
        height={height}
        texture={floorTexture}
        extension={floorExtension}
      />
      <Wall width={width} height={height} texture={wallTexture} />
    </>
  );
}
