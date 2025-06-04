'use client';

import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface Props {
  position: [number, number, number];
  color?: string;
}

export default function FloatingWarning({ position, color = 'orange' }: Props) {
  const ref = useRef<Group>(null);
  const opacityRef = useRef(1);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t;
      ref.current.position.y = position[1] + Math.sin(t * 2) * 0.1;

      if (color === 'red') {
        //math.sin(t*) 이쪽 조절로 shine 속도조절
        const alpha = 0.65 + 0.35 * Math.sin(t * 12);
        opacityRef.current = alpha;
      } else {
        opacityRef.current = 1;
      }

      const textMesh = ref.current.children[0] as any;
      if (textMesh?.material) {
        textMesh.material.opacity = opacityRef.current;
        textMesh.material.transparent = true;
      }
    }
  });

  return (
    <group ref={ref} position={position}>
      <Text fontSize={0.5} color={color} anchorX='center' anchorY='middle'>
        ⚠️
      </Text>
    </group>
  );
}
