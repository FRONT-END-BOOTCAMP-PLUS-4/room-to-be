import { UserRepository } from '@/backend/domain/repositories/UserRepository';
import { GetUserProfileDto } from '@/backend/dto/GetUserProfileDto';

export class GetUserProfile {
  constructor(private userRepository: UserRepository) {}

  async execute(
    dto: GetUserProfileDto,
  ): Promise<{ name: string; image: string | null }> {
    const user = await this.userRepository.findProfileById(dto.userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      name: user.name,
      image: user.image ?? null,
    };
  }
}
