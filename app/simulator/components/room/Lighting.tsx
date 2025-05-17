// app/simulator/components/room/Lighting.tsx
'use client';

import { useLightingStore } from '@/stores/useLightingStore';

export default function Lighting() {
  const isDay = useLightingStore((s) => s.isDay);

  return (
    <>
      {isDay ? (
        <>
          {/* 전체 씬 밝기용 기본 조명 */}
          <ambientLight intensity={0.4} color='#f5f3ed' />

          {/* 태양광 */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            color='fff6e6'
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* 반대쪽 벽에서 약하게 반사되는 빛 효과 */}
          <directionalLight
            position={[-3, 2, -3]}
            intensity={0.3}
            color='#e6f0ff'
          />
        </>
      ) : (
        <>
          {/* 밤에는 주변광 매우 약하게 설정 */}
          <ambientLight intensity={0.3} color='#1a2035' />

          {/* 전체적으로 방을 밝히는 주 조명 */}
          <pointLight
            position={[2, 2.3, 2]}
            intensity={1.2}
            color='#ffe0bd'
            distance={10}
            decay={1.5}
            castShadow
          />
        </>
      )}
    </>
  );
}
