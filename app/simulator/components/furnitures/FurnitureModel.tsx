'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
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

import { centerizeModel } from '@/utils/boundingBoxUtils';
import {
  createBoundingBox,
  resolveMultipleCollisions,
} from '@/utils/collisionUtils';

import { useFurnitureStore } from '@/stores/useFurnitureStore';
import { useLightingStore } from '@/stores/useLightingStore';

function FurnitureModel({
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
  const clonedScene = useMemo(() => {
    const scene = gltf.scene.clone(true);
    centerizeModel(scene);
    return scene;
  }, [gltf.scene]);

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
  const hasInitialized = useRef(false);

  useHighlightMaterial({ scene: clonedScene, isSelected });
  useSyncPositionFromStore({
    isSelected,
    selected: selectedFurniture,
    current: currentPosition,
    set: setCurrentPosition,
  });
  useSyncScaleFromStore({
    isSelected,
    selected: selectedFurniture,
    current: currentScale,
    set: setCurrentScale,
  });
  useSyncRotationFromStore({
    isSelected,
    selected: selectedFurniture,
    current: currentRotationY,
    set: setCurrentRotationY,
    meshRef,
  });
  useLampLight({ meshRef, name });
  useLampEmissiveMaterial({ scene: clonedScene, name });

  const { baseSizeWithScale, baseSizeRaw } = useGetBaseSize(clonedScene);
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
      onDrag: (pos, rot) => {
        const movingFurniture = furnitures.find((f) => f.id === id);
        if (!movingFurniture) return;

        const staticFurnitures = furnitures.filter((f) => f.id !== id);

        const simulatedFurniture = {
          ...movingFurniture,
          positionX: pos.x,
          positionY: pos.y,
          positionZ: pos.z,
        };

        const targetPosition = new THREE.Vector3(pos.x, pos.y, pos.z);
        const previousPosition = new THREE.Vector3(...currentPosition);

        const newPos = resolveMultipleCollisions(
          simulatedFurniture,
          createBoundingBox(simulatedFurniture, undefined, targetPosition),
          staticFurnitures,
          targetPosition,
          previousPosition,
        );

        setCurrentPosition([newPos.x, newPos.y, newPos.z]);
        updateFurniture(id, {
          positionX: newPos.x,
          positionY: newPos.y,
          positionZ: newPos.z,
          rotationY: rot?.y,
        });
      },
      onDragEnd: (pos, rot) => {
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

  useCursorOnDrag(isDragging, setIsDragging);

  const handlePointerOver = () => {
    if (!isDragging) document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    if (!isDragging) document.body.style.cursor = 'auto';
  };

  const handlePointerDown = () => {
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
    selectFurniture(id);
  };

  useEffect(() => {
    if (!baseSizeRaw) return;
    const [x, , z] = baseSizeRaw;
    const baseX = Math.round(x * 1000);
    const baseZ = Math.round(z * 1000);
    useFurnitureStore.getState().updateBaseSize(id, { baseX, baseZ });
  }, [baseSizeRaw]);

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

  const updateGlassMaterial = (isDay: boolean) => {
    if (glassMaterialRef.current) {
      if (isDay) {
        glassMaterialRef.current.color.setHex(0xffffff);
        glassMaterialRef.current.emissive.setHex(0xfff8e1);
        glassMaterialRef.current.emissiveIntensity = 0.8;
      } else {
        glassMaterialRef.current.color.setHex(0x1a237e);
        glassMaterialRef.current.emissive.setHex(0x0d1b69);
        glassMaterialRef.current.emissiveIntensity = 0.1;
      }
    }
  };

  useEffect(() => {
    updateGlassMaterial(isDay);
  }, [isDay]);

  useEffect(() => {
    if (!isSelected || !baseSizeWithScale || hasInitialized.current) return;
    const curScaleX = currentScale[0];
    const curScaleY = currentScale[1];
    const curScaleZ = currentScale[2];

    const baseX = Math.round(baseSizeWithScale[0] * (curScaleX / scaleX));
    const baseY = Math.round(baseSizeWithScale[1] * (curScaleY / scaleY));
    const baseZ = Math.round(baseSizeWithScale[2] * (curScaleZ / scaleZ));

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
      originalPositionX: positionX,
      originalPositionY: positionY,
      originalPositionZ: positionZ,
      originalScaleX: scaleX,
      originalScaleY: scaleY,
      originalScaleZ: scaleZ,
      originalRotationY: rotationY,
      originalBaseX: baseSizeWithScale[0],
      originalBaseY: baseSizeWithScale[1],
      originalBaseZ: baseSizeWithScale[2],
    });

    hasInitialized.current = true;
  }, [isSelected, baseSizeWithScale]);

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

export default memo(FurnitureModel);
