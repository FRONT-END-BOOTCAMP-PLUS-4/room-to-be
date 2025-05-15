'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFurnitureStore } from '@/stores/useFurnitureStore';
import * as THREE from 'three';

interface FurnitureModelProps {
  id: string;
  name: string;
  modelUrl: string; // DB에서 가져온 glb 파일 url
  thumbnailUrl: string;
  position?: [number, number, number]; // 기본값 [0,0,0], 위치 정보
  rotationY?: number; // Y축 기준 회전 각도 (기본값: 0)
  scale?: [number, number, number]; // 크기 비율 (기본값: 0.1, 0.1, 0.1)
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
  // scene을 깊은 복사하여 독립된 인스턴스로 사용
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const meshRef = useRef<THREE.Group>(null);

  const { selectFurniture, selectedFurniture } = useFurnitureStore();
  const isSelected = selectedFurniture?.id === id;

  // 선택된 가구가 아닐 경우 scale 상태 관리
  const [currentScale, setCurrentScale] = useState(scale);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    clonedScene.traverse((child: any) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = child.material.clone();

      // 클릭 무시할 메쉬 이름들
      const ignoredNames = ['FLOOR', 'WALL', 'CEILING', 'GLASS'];
      const name = child.name?.toUpperCase?.() ?? '';
      if (ignoredNames.includes(name)) {
        child.raycast = () => null;
        return;
      }

      // 선택 여부에 따라 하이라이트 색상 적용
      const mat = child.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissive = new THREE.Color(isSelected ? 0x00ffff : 0x000000);
        mat.emissiveIntensity = isSelected ? 0.8 : 0;
      }
    });
  }, [clonedScene, isSelected]);

  const arraysAreEqual = (arr1: number[], arr2: number[]) => {
    return arr1.every((value, index) => value === arr2[index]);
  };

  useEffect(() => {
    if (
      isSelected &&
      selectedFurniture &&
      !arraysAreEqual(
        [
          selectedFurniture.scaleX,
          selectedFurniture.scaleY,
          selectedFurniture.scaleZ,
        ],
        currentScale,
      )
    ) {
      setCurrentScale([
        selectedFurniture.scaleX,
        selectedFurniture.scaleY,
        selectedFurniture.scaleZ,
      ]); // 선택되었을 때 외부 scale을 적용
    }
  }, [
    isSelected,
    selectedFurniture?.scaleX,
    selectedFurniture?.scaleY,
    selectedFurniture?.scaleZ,
    currentScale,
  ]);

  // 실제 사이즈 받아오는 로직
  const [baseSize, setBaseSize] = useState<[number, number, number] | null>(
    null,
  );

  useEffect(() => {
    const ignoredNames = ['FLOOR', 'WALL', 'CEILING', 'GLASS'];
    const boundingBox = new THREE.Box3();
    const tempBox = new THREE.Box3();

    // 초기화
    boundingBox.makeEmpty();

    // baseSize 계산용: 무시하지 않을 메쉬만 경계 계산
    clonedScene.traverse((child: any) => {
      if (!child.isMesh) return;

      const name = child.name?.toUpperCase?.() ?? '';
      if (ignoredNames.includes(name)) return;

      tempBox.setFromObject(child);
      boundingBox.union(tempBox); // 전체 경계에 추가
    });

    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    setBaseSize([Math.floor(size.x*10), Math.floor(size.y*10), Math.floor(size.z*10)]);
  }, [clonedScene]);

  // 커서 모양 바꾸는 로직
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = 'auto';
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

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
    rotationY,
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
      scale={currentScale} // 상태로 관리되는 scale 사용
      rotation-y={rotationY}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
    />
  );
}