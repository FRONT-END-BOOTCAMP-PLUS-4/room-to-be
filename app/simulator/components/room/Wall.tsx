import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useViewStore } from '@/stores/useViewStore';
import WallMarker from './WallMaker';
interface WallProps {
  width: number;
  height: number;
  texture: string;
}

export default function Wall({ width, height, texture }: WallProps) {
  const map = useLoader(TextureLoader, texture);
  const wallHeight = 2.5;
  const angle = useViewStore((s) => s.angle);
  const isTopView = useViewStore((s) => s.isTopView);

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
        <mesh position={[width / 2, wallHeight / 2, height]}>
          <boxGeometry args={[width, wallHeight, 0.1]} />
          <meshStandardMaterial map={map} />
        </mesh>
      )}

      {/* Z = 0 → back */}
      {!hiddenWalls.includes('back') && (
        <mesh position={[width / 2, wallHeight / 2, 0]}>
          <boxGeometry args={[width, wallHeight, 0.1]} />
          <meshStandardMaterial map={map} />
        </mesh>
      )}

      {/* X = 0 → left */}
      {!hiddenWalls.includes('left') && (
        <mesh position={[0, wallHeight / 2, height / 2]}>
          <boxGeometry args={[0.1, wallHeight, height]} />
          <meshStandardMaterial map={map} />
        </mesh>
      )}

      {/* X = width → right */}
      {!hiddenWalls.includes('right') && (
        <mesh position={[width, wallHeight / 2, height / 2]}>
          <boxGeometry args={[0.1, wallHeight, height]} />
          <meshStandardMaterial map={map} />
        </mesh>
      )}
      <WallMarker
        position={[width / 2, wallHeight / 2, height]} // Z=height → front wall
        normal={[0, 0, 0.06]} // 살짝 앞으로 튀어나오게
      />
    </>
  );
}
