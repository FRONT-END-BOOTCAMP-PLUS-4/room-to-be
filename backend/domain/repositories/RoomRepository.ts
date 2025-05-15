import { Room } from '@/backend/domain/entities/Room';

export interface RoomRepository {
  findById(id: string): Promise<Room | null>;
  saveRoom(room: Room): Promise<Room>;
  findByUserId(userId: string): Promise<Room[]>;
}
