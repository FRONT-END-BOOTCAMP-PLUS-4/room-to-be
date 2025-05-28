import { useEffect } from 'react';
import * as THREE from 'three';

import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { useLightingStore } from '@/stores/useLightingStore';

interface UseLampLightProps {
  meshRef: React.RefObject<THREE.Group>;
  name: string;
}

/**
 * 램프 가구에 조명 효과를 추가하는 훅
 * 가구 이름에 '램프' 또는 'lamp'가 포함된 경우에 조명 추가.
 * 밤 모드일 때만 조명 활성화
 */
export default function useLampLight({ meshRef, name }: UseLampLightProps) {
  const isDay = useLightingStore((s) => s.isDay);
  const getCurrentBackground = useBackgroundStore(
    (s) => s.getCurrentBackground,
  );
  const currentBackgroundId = useBackgroundStore((s) => s.currentBackgroundId);

  // 조명 가구인지 여부 확인
  const isLamp =
    name.toLowerCase().includes('램프') || name.toLowerCase().includes('lamp');

  useEffect(() => {
    if (!isLamp || !meshRef.current) return;

    // 현재 테마 가져오기
    const Background = getCurrentBackground();
    const unifiedLightColor = '#ffd89b';
    const lightIntensity = Background.nightLightIntensity * 1.5;

    // 기존에 추가된 조명이 있으면 제거
    meshRef.current.traverse((child) => {
      if (child instanceof THREE.PointLight) {
        meshRef.current?.remove(child);
      }
    });

    // 낮/밤 모드에 따라 조명 설정
    if (!isDay) {
      const light = new THREE.PointLight(
        unifiedLightColor,
        lightIntensity,
        5, // 도달 거리
        1.5, // 감쇠율
      );

      light.position.set(0, 0.8, 0);

      meshRef.current.add(light);

      light.castShadow = true;
      light.shadow.mapSize.width = 512;
      light.shadow.mapSize.height = 512;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 10;
    }

    return () => {
      if (meshRef.current) {
        meshRef.current.traverse((child) => {
          if (child instanceof THREE.PointLight) {
            meshRef.current?.remove(child);
          }
        });
      }
    };
  }, [isLamp, isDay, meshRef, getCurrentBackground, currentBackgroundId]);

  return { isLamp };
}
