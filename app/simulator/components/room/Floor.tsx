// app/simulator/components/room/Floor.tsx
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

import RoomShadow from './RoomShadow';

interface FloorProps {
  width: number;
  height: number;
  texture: string;
  extension?: number;
  enableShadow?: boolean;
  shadowOpacity?: number;
  shadowFadeDistance?: number;
}

export default function Floor({
  width,
  height,
  texture,
  extension = 0.2,
  enableShadow = true,
  shadowOpacity = 0.35,
  shadowFadeDistance = 2.0,
}: FloorProps) {
  const map = useLoader(TextureLoader, texture);

  const floorThickness = 0.1;
  const floorWidth = width + extension * 2;
  const floorHeight = height + extension * 2;

  return (
    <>
      {enableShadow && (
        <>
          {/* 1. 넓고 부드러운 그림자 (바깥쪽) */}
          <RoomShadow
            roomWidth={width}
            roomHeight={height}
            shadowOpacity={shadowOpacity * 0.6}
            shadowFadeDistance={shadowFadeDistance}
          />

          {/* 2. 짧고 진한 그림자 (바닥 바로 아래) */}
          <RoomShadow
            roomWidth={width}
            roomHeight={height}
            shadowOpacity={shadowOpacity * 1.4}
            shadowFadeDistance={shadowFadeDistance * 0.4}
          />
        </>
      )}

      {/* 바닥 */}
      <mesh
        rotation={[0, 0, 0]}
        position={[width / 2, -floorThickness / 2, height / 2]}
      >
        <boxGeometry args={[floorWidth, floorThickness, floorHeight]} />
        <meshStandardMaterial map={map} />
      </mesh>
    </>
  );
}
