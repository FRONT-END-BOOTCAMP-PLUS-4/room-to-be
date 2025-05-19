// app/simulator/components/room/Floor.tsx
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface FloorProps {
  width: number;
  height: number;
  texture: string;
  extension?: number;
}

export default function Floor({
  width,
  height,
  texture,
  extension = 0.2,
}: FloorProps) {
  const map = useLoader(TextureLoader, texture);
  const floorThickness = 0.1;

  const floorWidth = width + extension * 2;
  const floorHeight = height + extension * 2;

  return (
    <mesh
      rotation={[0, 0, 0]}
      position={[width / 2, -floorThickness / 2, height / 2]}
    >
      <boxGeometry args={[floorWidth, floorThickness, floorHeight]} />
      <meshStandardMaterial map={map} />
    </mesh>
  );
}
