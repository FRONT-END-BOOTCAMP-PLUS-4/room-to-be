// app/simulator/components/room/Lighting.tsx
'use client';

import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { useLightingStore } from '@/stores/useLightingStore';

/* eslint-disable */
// @ts-ignore
export default function Lighting() {
  const isDay = useLightingStore((s) => s.isDay);
  const getCurrentBackground = useBackgroundStore(
    (s) => s.getCurrentBackground,
  );
  const Background = getCurrentBackground();

  const unifiedLightColor = '#ffd89b';

  const lightColor = isDay ? Background.dayLightColor : unifiedLightColor;
  const lightIntensity = isDay
    ? Background.dayLightIntensity
    : Background.nightLightIntensity;

  return (
    <>
      {isDay ? (
        <>
          {/* 전체 씬 밝기용 기본 조명 */}
          <ambientLight intensity={0.4} color='#f5f3ed' />

          {/* 태양광 */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={lightIntensity}
            color={lightColor}
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
            position={[2, 3, 2]}
            intensity={0.8}
            color={unifiedLightColor}
            castShadow
            distance={8}
            decay={1}
          />

          {/* 보조 조명 */}
          <pointLight
            position={[-2, 2, -2]}
            intensity={0.2}
            color={unifiedLightColor}
            distance={8}
            decay={1}
          />

          {/* 전체 조명*/}
          <directionalLight
            position={[1, 4, 1]}
            intensity={0.3}
            color={unifiedLightColor}
          />
        </>
      )}
    </>
  );
}
