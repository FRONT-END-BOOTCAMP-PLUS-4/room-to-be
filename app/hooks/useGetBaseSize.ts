import { useEffect, useState } from 'react';
import * as THREE from 'three';

// 주어진 씬에서 무시할 메시 제외하고 박스 크기 계산하는 훅 (실제 mm 값 반환)
export default function useGetBaseSize(scene: THREE.Object3D | null) {
  const [baseSize, setBaseSize] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    if (!scene) return;

    // 무시할 mesh 이름 배열
    const ignoredNames = ['FLOOR', 'WALL', 'CEILING', 'GLASS'];
    // 전체 경계를 담을 Box3 객체 생성
    const boundingBox = new THREE.Box3();
    // 임시 경계 계산용 Box3 객체 생성
    const tempBox = new THREE.Box3();

    // boundingBox 빈 상태로 초기화
    boundingBox.makeEmpty();

    scene.traverse((child: any) => {
      if (!child.isMesh) return;

      const name = child.name?.toUpperCase?.() ?? '';
      if (ignoredNames.includes(name)) return;

      // 임시경계에 mesh 포함시키고, boundingBox와 합침
      tempBox.setFromObject(child);
      boundingBox.union(tempBox);
    });

    // 경계 크기를 저장할 Vector3 생성
    const size = new THREE.Vector3();
    // boundingBox의 크기를 size에 저장
    boundingBox.getSize(size);

    // mm 단위로 바꾸어서 정수 단위로 baseSize에 저장
    setBaseSize([
      Math.floor(size.x * 10),
      Math.floor(size.y * 10),
      Math.floor(size.z * 10),
    ]);
  }, [scene]);

  return baseSize;
}
