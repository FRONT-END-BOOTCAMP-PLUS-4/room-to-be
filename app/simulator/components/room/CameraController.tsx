'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
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

    if (isTopView) {
      camera.position.y = 12;

      const rad = (angle * Math.PI) / 180;
      const r = 0.001;
      const x = centerX + r * Math.sin(rad);
      const z = centerZ + r * Math.cos(rad);

      camera.position.x = x;
      camera.position.z = z;
    } else {
      const r = 7;
      const rad = (angle * Math.PI) / 180;
      const x = centerX + r * Math.sin(rad);
      const z = centerZ + r * Math.cos(rad);

      camera.position.x = x;
      camera.position.y = 5;
      camera.position.z = z;
    }

    camera.lookAt(centerX, 0.5, centerZ); // ✅ 항상 방의 중심 바라봄
    camera.updateProjectionMatrix();
  }, [angle, isTopView, width, height]);

  return null;
}
