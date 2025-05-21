import { useEffect } from 'react';
import * as THREE from 'three';

import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { useLightingStore } from '@/stores/useLightingStore';

interface UseLampEmissiveMaterialProps {
  scene: THREE.Object3D;
  name: string;
}

/**
 * 램프 가구의 발광 부분에 빛나는 효과를 주는 훅
 * 밤 모드일 때만 램프의 갓이나 전구 부분에 발광 효과 적용.
 */
export default function useLampEmissiveMaterial({
  scene,
  name,
}: UseLampEmissiveMaterialProps) {
  const isDay = useLightingStore((s) => s.isDay);
  const getCurrentBackground = useBackgroundStore(
    (s) => s.getCurrentBackground,
  );
  const currentBackgroundId = useBackgroundStore((s) => s.currentBackgroundId);

  const isLamp =
    name.toLowerCase().includes('램프') || name.toLowerCase().includes('lamp');

  useEffect(() => {
    if (!isLamp || isDay) return;

    // 현재 테마 가져오기
    const Background = getCurrentBackground();
    const emissiveColor = isDay ? '#000000' : Background.nightLightColor;
    const emissiveIntensity = isDay ? 0 : 2.0;

    scene.traverse((child: any) => {
      // 메시가 아니거나 발광 속성이 없으면 무시
      if (!child.isMesh || !('emissive' in child.material)) return;

      // 재질 클론하기 (중복 clone 방지)
      if (!child.userData._emissiveCloned) {
        child.material = child.material.clone();
        child.userData._emissiveCloned = true;

        // 원래 색 저장
        child.userData._originalEmissive = child.material.emissive.clone();
        child.userData._originalIntensity =
          child.material.emissiveIntensity ?? 0;
      }

      // 램프의 갓이나 전구 부분 이름 찾기
      const childName = child.name?.toUpperCase?.() ?? '';
      const lampParts = [
        'BULB',
        'GLASS',
        'SHADE',
        'LIGHT',
        'LAMP_SHADE',
        'LAMPSHADE',
      ];

      const isLampPart = lampParts.some(
        (part) =>
          childName.includes(part) ||
          child.name?.toLowerCase().includes(part.toLowerCase()),
      );

      // 특정 색상의 메시도 발광 부분으로 간주 (노란색, 금색 등)
      const hasEmissiveColor =
        child.material.color &&
        ((child.material.color.r > 0.7 &&
          child.material.color.g > 0.5 &&
          child.material.color.b < 0.3) || // 금색/노란색
          (child.material.color.r > 0.8 &&
            child.material.color.g > 0.8 &&
            child.material.color.b > 0.7)); // 흰색/밝은색

      if (isLampPart || hasEmissiveColor) {
        // 낮/밤에 따라 빛나는 효과 조정
        if (!isDay) {
          // 빛나는 효과 부여
          child.material.emissive.set(emissiveColor);
          child.material.emissiveIntensity = emissiveIntensity;
        } else {
          // 낮에는 원래 상태로 복원
          if (child.userData._originalEmissive) {
            child.material.emissive.copy(child.userData._originalEmissive);
            child.material.emissiveIntensity =
              child.userData._originalIntensity ?? 0;
          }
        }
      }
    });
  }, [scene, isLamp, isDay, getCurrentBackground, currentBackgroundId]);
}
