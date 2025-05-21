'use client';
export async function uploadFurniture({
  name,
  category,
  placementType,
  modelFile,
  thumbnailFile,
  scaleX,
  scaleY,
  scaleZ,
}: {
  name: string;
  category: string;
  placementType: 'wall' | 'floor';
  modelFile: File;
  thumbnailFile: File;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('category', category);
  formData.append('placementType', placementType);
  formData.append('model', modelFile);
  formData.append('thumbnail', thumbnailFile);
  formData.append('scaleX', scaleX.toString());
  formData.append('scaleY', scaleY.toString());
  formData.append('scaleZ', scaleZ.toString());
  const res = await fetch('/api/furnitures', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(`가구 생성 실패: ${error}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchFurnitureByPlacementType(
  placementType: 'wall' | 'floor',
) {
  const res = await fetch(`/api/furnitures?placementType=${placementType}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(`가구 조회 실패: ${error}`);
  }

  const data = await res.json();
  return data;
}
