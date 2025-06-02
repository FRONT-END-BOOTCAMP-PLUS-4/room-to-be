'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
type Props = {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
};

export default function DistanceLine({ from, to, color = 'black' }: Props) {
  const start = useMemo(() => new Vector3(...from), [from]);
  const end = useMemo(() => new Vector3(...to), [to]);
  const distance = useMemo(() => start.distanceTo(end), [start, end]);
  const mid = useMemo(() => start.clone().lerp(end, 0.5), [start, end]);

  const sprite = useMemo(() => {
    const text = new SpriteText(`${Math.round(distance * 100)}cm`);
    text.color = color;
    text.textHeight = 0.15;
    text.position.set(mid.x, mid.y + 0.2, mid.z);
    text.renderOrder = 999;
    (text.material as THREE.Material).depthTest = false;
    return text;
  }, [distance, color, mid]);

  return (
    <group>
      <Line
        points={[from, to]}
        color={color}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      <primitive object={sprite} />
    </group>
  );
}
