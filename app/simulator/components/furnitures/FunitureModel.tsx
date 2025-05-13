'use client';

import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

interface FurnitureModelProps {
  modelUrl: string; // DB에서 가져온 glb 파일 url
  position?: [number, number, number]; // 기본값 [0,0,0], 위치 정보
  rotationY?: number; // Y축 기준 회전 각도 (기본값: 0)
  scale?: number; // 크기 비율 (기본값: 1)
}

export default function FurnitureModel({
  modelUrl,
  // TODO : 드래그 드롭했을 때의 좌표값으로 지정 필요
  position,
  rotationY,
  scale,
}: FurnitureModelProps) {
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={position}
      rotation={[0, rotationY, 0]}
      scale={[scale, scale, scale]}
    />
  );
}

