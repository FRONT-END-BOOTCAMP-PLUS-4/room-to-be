import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import {
  setupWindowGlassEffect,
  updateAllWindowGlass,
} from '@/utils/windowGlassUtils';

interface UseWindowGlassProps {
  scene: THREE.Group;
  name: string;
  isDay: boolean;
}

export const useWindowGlass = ({ scene, name, isDay }: UseWindowGlassProps) => {
  const glassMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const isInitializedRef = useRef(false);

  // 창문 유리 효과 초기 설정 (한 번만)
  useEffect(() => {
    if (!isInitializedRef.current) {
      glassMaterialRef.current = setupWindowGlassEffect(scene, name, isDay);
      isInitializedRef.current = true;
    }
  }, [scene, name]); // isDay를 의존성에서 제거

  // 낮/밤 모드 변경 시에만 색상 업데이트
  useEffect(() => {
    if (isInitializedRef.current) {
      updateAllWindowGlass(scene, isDay);
    }
  }, [isDay, scene]);

  return glassMaterialRef;
};
