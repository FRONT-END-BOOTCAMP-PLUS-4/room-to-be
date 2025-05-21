import { User } from '@/backend/domain/entities/User';
import { UserRepository } from '@/backend/domain/repositories/UserRepository';

import { prisma } from '../prisma/prismaClient';

export class PrismaUserRepository implements UserRepository {
  async findProfileById(
    userId: string,
  ): Promise<Pick<User, 'name' | 'image'> | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true },
    });
  }
}
