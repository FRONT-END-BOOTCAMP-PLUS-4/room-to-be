import { PlacedFurniture } from '@/backend/domain/entities/PlacedFurniture';
import { Room } from '@/backend/domain/entities/Room';
import { RoomRepository } from '@/backend/domain/repositories/RoomRepository';
import { SaveRoomDto } from '@/backend/dto/SaveRoomDto';

export class UpdateRoom {
  constructor(private readonly roomRepo: RoomRepository) {}

  async execute(id: string, dto: SaveRoomDto): Promise<Room> {
    const furnitures = dto.furnitures.map((f) => {
      return new PlacedFurniture(
        '',
        id,
        f.furnitureId,
        f.positionX,
        f.positionY,
        f.positionZ,
        f.rotationY,
        f.scaleX,
        f.scaleY,
        f.scaleZ,
        new Date(),
      );
    });

    const room = new Room(
      id,
      dto.name,
      dto.width,
      dto.height,
      dto.thumbnailUrl,
      dto.userId,
      new Date(),
      furnitures,
      dto.background,
      dto.isNightMode,
      dto.cameraX,
      dto.cameraY,
      dto.cameraZ,
    );

    return this.roomRepo.update(room);
  }
}
