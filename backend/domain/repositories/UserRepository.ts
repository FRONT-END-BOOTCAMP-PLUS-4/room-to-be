import { User } from '@/backend/domain/entities/User';
export interface UserRepository {
  findProfileById(userId: string): Promise<Pick<User, 'name' | 'image'> | null>;
}
