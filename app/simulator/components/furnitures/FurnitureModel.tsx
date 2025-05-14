'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFurnitureStore } from '@/stores/useFurnitureStore';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface FurnitureModelProps {
  id: string;
  name: string;
  modelUrl: string; // DB에서 가져온 glb 파일 url
  thumbnailUrl: string;
  position?: [number, number, number]; // 기본값 [0,0,0], 위치 정보
  rotationY?: number; // Y축 기준 회전 각도 (기본값: 0)
  scale?: number; // 크기 비율 (기본값: 1)
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
  // TODO : 드래그 드롭했을 때의 좌표값으로 지정 필요
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  roomBoundary,
}: FurnitureModelProps) {
  const gltf = useGLTF(modelUrl);
  // scene을 깊은 복사하여 독립된 인스턴스로 사용
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const meshRef = useRef<THREE.Group>(null);

  const { selectFurniture, selectedFurniture } = useFurnitureStore();
  const isSelected = selectedFurniture?.id === id;

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
    console.log(meshRef.current)

    const pos = meshRef.current?.position;
    if (pos) {
      selectFurniture({
        id,
        name,
        thumbnailUrl,
        position: [pos.x, pos.y, pos.z],
        rotationY,
        scale,
      });
    }
  };

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      scale={scale}
      rotation-y={rotationY}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
    />
  );
}
