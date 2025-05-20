import {
  Furniture as PrismaFurniture,
  Room as PrismaRoom,
} from '@prisma/client';

import { Furniture } from '@/backend/domain/entities/Furniture';
import { Room } from '@/backend/domain/entities/Room';

// Room 변환 함수
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

export function toPrismaRoom(r: Room): Omit<PrismaRoom, 'id'> {
  return {
    name: r.name,
    width: r.width,
    height: r.height,
    thumbnail_url: r.thumbnailUrl,
    user_id: r.userId,
    created_at: r.createdAt,
  };
}

// Furniture 변환 함수
export function toDomainFurniture(p: PrismaFurniture): Furniture {
  return new Furniture(
    p.id,
    p.name,
    p.category,
    p.model_url,
    p.thumbnail_url,
    p.placement_type as 'floor' | 'wall',
    p.created_at,
  );
}

export function toPrismaFurniture(f: Furniture): Omit<PrismaFurniture, 'id'> {
  return {
    name: f.name,
    category: f.category,
    model_url: f.modelUrl,
    thumbnail_url: f.thumbnailUrl,
    placement_type: f.placementType,
    created_at: f.createdAt,
  };
}
