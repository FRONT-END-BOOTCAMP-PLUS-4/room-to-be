'use client';

import { useMemo, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFurnitureStore } from '@/stores/useFurnitureStore';
import * as THREE from 'three';

import useHighlightMaterial from '@/app/hooks/useHighlightMaterial';
import useSyncScaleFromStore from '@/app/hooks/useSyncScaleFromStore';
import useGetBaseSize from '@/app/hooks/useGetBaseSize';
import useCursorOnDrag from '@/app/hooks/useCursorOnDrag';

interface FurnitureModelProps {
  id: string;
  name: string;
  modelUrl: string;
  thumbnailUrl: string;
  position?: [number, number, number];
  rotationY?: number;
  scale?: [number, number, number];
  roomBoundary: {
    xMin: number;
    xMax: number;
    zMin: number;
    zMax: number;
    yFloor: number;
    yWall: number;
  };
}

export default function FurnitureModel({
  id,
  name,
  modelUrl,
  thumbnailUrl,
  position = [0, 0, 0],
  rotationY = 0,
  scale = [0.1, 0.1, 0.1],
  roomBoundary,
}: FurnitureModelProps) {
  const gltf = useGLTF(modelUrl);
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const meshRef = useRef<THREE.Group>(null);

  const { selectFurniture, selectedFurniture } = useFurnitureStore();
  const isSelected = selectedFurniture?.id === id;
  const currentRotationY = isSelected ? selectedFurniture.rotationY : rotationY;

  const [currentScale, setCurrentScale] = useState(scale);
  const [isDragging, setIsDragging] = useState(false);

  // 선택 가구 하이라이트 처리
  useHighlightMaterial({ scene: clonedScene, isSelected });

  // 외부 스토어 스케일 동기화
  useSyncScaleFromStore({
    isSelected,
    selected: selectedFurniture,
    current: currentScale,
    set: setCurrentScale,
  });

  // baseSize 계산
  const baseSize = useGetBaseSize(clonedScene);

  // 드래그 커서 관리
  useCursorOnDrag(isDragging, setIsDragging);

  // 커서 이벤트 핸들러
  const handlePointerOver = () => {
    if (!isDragging) {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (!isDragging) {
      document.body.style.cursor = 'auto';
    }
  };

  const handlePointerDown = () => {
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';

    const pos = meshRef.current?.position;
    if (pos && baseSize) {
      const scaleX = currentScale[0];
      const scaleY = currentScale[1];
      const scaleZ = currentScale[2];

      const baseX = Math.round(baseSize[0] * (scaleX / scale[0]));
      const baseY = Math.round(baseSize[1] * (scaleY / scale[1]));
      const baseZ = Math.round(baseSize[2] * (scaleZ / scale[2]));

      selectFurniture({
        id,
        name,
        thumbnailUrl,
        positionX: pos.x,
        positionY: pos.y,
        positionZ: pos.z,
        rotationY: currentRotationY,
        scaleX,
        scaleY,
        scaleZ,
        baseX,
        baseY,
        baseZ,
        originalBaseX: baseSize[0],
        originalBaseY: baseSize[1],
        originalBaseZ: baseSize[2],
        originalScale: scale[0],
      });
    }
  };

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      scale={currentScale}
      rotation-y={currentRotationY}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
    />
  );
}