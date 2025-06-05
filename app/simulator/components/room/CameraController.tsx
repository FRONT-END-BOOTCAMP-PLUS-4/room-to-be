'use client';

import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';

import { useCameraStore } from '@/stores/useCameraStore';
import { useViewStore } from '@/stores/useViewStore';

interface CameraControllerProps {
  width: number;
  height: number;
  isCaptureMode?: boolean;
  initialCameraPosition?: [number, number, number];
  onIntroEnd?: () => void;
  shouldStartIntro?: boolean;
}

export default function CameraController({
  width,
  height,
  isCaptureMode = false,
  initialCameraPosition,
  onIntroEnd,
  shouldStartIntro = false,
}: CameraControllerProps) {
  const { camera } = useThree();
  const setCameraPosition = useCameraStore((s) => s.setPosition);
  const angle = useViewStore((s) => s.angle);
  const setAngle = useViewStore((s) => s.setAngle);
  const isTopView = useViewStore((s) => s.isTopView);

  const [introCompleted, setIntroCompleted] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const animationIdRef = useRef<number>();

  const centerX = width / 2;
  const centerZ = height / 2;
  const targetLookAt = new Vector3(centerX, 0.5, centerZ);
  const baseRoomSize = 4.07;
  const scaleFactor = Math.max(width, height) / baseRoomSize;
  const roomDiagonal = Math.sqrt(width * width + height * height);
  const cameraDistance = isTopView ? roomDiagonal * 0.8 : roomDiagonal * 1.2;

  const hasInitial =
    Array.isArray(initialCameraPosition) &&
    initialCameraPosition.length === 3 &&
    initialCameraPosition.every((v) => typeof v === 'number' && !isNaN(v));

  const getTargetPosition = () => {
    const rad = (angle * Math.PI) / 180;
    if (isTopView) {
      const h = Math.max(width, height) * 2;
      const r = 0.001;
      const x = centerX + r * Math.sin(rad);
      const z = centerZ + r * Math.cos(rad);
      return new Vector3(x, h, z);
    } else {
      const r = cameraDistance;
      const x = centerX + r * Math.sin(rad);
      const z = centerZ + r * Math.cos(rad);
      return new Vector3(x, cameraDistance * 0.7, z);
    }
  };

  // 카메라 초기 위치 설정 (애니메이션 시작 전)
  useEffect(() => {
    if (!cameraInitialized && !isCaptureMode) {
      let startPosition: Vector3;
      let targetAngle = angle;

      if (hasInitial) {
        // edit 모드: 저장된 카메라 위치로부터 각도 계산
        const [x, , z] = initialCameraPosition!;
        const dx = x - centerX;
        const dz = z - centerZ;
        const rad = Math.atan2(dx, dz);
        const deg = (rad * 180) / Math.PI;
        const normalized = ((deg % 360) + 360) % 360;
        targetAngle = normalized;
        setAngle(normalized);
      }

      // 항상 멀리서 시작하도록 수정
      const farDistance = roomDiagonal * 4; // 더 멀리서 시작
      const startHeight = roomDiagonal * 2.5; // 높이도 충분히
      const rad = (targetAngle * Math.PI) / 180;
      
      startPosition = new Vector3(
        centerX + farDistance * Math.sin(rad),
        startHeight,
        centerZ + farDistance * Math.cos(rad),
      );

      // 카메라를 시작 위치에 고정 (애니메이션 시작 전까지)
      camera.position.copy(startPosition);
      camera.lookAt(targetLookAt);
      if (camera instanceof PerspectiveCamera) {
        camera.fov = 90;
        camera.updateProjectionMatrix();
      }

      setCameraInitialized(true);
    }
  }, [
    camera,
    cameraInitialized,
    isCaptureMode,
    hasInitial,
    initialCameraPosition,
    angle,
    centerX,
    centerZ,
    roomDiagonal,
    targetLookAt,
    setAngle,
  ]);

  // 애니메이션 시작
  useEffect(() => {
    if (
      shouldStartIntro &&
      !introStarted &&
      cameraInitialized &&
      !isCaptureMode
    ) {
      setIntroStarted(true);

      const targetPosition = getTargetPosition();
      const startPosition = camera.position.clone();

      const startTime = performance.now();
      const duration = 2500;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        let progress = elapsed / duration;
        if (progress >= 1) {
          progress = 1;
          setIntroCompleted(true);
          onIntroEnd?.();
          setCameraPosition([
            targetPosition.x,
            targetPosition.y,
            targetPosition.z,
          ]);
        }

        // 부드러운 easing 함수 사용
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // 위치 보간
        camera.position.lerpVectors(startPosition, targetPosition, eased);
        camera.lookAt(targetLookAt);

        // FOV 보간
        if (camera instanceof PerspectiveCamera) {
          const targetFov = Math.max(50 / Math.pow(scaleFactor, 0.6), 25);
          camera.fov = MathUtils.lerp(90, targetFov, eased);
          camera.updateProjectionMatrix();
        }

        if (progress < 1) {
          animationIdRef.current = requestAnimationFrame(animate);
        }
      };

      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, [
    shouldStartIntro,
    introStarted,
    cameraInitialized,
    isCaptureMode,
    camera,
    getTargetPosition,
    targetLookAt,
    scaleFactor,
    onIntroEnd,
    setCameraPosition,
  ]);

  // 애니메이션 완료 후 일반적인 카메라 제어
  useEffect(() => {
    if (!introCompleted || isCaptureMode) return;

    const targetPosition = getTargetPosition();
    camera.position.copy(targetPosition);
    camera.lookAt(targetLookAt);
    if (camera instanceof PerspectiveCamera) {
      const targetFov = Math.max(50 / Math.pow(scaleFactor, 0.6), 25);
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
    setCameraPosition([targetPosition.x, targetPosition.y, targetPosition.z]);
  }, [
    angle,
    isTopView,
    introCompleted,
    isCaptureMode,
    getTargetPosition,
    camera,
    targetLookAt,
    scaleFactor,
    setCameraPosition,
  ]);

  // 캡처 모드 처리
  useEffect(() => {
    if (isCaptureMode) {
      const targetPosition = getTargetPosition();
      camera.position.copy(targetPosition);
      camera.lookAt(targetLookAt);
      setCameraPosition([targetPosition.x, targetPosition.y, targetPosition.z]);
      if (camera instanceof PerspectiveCamera) {
        camera.fov = Math.max(50 / Math.pow(scaleFactor, 0.6), 25);
        camera.updateProjectionMatrix();
      }
    }
  }, [
    isCaptureMode,
    getTargetPosition,
    camera,
    targetLookAt,
    scaleFactor,
    setCameraPosition,
  ]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return null;
}