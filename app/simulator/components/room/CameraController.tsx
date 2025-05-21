'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';

import { useViewStore } from '@/stores/useViewStore';

interface CameraControllerProps {
  width: number;
  height: number;
}

export default function CameraController({
  width,
  height,
}: CameraControllerProps) {
  const { camera } = useThree();
  const angle = useViewStore((s) => s.angle);
  const isTopView = useViewStore((s) => s.isTopView);

  useEffect(() => {
    const centerX = width / 2;
    const centerZ = height / 2;

    const baseRoomSize = 4.07;

    // 방 크기에 따른 비율 계산
    const scaleFactor = Math.max(width, height) / baseRoomSize;

    // 방 크기에 따라 카메라 거리 동적 계산
    const roomDiagonal = Math.sqrt(width * width + height * height);

    // 방 크기가 커져도 보이는 크기가 비슷하게 유지되도록 조정
    const cameraDistance = isTopView ? roomDiagonal * 0.8 : roomDiagonal * 1.2;

    if (isTopView) {
      const topViewHeight = Math.max(width, height) * 2;
      camera.position.y = topViewHeight;

      const rad = (angle * Math.PI) / 180;
      const r = 0.001;
      const x = centerX + r * Math.sin(rad);
      const z = centerZ + r * Math.cos(rad);

      camera.position.x = x;
      camera.position.z = z;
    } else {
      const rad = (angle * Math.PI) / 180;
      const r = cameraDistance;
      const x = centerX + r * Math.sin(rad);
      const z = centerZ + r * Math.cos(rad);

      camera.position.x = x;
      camera.position.y = cameraDistance * 0.7;
      camera.position.z = z;
    }

    // FOV 조정 (방이 커질수록 FOV는 좁아짐 - 망원경 효과)
    if (camera instanceof PerspectiveCamera) {
      // 기본 FOV는 50도, 방 크기에 따라 조정
      camera.fov = Math.max(50 / Math.pow(scaleFactor, 0.6), 25);
    }

    camera.lookAt(centerX, 0.5, centerZ);
    camera.updateProjectionMatrix();
  }, [angle, isTopView, width, height, camera]);

  return null;
}
