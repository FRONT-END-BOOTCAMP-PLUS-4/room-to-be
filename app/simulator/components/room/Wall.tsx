import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

import { useViewStore } from '@/stores/useViewStore';

interface WallProps {
  width: number;
  height: number;
  texture: string;
  wallExtension?: number;
}

export default function Wall({
  width,
  height,
  texture,
  wallExtension = 0.1,
}: WallProps) {
  const map = useLoader(TextureLoader, texture);
  const wallHeight = 2.5;
  const wallThickness = 0.1;
  const angle = useViewStore((s) => s.angle);
  const isTopView = useViewStore((s) => s.isTopView);

  const extendedWidth = width + wallExtension * 2;
  const extendedHeight = height + wallExtension * 2;

  //앵글에 따라 숨길 벽
  const hideWallsByAngle: Record<number, string[]> = {
    [-1]: ['front', 'right', 'back', 'left'],
    [45]: ['front', 'right'],
    [135]: ['right', 'back'],
    [225]: ['back', 'left'],
    [315]: ['left', 'front'],
  };

  let hiddenWalls: string[] = [];

  if (isTopView) {
    hiddenWalls = ['front', 'right', 'back', 'left'];
  } else {
    hiddenWalls = hideWallsByAngle[angle] ?? [];
  }

  return (
    <>
      {/* Z = height → front */}
      {!hiddenWalls.includes('front') && (
        <mesh
          position={[width / 2, wallHeight / 2, height + wallThickness / 2]}
        >
          <boxGeometry args={[extendedWidth, wallHeight, wallThickness]} />
          <meshStandardMaterial map={map} />
        </mesh>
      )}

      {/* Z = 0 → back */}
      {!hiddenWalls.includes('back') && (
        <mesh position={[width / 2, wallHeight / 2, -wallThickness / 2]}>
          <boxGeometry args={[extendedWidth, wallHeight, wallThickness]} />
          <meshStandardMaterial map={map} />
        </mesh>
      )}

      {/* X = 0 → left */}
      {!hiddenWalls.includes('left') && (
        <mesh position={[-wallThickness / 2, wallHeight / 2, height / 2]}>
          <boxGeometry args={[wallThickness, wallHeight, extendedHeight]} />
          <meshStandardMaterial map={map} />
        </mesh>
      )}

      {/* X = width → right */}
      {!hiddenWalls.includes('right') && (
        <mesh
          position={[width + wallThickness / 2, wallHeight / 2, height / 2]}
        >
          <boxGeometry args={[wallThickness, wallHeight, extendedHeight]} />
          <meshStandardMaterial map={map} />
        </mesh>
      )}
    </>
  );
}
