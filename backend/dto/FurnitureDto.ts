export interface FurnitureDto {
  id: string;
  name: string;
  category: string;
  modelUrl: string;
  thumbnailUrl: string;
  placementType: 'wall' | 'floor';
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}