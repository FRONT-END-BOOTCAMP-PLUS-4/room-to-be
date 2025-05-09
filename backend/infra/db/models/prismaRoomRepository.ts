// backend/infra/models/PrismaRoomRepository.ts
import { RoomRepository } from '@/backend/domain/repositories/RoomRepository';
import { prisma } from '../prisma/prismaClient';
import { toDomainRoom, toPrismaRoom } from '@/backend/utils/mapper';
import { Room } from '@/backend/domain/entities/Room';

export class PrismaRoomRepository implements RoomRepository {
  async findById(id: string): Promise<Room | null> {
    const data = await prisma.room.findUnique({ where: { id } });
    return data ? toDomainRoom(data) : null;
  }

  async create(room: Room): Promise<Room> {
    const data = await prisma.room.create({
      data: toPrismaRoom(room),
    });
    return toDomainRoom(data);
  }
}
