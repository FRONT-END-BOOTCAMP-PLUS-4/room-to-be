// app/simulator/components/environment/SkyBackground.tsx
'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { Color } from 'three';
import { useLightingStore } from '@/stores/useLightingStore';

export default function SkyBackground() {
  const { scene } = useThree();
  const isDay = useLightingStore((state) => state.isDay);

  useEffect(() => {
    if (isDay) {
      // 낮 - 밝은 하늘색
      scene.background = new Color('#a7c6ed');
    } else {
      // 밤 - 어두운 남색
      scene.background = new Color('#081326');
    }
  }, [isDay, scene]);

  return null;
}
