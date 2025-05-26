'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { CanvasTexture } from 'three';
import * as THREE from 'three';

import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { useLightingStore } from '@/stores/useLightingStore';

// Canvas로 그라데이션 텍스처 생성하는 함수
function createGradientTexture(colors: string[]): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas context not available');
  }

  // 세로 그라데이션
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);

  // 색상 스톱 추가
  colors.forEach((color, index) => {
    const stop = index / (colors.length - 1);
    gradient.addColorStop(stop, color);
  });

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;

  // 부드러운 보간을 위한 설정
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

export default function BackgroundBackground() {
  const { scene } = useThree();
  const isDay = useLightingStore((s) => s.isDay);
  const getCurrentBackground = useBackgroundStore(
    (s) => s.getCurrentBackground,
  );
  const currentBackgroundId = useBackgroundStore((s) => s.currentBackgroundId);
  const currentTextureRef = useRef<CanvasTexture | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const Background = getCurrentBackground();
    const targetColor = isDay
      ? Background.dayBackground
      : Background.nightBackground;

    const newTexture = createGradientTexture(targetColor);

    if (currentTextureRef.current && scene.background) {
      if (currentTextureRef.current) {
        currentTextureRef.current.dispose();
      }
    }

    scene.background = newTexture;
    currentTextureRef.current = newTexture;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDay, getCurrentBackground, scene, currentBackgroundId]);

  useEffect(() => {
    return () => {
      if (currentTextureRef.current) {
        currentTextureRef.current.dispose();
      }
    };
  });

  return null;
}
