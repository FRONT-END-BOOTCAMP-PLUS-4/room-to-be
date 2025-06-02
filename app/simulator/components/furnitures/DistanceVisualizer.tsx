'use client';

import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

import { useFurnitureStore } from '@/stores/useFurnitureStore';

import DistanceLine from './DistanceLine';
interface Props {
  roomWidth?: number;
  roomHeight?: number;
  maxDistance?: number;
}

export default function DistanceVisualizer({
  roomWidth = 10,
  roomHeight = 10,
  maxDistance = 1.5,
}: Props) {
  const furnitures = useFurnitureStore((state) => state.furnitures);
  const selectedId = useFurnitureStore((state) => state.selectedFurnitureId);
  const [tick, setTick] = useState(0);

  useFrame(() => {
    setTick((t) => (t + 1) % 10000); // 리렌더 트리거
  });
  const selected = furnitures.find((f) => f.id === selectedId);
  if (!selected) return null;

  const selectedPos: [number, number, number] = [
    selected.positionX,
    selected.positionY,
    selected.positionZ,
  ];

  const lines = [];

  // 다른 가구와의 거리
  for (const f of furnitures) {
    if (f.id === selectedId) continue;
    const otherPos: [number, number, number] = [
      f.positionX,
      f.positionY,
      f.positionZ,
    ];

    const distance = new Vector3(...selectedPos).distanceTo(
      new Vector3(...otherPos),
    );
    if (distance < maxDistance) {
      lines.push(
        <DistanceLine
          key={`to-${f.id}`}
          from={selectedPos}
          to={otherPos}
          color='red'
        />,
      );
    }
  }

  // 벽과의 거리
  const wallPoints: [string, [number, number, number]][] = [
    ['left', [0, selected.positionY, selected.positionZ]],
    ['right', [roomWidth, selected.positionY, selected.positionZ]],
    ['front', [selected.positionX, selected.positionY, 0]],
    ['back', [selected.positionX, selected.positionY, roomHeight]],
  ];

  for (const [label, wallPos] of wallPoints) {
    const distance = new Vector3(...selectedPos).distanceTo(
      new Vector3(...wallPos),
    );
    if (distance < maxDistance) {
      lines.push(
        <DistanceLine
          key={`wall-${label}`}
          from={selectedPos}
          to={wallPos}
          color='red'
        />,
      );
    }
  }

  return <>{lines}</>;
}
