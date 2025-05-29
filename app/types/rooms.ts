import { FurnitureStoreInfo } from './furniture';
export interface PlacedFurnitureInput {
  furnitureId: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationY: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

export interface RoomSaveRequest {
  id?: string;
  name: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  userId: string;
  background?: string;
  isNightMode?: boolean;
  cameraX?: number;
  cameraY?: number;
  cameraZ?: number;
  furnitures: PlacedFurnitureInput[];
}

export interface RoomResponse {
  id: string;
  name: string;
  roomWidth: number;
  roomHeight: number;
  thumbnailUrl: string;
  userId: string;
  createdAt: string;
  background?: string;
  cameraX?: number;
  cameraY?: number;
  cameraZ?: number;
  isNightMode?: boolean;
  furnitures: FurnitureStoreInfo[];
}
