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
}

export default function CameraController({
  width,
  height,
  isCaptureMode = false,
  initialCameraPosition,
  onIntroEnd,
}: CameraControllerProps) {
  const { camera } = useThree();
  const setCameraPosition = useCameraStore((s) => s.setPosition);
  const angle = useViewStore((s) => s.angle);
  const setAngle = useViewStore((s) => s.setAngle);
  const isTopView = useViewStore((s) => s.isTopView);

  const [introCompleted, setIntroCompleted] = useState(false);
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

  useEffect(() => {
    // edit 모드 진입 직후 angle 추정
    if (hasInitial) {
      const [x, , z] = initialCameraPosition!;
      const dx = x - centerX;
      const dz = z - centerZ;
      const rad = Math.atan2(dx, dz); // z가 앞쪽 기준
      const deg = (rad * 180) / Math.PI;
      const normalized = ((deg % 360) + 360) % 360;
      setAngle(normalized);
    }
  }, [initialCameraPosition]);

  useEffect(() => {
    const targetPosition = getTargetPosition();

    if (isCaptureMode) {
      camera.position.copy(targetPosition);
      camera.lookAt(targetLookAt);
      setCameraPosition([targetPosition.x, targetPosition.y, targetPosition.z]);
      if (camera instanceof PerspectiveCamera) {
        camera.fov = Math.max(50 / Math.pow(scaleFactor, 0.6), 25);
        camera.updateProjectionMatrix();
      }
      return;
    }

    if (!introCompleted) {
      let startPosition: Vector3;
      if (hasInitial) {
        const offsetDir = new Vector3()
          .subVectors(targetLookAt, new Vector3(...initialCameraPosition!))
          .normalize()
          .multiplyScalar(5);
        startPosition = new Vector3(...initialCameraPosition!).add(offsetDir);
        startPosition.y += 3;
      } else {
        const dist = roomDiagonal * 5;
        const height = roomDiagonal * 3;
        const rad = (angle * Math.PI) / 180;
        startPosition = new Vector3(
          centerX + dist * Math.sin(rad),
          height,
          centerZ + dist * Math.cos(rad),
        );
      }

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
          onIntroEnd?.();
          setCameraPosition([
            targetPosition.x,
            targetPosition.y,
            targetPosition.z,
          ]);
        }

        const eased = 1 - Math.pow(1 - progress, 3);
        camera.position.lerpVectors(startPosition, targetPosition, eased);
        camera.lookAt(targetLookAt);

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
  }, [camera, angle, isTopView, isCaptureMode, width, height]);

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
  }, [angle, isTopView, introCompleted]);

  return null;
}
