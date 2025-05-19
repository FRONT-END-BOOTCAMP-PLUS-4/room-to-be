import { Room } from '@/backend/domain/entities/Room';
import { RoomRepository } from '@/backend/domain/repositories/RoomRepository';
import { toDomainRoom, toPrismaRoom } from '@/backend/utils/mapper';

import { prisma } from '../prisma/prismaClient';

export class PrismaRoomRepository implements RoomRepository {
  async findById(id: string): Promise<Room | null> {
    const data = await prisma.room.findUnique({ where: { id } });
    return data ? toDomainRoom(data) : null;
  }

  async saveRoom(room: Room): Promise<Room> {
    const data = await prisma.room.create({
      data: toPrismaRoom(room),
    });
    return toDomainRoom(data);
  }
  async findByUserId(userId: string): Promise<Room[]> {
    const data = await prisma.room.findMany({
      where: { user_id: userId },
    });

    return data.map(toDomainRoom);
  }
  async deleteById(id: string): Promise<void> {
    await prisma.room.delete({
      where: { id },
    });
  }
}
