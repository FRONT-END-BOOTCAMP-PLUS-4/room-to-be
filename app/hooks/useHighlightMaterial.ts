import { useEffect } from 'react';
import * as THREE from 'three';

export interface HighlightMaterialOptions {
  scene: THREE.Object3D;
  isSelected: boolean;
}

// 선택에 따라 mesh material을 복제하고 하이라이트 처리하는 훅
export default function useHighlightMaterial({
  scene,
  isSelected,
}: HighlightMaterialOptions) {
  useEffect(() => {
    // 씬의 모든 자식 객체 순회
    scene.traverse((child: any) => {

      // 메시가 아니면 무시
      if (!child.isMesh) return;

      // 그림자 켜기
      child.castShadow = true;
      child.receiveShadow = true;

      // material 복제하여 독립적인 인스턴스 생성
      child.material = child.material.clone();

      // 클릭 무시할 mesh 이름 정의
      const ignoredNames = ['FLOOR', 'WALL', 'CEILING', 'GLASS'];
      const name = child.name?.toUpperCase?.() ?? '';

      // 위에서 지정한 이름이라면 raycast 무효화하여 클릭 방지
      if (ignoredNames.includes(name)) {
        child.raycast = () => null;
        return;
      }

      // 선택 시, 하늘색으로 emissive 처리
      const mat = child.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissive = new THREE.Color(isSelected ? 0x00ffff : 0x000000);
        mat.emissiveIntensity = isSelected ? 0.8 : 0;
      }
    });
  }, [scene, isSelected]);
}
