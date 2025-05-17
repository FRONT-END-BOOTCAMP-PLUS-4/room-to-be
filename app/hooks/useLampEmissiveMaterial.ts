import { useEffect } from 'react';
import * as THREE from 'three';
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
  const isDay = useLightingStore((state) => state.isDay);
  const isLamp =
    name.toLowerCase().includes('램프') || name.toLowerCase().includes('lamp');

  useEffect(() => {
    if (!isLamp || isDay) return;

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

      // 대소문자 구분 없이 이름에 특정 단어가 포함되어 있는지 확인
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
        // 빛나는 효과 부여
        child.material.emissive.set('#ffe3c1'); // 따뜻한 빛 색상
        child.material.emissiveIntensity = 2.0; // 강한 발광 효과
      }
    });

    return () => {
      // 컴포넌트 언마운트 시 원래 재질로 복원
      scene.traverse((child: any) => {
        if (
          !child.isMesh ||
          !('emissive' in child.material) ||
          !child.userData._emissiveCloned
        )
          return;

        if (child.userData._originalEmissive) {
          child.material.emissive.copy(child.userData._originalEmissive);
          child.material.emissiveIntensity =
            child.userData._originalIntensity ?? 0;
        }
      });
    };
  }, [scene, isLamp, isDay]);
}
