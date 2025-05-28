export interface GetRoomByIdDto {
  roomId: string;
  roomName: string;
  roomWidth: number;
  roomHeight: number;
  roomThumbnailUrl: string;
  userId: string;
  createdAt: Date;

  // 가구정보
  furnitureId: string;
  furnitureName: string;
  category: string;
  modelUrl: string;
  furnitureThumbnailUrl: string;
  placementType: 'floor' | 'wall';

  // 배치 가구
  placedId: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationY: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}
