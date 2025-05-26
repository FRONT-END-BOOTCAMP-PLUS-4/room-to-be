import {
  Furniture as PrismaFurniture,
  Room as PrismaRoom,
} from '@prisma/client';

import { Furniture } from '@/backend/domain/entities/Furniture';
import { PlacedFurniture } from '@/backend/domain/entities/PlacedFurniture';
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
    p.scale_x,
    p.scale_y,
    p.scale_z,
  );
}

export function toPlacedFurnitureEntity(prismaModel: any): PlacedFurniture {
  return new PlacedFurniture(
    prismaModel.id,
    prismaModel.room_id,
    prismaModel.furniture_id,
    prismaModel.position_x,
    prismaModel.position_y,
    prismaModel.position_z,
    prismaModel.rotation_y,
    prismaModel.scale_x,
    prismaModel.scale_y,
    prismaModel.scale_z,
    prismaModel.created_at,
  );
}
