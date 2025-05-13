'use client';

import { useEffect } from 'react';
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
  scale?: number; // 크기 비율 (기본값: 1)
}

export default function FurnitureModel({
  id,
  name,
  modelUrl,
  thumbnailUrl,
  // TODO : 드래그 드롭했을 때의 좌표값으로 지정 필요
  position=[0,0,0],
  rotationY=0,
  scale=1,
}: FurnitureModelProps) {
  const { scene } = useGLTF(modelUrl);
  const { selectFurniture, selectedFurniture } = useFurnitureStore();
  // TODO : 가구 중복 사용 가능한 지 여부 확인 후 수정 필요
  const isSelected = selectedFurniture?.id === id;

  useEffect(() => {
    scene.traverse((child: any) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;

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
  }, [scene, isSelected]);

  return (
    <primitive
      object={scene}
      position={position}
      rotation={[0, rotationY, 0]}
      scale={[scale, scale, scale]}
      onClick={(e: any) => {
        e.stopPropagation(); 
        selectFurniture({
          id,
          name,
          thumbnailUrl,
          position,
          rotationY,
          scale,
        });
      }}
    />
  );
}