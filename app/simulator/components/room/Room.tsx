'use client';

import React from 'react';

import Floor from './Floor';
import Wall from './Wall';
interface RoomProps {
  width: number; // meters
  height: number; // meters
  wallTexture: string; // public 경로 또는 import된 이미지
  floorTexture: string;
  floorExtension?: number;
  enableFloorShadow?: boolean;
  shadowOpacity?: number;
  shadowFadeDistance?: number;
}

const Room = ({
  width,
  height,
  wallTexture,
  floorTexture,
  floorExtension = 0.2,

  enableFloorShadow = true,
  shadowOpacity = 1,
  shadowFadeDistance = 0.5,
}: RoomProps) => {
  return (
    <>
      <Floor
        width={width}
        height={height}
        texture={floorTexture}
        extension={floorExtension}
        enableShadow={enableFloorShadow}
        shadowOpacity={shadowOpacity}
        shadowFadeDistance={shadowFadeDistance}
      />
      <Wall width={width} height={height} texture={wallTexture} />
    </>
  );
};

export default React.memo(Room);
