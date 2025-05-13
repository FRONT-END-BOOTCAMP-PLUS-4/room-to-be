'use client';

export default function CenterMarker({ x = 0, y = 0.5, z = 0 }) {
  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[0.5, 0.3, 0.3]} />
      <meshStandardMaterial color='red' />
    </mesh>
  );
}
