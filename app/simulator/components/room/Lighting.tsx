// app/simulator/components/room/Lighting.tsx
'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { useBackgroundStore } from '@/stores/useBackgroundStore';
import { useLightingStore } from '@/stores/useLightingStore';
import { useRoomSizeStore } from '@/stores/useRoomSizeStore';
import { useViewStore } from '@/stores/useViewStore';

/* eslint-disable */
// @ts-ignore
export default function Lighting() {
  const isDay = useLightingStore((s) => s.isDay);
  const getCurrentBackground = useBackgroundStore(
    (s) => s.getCurrentBackground,
  );
  const angle = useViewStore((s) => s.angle);
  const isTopView = useViewStore((s) => s.isTopView);
  const { width, height } = useRoomSizeStore();

  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const mainPointLightRef = useRef<THREE.PointLight>(null);
  const backLightRef = useRef<THREE.DirectionalLight>(null);

  const background = getCurrentBackground();

  const lightColor = isDay ? '#ffffff' : '#ffd89b';
  const lightIntensity = isDay ? 2.0 : 1.2;

  // 카메라 위치에 따라 조명 위치 업데이트
  useEffect(() => {
    const centerX = width / 2;
    const centerZ = height / 2;
    const roomDiagonal = Math.sqrt(width * width + height * height);

    if (isDay) {
      // 주 태양광을 카메라 뒤쪽에서 비추도록 설정
      if (directionalLightRef.current) {
        const rad = (angle * Math.PI) / 180;
        const lightDistance = roomDiagonal * 1.5;

        if (isTopView) {
          // 탑뷰일 때는 위에서 아래로
          directionalLightRef.current.position.set(
            centerX,
            roomDiagonal * 2,
            centerZ,
          );
        } else {
          // 3D 뷰일 때는 카메라 뒤쪽에서
          const lightX = centerX + lightDistance * Math.sin(rad + Math.PI);
          const lightZ = centerZ + lightDistance * Math.cos(rad + Math.PI);
          directionalLightRef.current.position.set(
            lightX,
            roomDiagonal * 0.8,
            lightZ,
          );
        }

        // 조명이 방 중심을 향하도록 설정
        directionalLightRef.current.target.position.set(centerX, 0, centerZ);
        directionalLightRef.current.target.updateMatrixWorld();
      }

      // 보조 조명도 각도에 맞춰 조정
      if (backLightRef.current) {
        const rad = (angle * Math.PI) / 180;
        const backLightDistance = roomDiagonal * 0.8;
        const backLightX = centerX + backLightDistance * Math.sin(rad);
        const backLightZ = centerZ + backLightDistance * Math.cos(rad);

        backLightRef.current.position.set(
          backLightX,
          roomDiagonal * 0.4,
          backLightZ,
        );
      }
    } else {
      // 밤 조명도 카메라 위치에 따라 조정
      if (mainPointLightRef.current) {
        const rad = (angle * Math.PI) / 180;
        const lightDistance = roomDiagonal * 0.7;

        if (isTopView) {
          mainPointLightRef.current.position.set(
            centerX,
            roomDiagonal * 1.2,
            centerZ,
          );
        } else {
          const lightX =
            centerX + lightDistance * Math.sin(rad + Math.PI * 0.7);
          const lightZ =
            centerZ + lightDistance * Math.cos(rad + Math.PI * 0.7);
          mainPointLightRef.current.position.set(
            lightX,
            roomDiagonal * 0.6,
            lightZ,
          );
        }
      }
    }
  }, [angle, isTopView, width, height, isDay]);

  return (
    <>
      {isDay ? (
        <>
          {/* 전체 씬 밝기용 기본 조명 */}
          <ambientLight intensity={0.8} color='#ffffff' />

          {/* 태양광 */}
          <directionalLight
            ref={directionalLightRef}
            intensity={lightIntensity}
            color={lightColor}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.1}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* 카메라 각도에 따른 보조 조명 */}
          <directionalLight
            ref={backLightRef}
            intensity={0.6}
            color='#ffffff'
          />

          <pointLight
            position={[width / 2, height * 0.5, height / 2]}
            intensity={0.4}
            color='#ffffff'
            distance={Math.max(width, height) * 2}
            decay={1}
          />
        </>
      ) : (
        <>
          {/* 밤에는 주변광 매우 약하게 설정 */}
          <ambientLight intensity={0.5} color='#d0d0e0' />

          {/* 카메라를 따라가는 주 조명 */}
          <pointLight
            ref={mainPointLightRef}
            intensity={lightIntensity * 1.2}
            color='#f5f5dc'
            castShadow
            distance={Math.max(width, height) * 2}
            decay={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* 보조 조명 */}
          <pointLight
            position={[width * 0.8, height * 0.4, height * 0.8]}
            intensity={0.3}
            color='#f5f5dc'
            distance={Math.max(width, height) * 1.5}
            decay={1}
          />

          <pointLight
            position={[width * 0.2, height * 0.4, height * 0.2]}
            intensity={0.25}
            color='#f5f5dc'
            distance={Math.max(width, height) * 1.5}
            decay={1.5}
          />

          {/* 전체 조명*/}
          <directionalLight
            position={[width / 2, height * 2, height / 2]}
            intensity={0.5}
            color='#f5f5dc'
          />
        </>
      )}
    </>
  );
}
