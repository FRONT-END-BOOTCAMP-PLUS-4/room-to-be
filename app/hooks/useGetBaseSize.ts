import { useEffect, useState } from 'react';
import * as THREE from 'three';
import formatToThreeDigitInt from './useFormatToThreeDigitInt';

// 주어진 씬에서 무시할 메시 제외하고 박스 크기 계산하는 훅 (세 자리 정수 mm)
export default function useGetBaseSize(scene: THREE.Object3D | null) {
  const [baseSize, setBaseSize] = useState<[number, number, number] | null>(null);

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

    setBaseSize([
      formatToThreeDigitInt(size.x),
      formatToThreeDigitInt(size.y),
      formatToThreeDigitInt(size.z),
    ]);
  }, [scene]);

  return baseSize;
}