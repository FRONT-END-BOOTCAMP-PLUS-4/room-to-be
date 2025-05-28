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

    const unifiedEmissiveColor = '#ffd89b';
    const emissiveIntensity = isDay ? 0 : 2.0;

    scene.traverse((child: THREE.Object3D) => {
      // 메시가 아니거나 발광 속성이 없으면 무시
      if (
        !(child as THREE.Mesh).isMesh ||
        !('emissive' in (child as THREE.Mesh).material)
      )
        return;

      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;

      // 재질 클론하기 (중복 clone 방지)
      if (!child.userData._emissiveCloned) {
        mesh.material = material.clone();
        mesh.userData._emissiveCloned = true;

        // 원래 색 저장
        mesh.userData._originalEmissive = (
          mesh.material as THREE.MeshStandardMaterial
        ).emissive.clone();
        mesh.userData._originalIntensity =
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity ?? 0;
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
        (mesh.material as THREE.MeshStandardMaterial).color &&
        (((mesh.material as THREE.MeshStandardMaterial).color.r > 0.7 &&
          (mesh.material as THREE.MeshStandardMaterial).color.g > 0.5 &&
          (mesh.material as THREE.MeshStandardMaterial).color.b < 0.3) || // 금색/노란색
          ((mesh.material as THREE.MeshStandardMaterial).color.r > 0.8 &&
            (mesh.material as THREE.MeshStandardMaterial).color.g > 0.8 &&
            (mesh.material as THREE.MeshStandardMaterial).color.b > 0.7));

      if (isLampPart || hasEmissiveColor) {
        const meshMaterial = mesh.material as THREE.MeshStandardMaterial;

        // 낮/밤에 따라 빛나는 효과 조정
        if (!isDay) {
          // 빛나는 효과 부여
          meshMaterial.emissive.set(unifiedEmissiveColor);
          meshMaterial.emissiveIntensity = emissiveIntensity;
        } else {
          // 낮에는 원래 상태로 복원
          if (child.userData._originalEmissive) {
            meshMaterial.emissive.copy(child.userData._originalEmissive);
            meshMaterial.emissiveIntensity =
              child.userData._originalIntensity ?? 0;
          }
        }
      }
    });
  }, [scene, isLamp, isDay, getCurrentBackground, currentBackgroundId]);
}
