'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

import useCursorOnDrag from '@/app/hooks/useCursorOnDrag';
import useDragPosition from '@/app/hooks/useDragPosition';
import useGetBaseSize from '@/app/hooks/useGetBaseSize';
import useHighlightMaterial from '@/app/hooks/useHighlightMaterial';
import useLampEmissiveMaterial from '@/app/hooks/useLampEmissiveMaterial';
import useLampLight from '@/app/hooks/useLampLight';
import useSyncPositionFromStore from '@/app/hooks/useSyncPositionFromStore';
import useSyncRotationFromStore from '@/app/hooks/useSyncRotationFromStore';
import useSyncScaleFromStore from '@/app/hooks/useSyncScaleFromStore';
import type { FurnitureModelProps } from '@/app/types/furniture';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useLightingStore } from '@/stores/useLightingStore';

export default function FurnitureModel({
  id,
  name,
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

  const { furnitures, selectedFurnitureId, selectFurniture, updateFurniture } =
    useFurnitureStore();

  const isSelected = selectedFurnitureId === id;
  const selectedFurniture =
    furnitures.find((f) => f.id === selectedFurnitureId) || null;

  const [currentPosition, setCurrentPosition] = useState<
    [number, number, number]
  >([positionX, positionY, positionZ]);
  const [currentScale, setCurrentScale] = useState<[number, number, number]>([
    scaleX,
    scaleY,
    scaleZ,
  ]);
  const [currentRotationY, setCurrentRotationY] = useState(rotationY);
  const [isDragging, setIsDragging] = useState(false);

  const isDay = useLightingStore((state) => state.isDay);
  const glassMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // 선택 가구 하이라이트 처리
  useHighlightMaterial({ scene: clonedScene, isSelected });

  // 스토어 포지션 동기화
  useSyncPositionFromStore({
    isSelected,
    selected: selectedFurniture,
    current: currentPosition,
    set: setCurrentPosition,
  });

  // 스토어 스케일 동기화
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
    current: currentRotationY,
    set: setCurrentRotationY,
    meshRef,
  });

  useLampLight({ meshRef, name });
  useLampEmissiveMaterial({ scene: clonedScene, name });

  // baseSize 계산 (baseSizeWithScale는 mm 단위, baseSizeRaw는 가구 기본 단위 )
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
    {
      halfWidth,
      halfDepth,
      halfHeight,
      onDragEnd: (pos,rot) => {
        setCurrentPosition([pos.x, pos.y, pos.z]);
        updateFurniture(id, {
          positionX: pos.x,
          positionY: pos.y,
          positionZ: pos.z,
          rotationY: rot?.y,
        });
      },
    },
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

    if (baseSizeWithScale) {
      const curScaleX = currentScale[0];
      const curScaleY = currentScale[1];
      const curScaleZ = currentScale[2];

      const baseX = Math.round(baseSizeWithScale[0] * (curScaleX / scaleX));
      const baseY = Math.round(baseSizeWithScale[1] * (curScaleY / scaleY));
      const baseZ = Math.round(baseSizeWithScale[2] * (curScaleZ / scaleZ));

      // 기존 가구 정보 가져오기 (원본 값 존재 여부 확인용)
      const furniture = furnitures.find((f) => f.id === id);

      updateFurniture(id, {
        positionX: currentPosition[0],
        positionY: currentPosition[1],
        positionZ: currentPosition[2],
        rotationY: currentRotationY,
        scaleX: curScaleX,
        scaleY: curScaleY,
        scaleZ: curScaleZ,
        baseX,
        baseY,
        baseZ,

        // originalXXX 값은 기존에 없을 때만 설정해서 한번만 저장되도록
        originalPositionX: furniture?.originalPositionX ?? positionX,
        originalPositionY: furniture?.originalPositionY ?? positionY,
        originalPositionZ: furniture?.originalPositionZ ?? positionZ,
        originalScaleX: furniture?.originalScaleX ?? scaleX,
        originalScaleY: furniture?.originalScaleY ?? scaleY,
        originalScaleZ: furniture?.originalScaleZ ?? scaleZ,
        originalRotationY: furniture?.originalRotationY ?? rotationY,
        originalBaseX: furniture?.originalBaseX ?? baseSizeWithScale[0],
        originalBaseY: furniture?.originalBaseY ?? baseSizeWithScale[1],
        originalBaseZ: furniture?.originalBaseZ ?? baseSizeWithScale[2],
      });
    }
  };

  // 창문 배경(유리) 생성
  useEffect(() => {
    if (
      name.toLowerCase().includes('window') ||
      name.toLowerCase().includes('창문')
    ) {
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const glassGeometry = new THREE.PlaneGeometry(size.x * 0.8, size.y * 0.8);

      const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: false,
        opacity: 1.0,
        roughness: 0.0,
        metalness: 0.0,
        emissive: 0xffffff,
        emissiveIntensity: 1,
      });

      glassMaterialRef.current = glassMaterial;

      const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);

      glassMesh.userData._isWindowGlass = true;

      glassMesh.position.set(
        center.x - clonedScene.position.x,
        center.y - clonedScene.position.y,
        0.001,
      );

      clonedScene.add(glassMesh);

      updateGlassMaterial(isDay);
    }
  }, [clonedScene, name]);

  // 낮/밤 모드 변경 시 창문 배경(유리) 색상 업데이트
  const updateGlassMaterial = (isDay: boolean) => {
    if (glassMaterialRef.current) {
      if (isDay) {
        // 낮: 밝은 흰색
        glassMaterialRef.current.color.setHex(0xffffff);
        glassMaterialRef.current.emissive.setHex(0xfff8e1);
        glassMaterialRef.current.emissiveIntensity = 0.8;
      } else {
        // 밤: 어두운 남색
        glassMaterialRef.current.color.setHex(0x1a237e);
        glassMaterialRef.current.emissive.setHex(0x0d1b69);
        glassMaterialRef.current.emissiveIntensity = 0.1;
      }
    }
  };

  // 낮/밤 모드 변경 시 창문 배경(유리) 색상 업데이트
  useEffect(() => {
    updateGlassMaterial(isDay);
  }, [isDay]);

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      scale={currentScale}
      position={currentPosition}
      rotation={[0, currentRotationY, 0]} 
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={(e: any) => {
        onPointerDown(e.nativeEvent);
        handlePointerDown();
      }}
    />
  );
}
