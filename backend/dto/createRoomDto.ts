// backend/dto/CreateRoomDto.ts
export interface CreateRoomDto {
  name: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  userId: string;
}
