import { Room } from '@/backend/domain/entities/Room';
import { RoomRepository } from '@/backend/domain/repositories/RoomRepository';
import {
  toDomainRoom,
  toPrismaPlacedFurnitureCreateInput,
} from '@/backend/utils/mapper';

import { prisma } from '../prisma/prismaClient';
import { deleteRoomThumbnail } from '../supabase/SupabaseStorageRemover';

export class PrismaRoomRepository implements RoomRepository {
  async findById(id: string): Promise<Room | null> {
    const data = await prisma.room.findUnique({
      where: { id },
      include: { furnitures: true }, //
    });

    return data ? toDomainRoom(data) : null;
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
