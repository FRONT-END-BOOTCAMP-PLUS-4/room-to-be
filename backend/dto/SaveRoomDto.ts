export type SaveRoomDto = {
  name: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  userId: string;
  background: string;
  isNightMode: boolean;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  furnitures: {
    furnitureId: string;
    positionX: number;
    positionY: number;
    positionZ: number;
    rotationY: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
  }[];
};
