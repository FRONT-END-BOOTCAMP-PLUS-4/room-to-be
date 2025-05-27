import { Room } from '@/backend/domain/entities/Room';
import { GetRoomByIdDto } from '@/backend/dto/GetRoomByIdDto';
export interface RoomRepository {
  findById(id: string): Promise<GetRoomByIdDto[]>;
  save(room: Room): Promise<Room>;
  findByUserId(userId: string): Promise<Room[]>;
  deleteById(id: string): Promise<void>;
}
