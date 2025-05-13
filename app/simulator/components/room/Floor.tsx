// app/simulator/components/room/Floor.tsx
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

interface FloorProps {
  width: number;
  height: number;
  texture: string;
}

export default function Floor({ width, height, texture }: FloorProps) {
  const map = useLoader(TextureLoader, texture);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, 0, height / 2]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={map} />
    </mesh>
  );
}
