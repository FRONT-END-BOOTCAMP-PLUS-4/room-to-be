'use client';

import { useMemo, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFurnitureStore } from '@/stores/useFurnitureStore';
import * as THREE from 'three';

import useHighlightMaterial from '@/app/hooks/useHighlightMaterial';
import useSyncScaleFromStore from '@/app/hooks/useSyncScaleFromStore';
import useGetBaseSize from '@/app/hooks/useGetBaseSize';
import useCursorOnDrag from '@/app/hooks/useCursorOnDrag';
import useSyncRotationFromStore from '@/app/hooks/useSyncRotationFromStore';
import useDragPosition from '@/app/hooks/useDragPosition';
import type { FurnitureModelProps } from '@/app/types/furniture';

export default function FurnitureModel({
  id,
  modelUrl,
  placementType,
  positionX,
  positionY,
  positionZ,
  rotationY,
  scaleX,
  scaleY,
  scaleZ,
  roomBoundary,
}: FurnitureModelProps) {
  const gltf = useGLTF(modelUrl);
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const meshRef = useRef<THREE.Group>(null);

  const {
    furnitures,
    selectedFurnitureId,
    selectFurniture,
    updateFurniture,
  } = useFurnitureStore();

  const isSelected = selectedFurnitureId === id;
  const selectedFurniture = furnitures.find((f) => f.id === selectedFurnitureId) || null;

  const [currentScale, setCurrentScale] = useState<[number, number, number]>([scaleX, scaleY, scaleZ]);
  const [currentRotationY, setCurrentRotationY] = useState(rotationY);
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

  // 회전 동기화
  useSyncRotationFromStore({
    isSelected,
    selected: selectedFurniture,
    set: setCurrentRotationY,
    meshRef,
  });

  // baseSize 계산
  const { baseSizeWithScale, baseSizeRaw } = useGetBaseSize(clonedScene);

  // 가구 크기(반폭, 반높이, 반깊이) 계산
  const halfWidth = baseSizeRaw ? (baseSizeRaw[0] * currentScale[0]) / 2 : 0;
  const halfHeight = baseSizeRaw ? (baseSizeRaw[1] * currentScale[1]) / 2 : 0;
  const halfDepth = baseSizeRaw ? (baseSizeRaw[2] * currentScale[2]) / 2 : 0;

  const { onPointerDown } = useDragPosition(
    meshRef,
    roomBoundary,
    placementType,
    setIsDragging,
    { halfWidth, halfDepth, halfHeight },
  );

  // 드래그 커서 관리
  useCursorOnDrag(isDragging, setIsDragging);

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
    selectFurniture(id);

    const pos = meshRef.current?.position;
    if (pos && baseSizeWithScale) {
      const curScaleX = currentScale[0];
      const curScaleY = currentScale[1];
      const curScaleZ = currentScale[2];

      const baseX = Math.round(baseSizeWithScale[0] * (curScaleX / scaleX));
      const baseY = Math.round(baseSizeWithScale[1] * (curScaleY / scaleY));
      const baseZ = Math.round(baseSizeWithScale[2] * (curScaleZ / scaleZ));

      updateFurniture(id, {
        positionX: pos.x,
        positionY: pos.y,
        positionZ: pos.z,
        rotationY: currentRotationY,
        scaleX: curScaleX,
        scaleY: curScaleY,
        scaleZ: curScaleZ,
        baseX,
        baseY,
        baseZ,
        originalScaleX: scaleX,
        originalScaleY: scaleY,
        originalScaleZ: scaleZ,
        originalBaseX: baseSizeWithScale[0],
        originalBaseY: baseSizeWithScale[1],
        originalBaseZ: baseSizeWithScale[2],
      });
    }
  };

  console.log('가구', id, '선택된 가구', selectedFurniture);

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      scale={currentScale}
      position={[positionX, positionY, positionZ]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={(e: any) => {
        onPointerDown(e.nativeEvent);
        handlePointerDown();
      }}
    />
  );
}