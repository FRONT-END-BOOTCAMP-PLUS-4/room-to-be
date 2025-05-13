'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useViewStore } from '@/stores/useViewStore';

interface CameraControllerProps {
  width: number;
  height: number;
}

export default function CameraController({ width, height }: CameraControllerProps) {
  const { camera } = useThree();
  const angle = useViewStore((s) => s.angle);

  useEffect(() => {
    const r = 7;
    const centerX = width / 2;
    const centerZ = height / 2;

    if (angle === -1) {
      camera.position.set(centerX, 10, centerZ + 0.01); // 탑뷰는 살짝 위
    } else {
      const rad = (angle * Math.PI) / 180;
      const x = centerX + r * Math.sin(rad);
      const z = centerZ + r * Math.cos(rad);
      camera.position.set(x, 5, z);
    }

    camera.lookAt(centerX, 0, centerZ); // ✅ 항상 방의 중심 바라봄
    camera.updateProjectionMatrix();
  }, [angle, width, height]);

  return null;
}
