export interface FurnitureDto {
  furnitureId?: string;
  id: string;
  name: string;
  category: string;
  modelUrl: string;
  thumbnailUrl: string;
  placementType: 'wall' | 'floor';
  scaleX: number;
  scaleY: number;
  scaleZ: number;

  // edit 모드용
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotationY?: number;
}
