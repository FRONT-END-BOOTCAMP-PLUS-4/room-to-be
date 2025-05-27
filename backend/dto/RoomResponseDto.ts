import { Room } from '../domain/entities/Room';
type RoomResponseDto = {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  userId: string;
  createdAt: string;
  furnitures: {
    id: string;
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

// 변환 함수
export function toRoomDto(room: Room): RoomResponseDto {
  return {
    id: room.id,
    name: room.name,
    width: room.width,
    height: room.height,
    thumbnailUrl: room.thumbnailUrl,
    userId: room.userId,
    createdAt: room.createdAt.toISOString(),
    furnitures: room.furnitures.map((f) => ({
      id: f.id,
      furnitureId: f.furnitureId,
      positionX: f.positionX,
      positionY: f.positionY,
      positionZ: f.positionZ,
      rotationY: f.rotationY,
      scaleX: f.scaleX,
      scaleY: f.scaleY,
      scaleZ: f.scaleZ,
    })),
  };
}
