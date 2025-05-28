/* eslint-disable */
// @ts-nocheck
// RoomShadow.tsx - 부드러운 그림자 전용 컴포넌트
'use client';

import { useEffect, useRef } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

import { useLightingStore } from '@/stores/useLightingStore';

// 부드러운 그림자 셰이더
const SoftShadowMaterial = shaderMaterial(
  {
    uShadowOpacity: 0.3,
    uRoomWidth: 4.0,
    uRoomHeight: 4.0,
    uShadowFadeDistance: 1.5,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uShadowOpacity;
    uniform float uRoomWidth;
    uniform float uRoomHeight;
    uniform float uShadowFadeDistance;
    
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vec2 currentPos = vec2(vWorldPosition.x, vWorldPosition.z);
      
      // 방 영역 계산
      vec2 roomMin = vec2(0.0, 0.0);
      vec2 roomMax = vec2(uRoomWidth, uRoomHeight);
      
      // 방 내부인지 확인
      bool insideRoom = currentPos.x >= roomMin.x && currentPos.x <= roomMax.x && 
                        currentPos.y >= roomMin.y && currentPos.y <= roomMax.y;
      
      if (insideRoom) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
      }
      
      // 방 가장자리에서 현재 위치까지의 최단 거리
      vec2 distToRoom = max(roomMin - currentPos, currentPos - roomMax);
      distToRoom = max(distToRoom, 0.0);
      float distanceFromRoom = length(distToRoom);
      
      // 매우 부드럽고 자연스러운 페이드
      float shadowStrength = 1.0 - smoothstep(0.0, uShadowFadeDistance, distanceFromRoom);
      
      // 부드러운 곡선으로 조정
      shadowStrength = pow(shadowStrength, 1.8);
      
      float alpha = shadowStrength * uShadowOpacity;
      
      gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
    }
  `,
);

extend({ SoftShadowMaterial });

type SoftShadowMaterialImpl = {
  uShadowOpacity: number;
  uRoomWidth: number;
  uRoomHeight: number;
  uShadowFadeDistance: number;
} & THREE.ShaderMaterial;

interface RoomShadowProps {
  roomWidth: number;
  roomHeight: number;
  shadowOpacity?: number;
  shadowFadeDistance?: number;
}

export default function RoomShadow({
  roomWidth,
  roomHeight,
  shadowOpacity = 0.4,
  shadowFadeDistance = 2.0,
}: RoomShadowProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<SoftShadowMaterialImpl>(null);
  const isDay = useLightingStore((s) => s.isDay);

  // 그림자 평면 크기 (방보다 훨씬 크게)
  const shadowPlaneSize = Math.max(roomWidth, roomHeight) * 4;

  useEffect(() => {
    if (materialRef.current) {
      const finalOpacity = isDay ? shadowOpacity * 0.8 : shadowOpacity;

      materialRef.current.uShadowOpacity = finalOpacity;
      materialRef.current.uRoomWidth = roomWidth;
      materialRef.current.uRoomHeight = roomHeight;
      materialRef.current.uShadowFadeDistance = shadowFadeDistance;
    }
  }, [isDay, shadowOpacity, shadowFadeDistance, roomWidth, roomHeight]);

  return (
    <mesh
      ref={meshRef}
      position={[roomWidth / 2, -0.01, roomHeight / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[shadowPlaneSize, shadowPlaneSize]} />
      <softShadowMaterial ref={materialRef} transparent depthWrite={false} />
    </mesh>
  );
}

// TypeScript 타입 확장
declare global {
  namespace JSX {
    interface IntrinsicElements {
      softShadowMaterial: any;
    }
  }
}
