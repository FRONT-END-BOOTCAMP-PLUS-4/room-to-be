'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Color } from 'three';

import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { useLightingStore } from '@/stores/useLightingStore';

export default function BackgroundBackground() {
  const { scene } = useThree();
  const isDay = useLightingStore((s) => s.isDay);
  const getCurrentBackground = useBackgroundStore(
    (s) => s.getCurrentBackground,
  );
  const currentBackgroundId = useBackgroundStore((s) => s.currentBackgroundId);
  const prevBackgroundRef = useRef<string | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const Background = getCurrentBackground();
    const targetColor = isDay
      ? Background.dayBackground
      : Background.nightBackground;

    // 현재 배경색 저장
    const currentColor = prevBackgroundRef.current || targetColor;
    prevBackgroundRef.current = targetColor;

    // 색상 애니메이션 효과
    let startTime = performance.now();
    const duration = 300;

    // 시작 색상과 타겟 색상 생성
    const startColor = new Color(currentColor);
    const endColor = new Color(targetColor);

    // 애니메이션 함수
    function animateColor() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 색상 보간
      const currentR = startColor.r + (endColor.r - startColor.r) * progress;
      const currentG = startColor.g + (endColor.g - startColor.g) * progress;
      const currentB = startColor.b + (endColor.b - startColor.b) * progress;

      scene.background = new Color(currentR, currentG, currentB);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateColor);
      }
    }

    animateColor();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      prevBackgroundRef.current = targetColor;
    };
  }, [isDay, getCurrentBackground, scene, currentBackgroundId]);

  return null;
}
