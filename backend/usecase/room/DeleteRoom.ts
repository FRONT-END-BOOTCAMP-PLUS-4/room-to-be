import { RoomRepository } from '../../domain/repositories/RoomRepository';

export class DeleteRoomUseCase {
  constructor(private roomRepository: RoomRepository) {}

  async execute(id: string): Promise<void> {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }

    await this.roomRepository.deleteById(id);
  }
}
