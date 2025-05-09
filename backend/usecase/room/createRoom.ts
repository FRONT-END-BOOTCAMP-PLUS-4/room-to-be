import { Room } from '@/backend/domain/entities/Room';
import { PrismaRoomRepository } from '@/backend/infra/db/models/prismaRoomRepository';
import { CreateRoomDto } from '@/backend/dto/createRoomDto';

export async function createRoom(input: CreateRoomDto): Promise<Room> {
  const roomRepository = new PrismaRoomRepository();

  // id는 생략 → Prisma가 @default(uuid())로 자동 생성
  const room = new Room(
    '', // 👉 임시 id (어차피 DB에서 대체됨, 또는 생성자에서 optional 처리 가능)
    input.name,
    input.width,
    input.height,
    input.thumbnailUrl,
    input.userId,
    new Date(),
  );

  const savedRoom = await roomRepository.create(room);

  return savedRoom;
}
