import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { ArrowHelper, Color, Vector3 } from 'three';
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
  const direction = useMemo(
    () => end.clone().sub(start).normalize(),
    [start, end],
  );
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

  const arrow = useMemo(() => {
    const dir = direction.clone();
    const arrowLength = 0.3;
    const headLength = 0.2;
    const headWidth = 0.1;

    // 끝점에서 dir 방향으로 약간 뒤로 이동한 위치
    const arrowStart = end.clone().sub(dir.clone().multiplyScalar(arrowLength));

    const arrowHelper = new ArrowHelper(
      dir,
      arrowStart,
      arrowLength,
      new Color(color),
      headLength,
      headWidth,
    );

    // material 처리
    if (Array.isArray(arrowHelper.line.material)) {
      arrowHelper.line.material.forEach((mat) => (mat.depthTest = false));
    } else {
      arrowHelper.line.material.depthTest = false;
    }
    if (Array.isArray(arrowHelper.cone.material)) {
      arrowHelper.cone.material.forEach((mat) => (mat.depthTest = false));
    } else {
      arrowHelper.cone.material.depthTest = false;
    }

    return arrowHelper;
  }, [direction, end, color]);

  return (
    <group>
      <Line
        points={[from, to]}
        color={color}
        dashed
        dashSize={0.1}
        gapSize={0.05}
      />
      <primitive object={arrow} />
      <primitive object={sprite} />
    </group>
  );
}
