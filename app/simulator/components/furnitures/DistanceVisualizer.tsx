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
    setTick((t) => (t + 1) % 10000);
  });

  const selected = useMemo(
    () => furnitures.find((f) => f.id === selectedId),
    [furnitures, selectedId],
  );
  const others = useMemo(
    () => furnitures.filter((f) => f.id !== selectedId),
    [furnitures, selectedId],
  );
  if (!selected || selected.placementType === 'wall') return null;
  if (!selected) return null;

  const lines = [];

  const selectedBox = createBoundingBox(selected);
  const selectedCenter = selectedBox.getCenter(new Vector3());
  const selectedMin = selectedBox.min;
  const selectedMax = selectedBox.max;

  // 가구와 가구 간 거리
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
  const wallPoints: [string, Vector3, Vector3][] = [
    [
      'left',
      new Vector3(selectedMin.x, selectedCenter.y, selectedCenter.z),
      new Vector3(0, selectedCenter.y, selectedCenter.z),
    ],
    [
      'right',
      new Vector3(selectedMax.x, selectedCenter.y, selectedCenter.z),
      new Vector3(roomWidth, selectedCenter.y, selectedCenter.z),
    ],
    [
      'front',
      new Vector3(selectedCenter.x, selectedCenter.y, selectedMin.z),
      new Vector3(selectedCenter.x, selectedCenter.y, 0),
    ],
    [
      'back',
      new Vector3(selectedCenter.x, selectedCenter.y, selectedMax.z),
      new Vector3(selectedCenter.x, selectedCenter.y, roomHeight),
    ],
  ];

  for (const [label, from, to] of wallPoints) {
    const distance = from.distanceTo(to);
    if (distance < maxDistance) {
      lines.push(
        <DistanceLine
          key={`wall-${label}`}
          from={[from.x, from.y, from.z]}
          to={[to.x, to.y, to.z]}
          color='red'
        />,
      );
    }
  }

  return <>{lines}</>;
}
