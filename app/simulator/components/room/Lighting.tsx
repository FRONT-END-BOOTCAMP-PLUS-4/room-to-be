// app/simulator/components/room/Lighting.tsx
'use client';

export default function Lighting() {
  return (
    <>
      {/* 전체 씬 밝기용 기본 조명 */}
      <ambientLight intensity={0.5} />

      {/* 한 방향에서 쏘는 태양광 느낌 */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}
