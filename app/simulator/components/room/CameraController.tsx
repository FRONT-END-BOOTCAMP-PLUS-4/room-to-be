'use client';

import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import * as THREE from 'three';

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

  const [introCompleted, setIntroCompleted] = useState(false);
  const animationIdRef = useRef<number>();

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

    // 최종 카메라 위치 계산
    let targetPosition = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3(centerX, 0.5, centerZ);

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

    // 첫 진입 시에만 애니메이션 실행
    if (!introCompleted) {
      // 시작 위치: 매우 멀리서 시작
      const startDistance = roomDiagonal * 5;
      const startHeight = roomDiagonal * 3;
      const startRad = (angle * Math.PI) / 180;

      const startPosition = new THREE.Vector3(
        centerX + startDistance * Math.sin(startRad),
        startHeight,
        centerZ + startDistance * Math.cos(startRad),
      );

      // 카메라 초기 설정
      camera.position.copy(startPosition);
      camera.lookAt(targetLookAt);

      if (camera instanceof PerspectiveCamera) {
        camera.fov = 90; // 매우 넓은 시야각으로 시작
        camera.updateProjectionMatrix();
      }

      // 애니메이션 실행
      const startTime = performance.now();
      const duration = 2500; // 2.5초

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        let progress = elapsed / duration;

        if (progress >= 1) {
          progress = 1;
          setIntroCompleted(true);
        }

        // 부드러운 easing (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);

        // 위치 보간
        camera.position.lerpVectors(startPosition, targetPosition, eased);
        camera.lookAt(targetLookAt);

        // FOV 보간
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
    }
    // 애니메이션 완료 후 일반 업데이트
    else {
      camera.position.copy(targetPosition);
      camera.lookAt(targetLookAt);

      // FOV 조정 (방이 커질수록 FOV는 좁아짐 - 망원경 효과)
      if (camera instanceof PerspectiveCamera) {
        // 기본 FOV는 50도, 방 크기에 따라 조정
        camera.fov = Math.max(50 / Math.pow(scaleFactor, 0.6), 25);
        camera.updateProjectionMatrix();
      }
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [angle, isTopView, width, height, camera, introCompleted]);

  return null;
}
