import { Room } from '@/backend/domain/entities/Room';

export interface RoomRepository {
  findById(id: string): Promise<Room | null>;
  save(room: Room): Promise<Room>;
  findByUserId(userId: string): Promise<Room[]>;
  deleteById(id: string): Promise<void>;
}
