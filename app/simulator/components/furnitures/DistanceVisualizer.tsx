'use client';

import { useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box3, Vector3 } from 'three';

import { createBoundingBox } from '@/utils/collisionUtils';

import { useFurnitureStore } from '@/stores/useFurnitureStore';

import DistanceLine from './DistanceLine';

interface Props {
  roomWidth?: number;
  roomHeight?: number;
  maxDistance?: number;
}

// 바운딩 박스 간 최소 거리 계산 (겉면 기준)
function getMinDistanceBetweenBoxes(box1: Box3, box2: Box3): number {
  const pointA = box1.clampPoint(box2.getCenter(new Vector3()), new Vector3());
  const pointB = box2.clampPoint(box1.getCenter(new Vector3()), new Vector3());
  return pointA.distanceTo(pointB);
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
    setTick((t) => (t + 1) % 10000); // 강제 리렌더
  });

  const selected = useMemo(
    () => furnitures.find((f) => f.id === selectedId),
    [furnitures, selectedId],
  );
  const others = useMemo(
    () =>
      furnitures.filter(
        (f) => f.id !== selectedId && f.placementType === 'floor',
      ),
    [furnitures, selectedId],
  );
  if (!selected || selected.placementType === 'wall') return null;
  if (!selected) return null;

  const lines = [];

  // 선택된 가구의 바운딩 박스
  const selectedBox = createBoundingBox(selected);

  for (const f of others) {
    const otherBox = createBoundingBox(f);
    const distance = getMinDistanceBetweenBoxes(selectedBox, otherBox);

    if (distance < maxDistance) {
      const pointA = selectedBox.clampPoint(
        otherBox.getCenter(new Vector3()),
        new Vector3(),
      );
      const pointB = otherBox.clampPoint(
        selectedBox.getCenter(new Vector3()),
        new Vector3(),
      );

      lines.push(
        <DistanceLine
          key={`to-${f.id}`}
          from={[pointA.x, pointA.y, pointA.z]}
          to={[pointB.x, pointB.y, pointB.z]}
          color='red'
        />,
      );
    }
  }

  // 벽과의 거리
  const selectedPos: [number, number, number] = [
    selected.positionX,
    selected.positionY,
    selected.positionZ,
  ];
  const wallThickness = 0.1;

  const wallPoints: [string, [number, number, number]][] = [
    ['left', [wallThickness / 2, selected.positionY, selected.positionZ]],
    [
      'right',
      [roomWidth - wallThickness / 2, selected.positionY, selected.positionZ],
    ],
    ['front', [selected.positionX, selected.positionY, wallThickness / 2]],
    [
      'back',
      [selected.positionX, selected.positionY, roomHeight - wallThickness / 2],
    ],
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
