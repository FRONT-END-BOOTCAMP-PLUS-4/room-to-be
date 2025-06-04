import * as THREE from 'three';

// 더 정확한 창문 감지 함수
export const isWindowFurniture = (
  name: string,
  scene: THREE.Group,
): boolean => {
  const lowerName = name.toLowerCase();
  const hasWindowInName =
    lowerName.includes('window') ||
    lowerName.includes('창문') ||
    lowerName.includes('창');

  if (hasWindowInName) return true;

  // 모델의 재질 이름으로도 확인
  let hasGlassMaterial = false;
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((mat) => {
        if (
          mat.name?.toLowerCase().includes('glass') ||
          mat.name?.toLowerCase().includes('window') ||
          mat.name?.toLowerCase().includes('유리')
        ) {
          hasGlassMaterial = true;
        }
      });
    }
  });

  return hasGlassMaterial;
};

// 창문틀인지 확인하는 함수
export const isWindowFrame = (
  material: THREE.MeshStandardMaterial,
  materialName: string,
): boolean => {
  const lowerName = materialName.toLowerCase();

  // 창문틀로 추정되는 재질명 패턴
  const frameKeywords = [
    'frame',
    'trim',
    'sill',
    'casement',
    'mullion',
    'sash',
    '틀',
    '프레임',
    '테두리',
    '창틀',
    'wood',
    'metal',
    'aluminum',
  ];

  // 재질명에 창문틀 키워드가 포함된 경우
  if (frameKeywords.some((keyword) => lowerName.includes(keyword))) {
    return true;
  }

  // 불투명하고 금속성이나 거칠기가 있는 재질 (창문틀 특성)
  if (
    !material.transparent &&
    material.opacity >= 0.9 &&
    (material.metalness > 0.1 || material.roughness > 0.3)
  ) {
    return true;
  }

  // 흰색계열이면서 불투명한 재질 (흰색 창문틀 보호)
  const color = material.color;
  if (
    !material.transparent &&
    material.opacity >= 0.9 &&
    color.r > 0.8 &&
    color.g > 0.8 &&
    color.b > 0.8
  ) {
    return true;
  }

  return false;
};

// 실제 유리인지 더 엄격하게 확인하는 함수
export const isActualGlass = (
  material: THREE.MeshStandardMaterial,
  materialName: string,
): boolean => {
  const lowerName = materialName.toLowerCase();

  // 명확한 유리 키워드가 있는 경우
  if (
    lowerName.includes('glass') ||
    lowerName.includes('유리') ||
    lowerName.includes('glazing')
  ) {
    return true;
  }

  // 투명하거나 반투명인 재질
  if (material.transparent && material.opacity < 0.9) {
    return true;
  }

  // 매우 매끄럽고 투명성이 있으며 금속성이 낮은 재질 (유리 특성)
  if (
    material.roughness < 0.05 &&
    material.metalness < 0.05 &&
    (material.transparent || material.opacity < 1.0)
  ) {
    return true;
  }

  return false;
};

// 창문 유리에 올바른 색상을 적용하는 함수
const applyGlassColor = (
  material: THREE.MeshStandardMaterial,
  isDay: boolean,
) => {
  if (isDay) {
    material.color.setHex(0xffffff);
    material.emissive.setHex(0xfff8e1);
    material.emissiveIntensity = 0.8;
  } else {
    material.color.setHex(0x1a237e);
    material.emissive.setHex(0x0d1b69);
    material.emissiveIntensity = 0.1;
  }

  // 투명도 관련 설정 강제 적용
  material.transparent = false;
  material.opacity = 1.0;
  material.needsUpdate = true;
};

// 창문 유리 효과 설정 함수
export const setupWindowGlassEffect = (
  scene: THREE.Group,
  name: string,
  isDay: boolean,
): THREE.MeshStandardMaterial | null => {
  if (!isWindowFurniture(name, scene)) return null;

  let glassRef: THREE.MeshStandardMaterial | null = null;

  // 기존 유리 재질 찾기 및 수정
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          const matName = material.name?.toLowerCase() || '';

          // 이미 창문 유리로 설정된 재질인 경우 색상만 업데이트
          if (material.userData._isWindowGlass) {
            applyGlassColor(material, isDay);
            glassRef = material;
            return;
          }

          // 창문틀인지 먼저 확인 - 창문틀이면 건드리지 않음
          if (isWindowFrame(material, matName)) {
            return; // 창문틀은 건드리지 않고 넘어감
          }

          // 실제 유리인지 엄격하게 확인
          if (isActualGlass(material, matName)) {
            // 기존 재질을 창문 유리로 변환
            material.roughness = 0.0;
            material.metalness = 0.0;
            material.userData._isWindowGlass = true;

            // 색상 적용
            applyGlassColor(material, isDay);
            glassRef = material;
          }
        }
      });
    }
  });

  // 기존 유리 재질이 없으면 새로 생성
  if (!glassRef) {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // 창문 크기에 따라 유리 크기 조정
    const glassWidth = Math.max(size.x * 0.8, 0.4);
    const glassHeight = Math.max(size.y * 0.8, 0.4);

    const glassGeometry = new THREE.PlaneGeometry(glassWidth, glassHeight);
    const glassMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.0,
      metalness: 0.0,
    });

    glassMaterial.userData._isWindowGlass = true;

    // 색상 적용
    applyGlassColor(glassMaterial, isDay);

    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    glassMesh.userData._isWindowGlass = true;

    // 창문 중앙에 배치 (Z축 약간 앞으로)
    glassMesh.position.set(
      center.x - scene.position.x,
      center.y - scene.position.y,
      Math.max(size.z * 0.05, 0.001),
    );

    scene.add(glassMesh);
    glassRef = glassMaterial;
  }

  return glassRef;
};

// 유리 재질 업데이트 함수
export const updateAllWindowGlass = (
  scene: THREE.Group,
  isDay: boolean,
): void => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          // 명시적으로 창문 유리로 표시된 재질만 업데이트
          if (
            material.userData?._isWindowGlass ||
            child.userData._isWindowGlass
          ) {
            applyGlassColor(material, isDay);
          }
        }
      });
    }
  });
};
