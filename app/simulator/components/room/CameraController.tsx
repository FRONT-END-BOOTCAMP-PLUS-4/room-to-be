'use client';

import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import * as THREE from 'three';

import { useViewStore } from '@/stores/useViewStore';

interface CameraControllerProps {
  width: number;
  height: number;
  isCaptureMode?: boolean;
}

export default function CameraController({
  width,
  height,
  isCaptureMode = false,
}: CameraControllerProps) {
  const { camera } = useThree();
  const angle = useViewStore((s) => s.angle);
  const isTopView = useViewStore((s) => s.isTopView);

  const [introCompleted, setIntroCompleted] = useState(false);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    const centerX = width / 2;
    const centerZ = height / 2;

    const baseRoomSize = 4.07;
    const scaleFactor = Math.max(width, height) / baseRoomSize;
    const roomDiagonal = Math.sqrt(width * width + height * height);
    const cameraDistance = isTopView ? roomDiagonal * 0.8 : roomDiagonal * 1.2;

    const targetLookAt = new THREE.Vector3(centerX, 0.5, centerZ);
    let targetPosition = new THREE.Vector3();

    if (isTopView) {
      const topViewHeight = Math.max(width, height) * 2;
      const rad = (angle * Math.PI) / 180;
      const r = 0.001;
      const x = centerX + r * Math.sin(rad);
      const z = centerZ + r * Math.cos(rad);
      targetPosition.set(x, topViewHeight, z);
    } else {
      const rad = (angle * Math.PI) / 180;
      const r = cameraDistance;
      const x = centerX + r * Math.sin(rad);
      const z = centerZ + r * Math.cos(rad);
      targetPosition.set(x, cameraDistance * 0.7, z);
    }

    //캡쳐모드
    if (isCaptureMode) {
      camera.position.copy(targetPosition);
      camera.lookAt(targetLookAt);
      if (camera instanceof PerspectiveCamera) {
        camera.fov = Math.max(50 / Math.pow(scaleFactor, 0.6), 25);
        camera.updateProjectionMatrix();
      }
      return;
    }

    // 처음 접근시에만 애니메이션 동작
    if (!introCompleted) {
      const startDistance = roomDiagonal * 5;
      const startHeight = roomDiagonal * 3;
      const startRad = (angle * Math.PI) / 180;

      const startPosition = new THREE.Vector3(
        centerX + startDistance * Math.sin(startRad),
        startHeight,
        centerZ + startDistance * Math.cos(startRad),
      );

      camera.position.copy(startPosition);
      camera.lookAt(targetLookAt);

      if (camera instanceof PerspectiveCamera) {
        camera.fov = 90;
        camera.updateProjectionMatrix();
      }

      const startTime = performance.now();
      const duration = 2500;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        let progress = elapsed / duration;

        if (progress >= 1) {
          progress = 1;
          setIntroCompleted(true);
        }

        const eased = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPosition, targetPosition, eased);
        camera.lookAt(targetLookAt);

        if (camera instanceof PerspectiveCamera) {
          const targetFov = Math.max(50 / Math.pow(scaleFactor, 0.6), 25);
          camera.fov = THREE.MathUtils.lerp(90, targetFov, eased);
          camera.updateProjectionMatrix();
        }

        if (progress < 1) {
          animationIdRef.current = requestAnimationFrame(animate);
        }
      };

      animationIdRef.current = requestAnimationFrame(animate);
    } else {
      camera.position.copy(targetPosition);
      camera.lookAt(targetLookAt);
      if (camera instanceof PerspectiveCamera) {
        camera.fov = Math.max(50 / Math.pow(scaleFactor, 0.6), 25);
        camera.updateProjectionMatrix();
      }
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [angle, isTopView, width, height, camera, introCompleted, isCaptureMode]);

  return null;
}
