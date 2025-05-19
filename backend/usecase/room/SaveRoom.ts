import { Room } from '@/backend/domain/entities/Room';
import { PrismaRoomRepository } from '@/backend/infra/db/models/PrismaRoomRepository';
import { SaveRoomDto } from '@/backend/dto/SaveRoomDto';
import { uploadRoomThumbnail } from '@/backend/infra/db/supabase/SupabaseStorageUploader';
import { randomUUID } from 'crypto';

export async function SaveRoom(input: SaveRoomDto): Promise<Room> {
  const roomRepository = new PrismaRoomRepository();

  // uuid 직접 생성
  const roomId = randomUUID();

  // Supabase Storage에 썸네일 업로드
  const thumbnailUrl = await uploadRoomThumbnail(input.imageBlob, roomId);

  // Room 객체 생성
  const room = new Room(
    roomId,
    input.name,
    input.width,
    input.height,
    thumbnailUrl,
    input.userId,
    new Date(),
  );

  // DB 저장
  return await roomRepository.saveRoom(room);
}
