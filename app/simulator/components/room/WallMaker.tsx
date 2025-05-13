'use client';

interface WallMarkerProps {
  position: [number, number, number]; // (x, y, z)
  normal?: [number, number, number]; // 벽 방향으로 살짝 튀어나오게
  color?: string;
}

export default function WallMarker({
  position,
  normal = [0, 0, 1],
  color = 'blue',
}: WallMarkerProps) {
  // 살짝 띄워서 벽에 붙이기
  const finalPos: [number, number, number] = [
    position[0] + normal[0],
    position[1] + normal[1],
    position[2] + normal[2],
  ];

  return (
    <mesh position={finalPos}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
