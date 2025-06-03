import { useEffect, useState } from 'react';
import * as THREE from 'three';

import useFormatToThreeDigitInt from './useFormatToThreeDigitInt';

// 주어진 씬에서 무시할 메시 제외하고 박스 크기 계산하는 훅 (세 자리 정수 mm)
export default function useGetBaseSize(scene: THREE.Object3D | null) {
  // 포맷 적용 전 원본값 (scale 곱하기 전 값)
  const [baseSizeRaw, setBaseSizeRaw] = useState<
    [number, number, number] | null
  >(null);
  // 포맷 적용된 값
  const [baseSizeWithScale, setBaseSizeWithScale] = useState<
    [number, number, number] | null
  >(null);

  useEffect(() => {
    if (!scene) return;

    const ignoredNames = ['FLOOR', 'WALL', 'CEILING', 'GLASS'];
    const boundingBox = new THREE.Box3();
    const tempBox = new THREE.Box3();

    boundingBox.makeEmpty();

    scene.traverse((child: any) => {
      if (!child.isMesh) return;

      const name = child.name?.toUpperCase?.() ?? '';
      if (ignoredNames.includes(name)) return;

      tempBox.setFromObject(child);
      boundingBox.union(tempBox);
    });

    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    // 포맷 적용 전 사이즈 (scale 곱하기 전, raw 값)
    setBaseSizeRaw([size.x, size.y, size.z]);

    // scale과 size를 이용해 포맷 적용
    setBaseSizeWithScale([
      useFormatToThreeDigitInt(scene.scale.x, size.x),
      useFormatToThreeDigitInt(scene.scale.y, size.y),
      useFormatToThreeDigitInt(scene.scale.z, size.z),
    ]);
  }, [scene]);

  return {
    baseSizeWithScale,
    baseSizeRaw,
  };
}
