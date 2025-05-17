import { useEffect, useRef } from 'react';
import * as THREE from 'three';
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
  const isDay = useLightingStore((state) => state.isDay);
  const lightRef = useRef<THREE.PointLight | null>(null);

  // 조명 가구인지 여부 확인
  const isLamp =
    name.toLowerCase().includes('램프') || name.toLowerCase().includes('lamp');

  useEffect(() => {
    if (!isLamp || !meshRef.current) return;

    // 기존에 추가된 조명이 있으면 제거
    if (lightRef.current) {
      meshRef.current.remove(lightRef.current);
      lightRef.current = null;
    }

    // 낮/밤 모드에 따라 조명 설정
    if (!isDay) {
      // 밤 모드일 때만 조명 켜기
      const light = new THREE.PointLight(
        '#ffe3c1',
        1.2, // 밝기
        5, // 도달 거리
        1.5, // 감쇠율
      );

      // 램프 모델에 맞게 조명 위치 조정
      light.position.set(0, 0.8, 0); // y축으로 약간 위로 조정

      meshRef.current.add(light);
      lightRef.current = light;

      // 램프 조명 그림자 설정
      light.castShadow = true;
      light.shadow.mapSize.width = 512;
      light.shadow.mapSize.height = 512;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 10;
    }

    return () => {
      // 컴포넌트 언마운트 시 조명 제거
      if (lightRef.current && meshRef.current) {
        meshRef.current.remove(lightRef.current);
        lightRef.current = null;
      }
    };
  }, [isLamp, isDay, meshRef]);

  return { isLamp };
}
