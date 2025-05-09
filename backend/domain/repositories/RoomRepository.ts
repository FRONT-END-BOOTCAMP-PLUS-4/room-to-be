// backend/domain/repositories/RoomRepository.ts
import { Room } from '@/backend/domain/entities/Room';

export interface RoomRepository {
  findById(id: string): Promise<Room | null>;
  create(room: Room): Promise<Room>;
}
