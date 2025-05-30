'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import { useCameraStore } from '@/stores/useCameraStore';

export default function CameraTracker() {
  const { camera } = useThree();
  const setPosition = useCameraStore((s) => s.setPosition);

  useEffect(() => {
    let frameId: number;

    const update = () => {
      const { x, y, z } = camera.position;
      setPosition([x, y, z]); // store에 현재 위치 저장
      frameId = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(frameId);
  }, [camera, setPosition]);

  return null;
}
