import { Room } from '@/backend/domain/entities/Room';
import { RoomRepository } from '@/backend/domain/repositories/RoomRepository';
import { GetRoomByIdDto } from '@/backend/dto/GetRoomByIdDto';
import {
  toDomainRoom,
  toPrismaPlacedFurnitureCreateInput,
} from '@/backend/utils/mapper';

import { prisma } from '../prisma/prismaClient';
import { deleteRoomThumbnail } from '../supabase/SupabaseStorageRemover';

export class PrismaRoomRepository implements RoomRepository {
  async findById(roomId: string): Promise<GetRoomByIdDto[]> {
    const prismaRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        furnitures: {
          include: {
            furniture: true,
          },
        },
      },
    });

    if (!prismaRoom) return [];

    return prismaRoom.furnitures
      .filter((p) => p.furniture)
      .map(
        (p): GetRoomByIdDto => ({
          roomId: prismaRoom.id,
          roomName: prismaRoom.name,
          roomWidth: prismaRoom.width,
          roomHeight: prismaRoom.height,
          roomThumbnailUrl: prismaRoom.thumbnail_url,
          userId: prismaRoom.user_id,
          createdAt: prismaRoom.created_at,

          placedId: p.id,
          furnitureId: p.furniture_id,
          furnitureName: p.furniture.name,
          category: p.furniture.category,
          modelUrl: p.furniture.model_url,
          furnitureThumbnailUrl: p.furniture.thumbnail_url,
          placementType: p.furniture.placement_type as 'floor' | 'wall',

          positionX: p.position_x,
          positionY: p.position_y,
          positionZ: p.position_z,
          rotationY: p.rotation_y,
          scaleX: p.scale_x,
          scaleY: p.scale_y,
          scaleZ: p.scale_z,
        }),
      );
  }

  async save(room: Room): Promise<Room> {
    const created = await prisma.room.create({
      data: {
        name: room.name,
        width: room.width,
        height: room.height,
        user_id: room.userId,
        thumbnail_url: room.thumbnailUrl,
        furnitures: {
          create: room.furnitures.map(toPrismaPlacedFurnitureCreateInput),
        },
      },
      include: {
        furnitures: true,
      },
    });

    return toDomainRoom(created);
  }

  async findByUserId(userId: string): Promise<Room[]> {
    const data = await prisma.room.findMany({
      where: { user_id: userId },
      include: { furnitures: true },
    });

    return data.map(toDomainRoom);
  }

  async deleteById(id: string): Promise<void> {
    await prisma.placedFurniture.deleteMany({ where: { room_id: id } });

    try {
      await deleteRoomThumbnail(id);
    } catch (e) {
      console.error('썸네일 삭제 실패:', e);
    }

    await prisma.room.delete({ where: { id } });
  }
}
