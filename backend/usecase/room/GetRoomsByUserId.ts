import { PrismaRoomRepository } from '@/backend/infra/db/models/PrismaRoomRepository';
import { GetRoomsByUserIdDto } from '@/backend/dto/GetRoomsByUserIdDto';

export async function GetRoomsByUserId(dto: GetRoomsByUserIdDto) {
  const repo = new PrismaRoomRepository();
  return await repo.findByUserId(dto.userId);
}
