import { RoomRepository } from '@/backend/domain/repositories/RoomRepository';
export class GetRoomById {
  constructor(private roomRepository: RoomRepository) {}
  async execute(roomId: string) {
    return this.roomRepository.findById(roomId);
  }
}
