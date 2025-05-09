// backend/utils/mapper.ts
import { Room as PrismaRoom } from '@prisma/client';
import { Room } from '@/backend/domain/entities/Room';

export function toDomainRoom(p: PrismaRoom): Room {
  return new Room(
    p.id,
    p.name,
    p.width,
    p.height,
    p.thumbnail_url,
    p.user_id,
    p.created_at,
  );
}

export function toPrismaRoom(r: Room): PrismaRoom {
  return {
    id: r.id,
    name: r.name,
    width: r.width,
    height: r.height,
    thumbnail_url: r.thumbnailUrl,
    user_id: r.userId,
    created_at: r.createdAt,
  };
}
