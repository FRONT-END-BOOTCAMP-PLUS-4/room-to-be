// 가구 자체 정보
export interface FurnitureInfo {
  furnitureId: string;
  name: string;
  type: string;
  modelUrl: string;
  thumbnailUrl: string;
  placementType: string;
}

// 가구 배치 정보
export interface PlacedFurniture {
  id: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationY: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

// 방 경계 정보
export interface RoomBoundary {
  xMin: number;
  xMax: number;
  zMin: number;
  zMax: number;
  yMin: number;
  yMax: number;
}

// FurnitureInfo + PlacedFurniture를 그대로 조합한 타입
export interface Furnitures extends FurnitureInfo, PlacedFurniture {}

// FurnitureModel Props
export interface FurnitureModelProps extends Furnitures {
  roomBoundary: RoomBoundary;
}

