import {
  Furniture as PrismaFurniture,
  PlacedFurniture as PrismaPlacedFurniture,
  Room as PrismaRoom,
} from '@prisma/client';

import { Furniture } from '@/backend/domain/entities/Furniture';
import { PlacedFurniture } from '@/backend/domain/entities/PlacedFurniture';
import { Room } from '@/backend/domain/entities/Room';

export function toDomainRoom(
  p: PrismaRoom & { furnitures: PrismaPlacedFurniture[] },
): Room {
  const furnitures = p.furnitures.map(toPlacedFurnitureEntity);

  return new Room(
    p.id,
    p.name,
    p.width,
    p.height,
    p.thumbnail_url,
    p.user_id,
    p.created_at,
    furnitures,
  );
}

export function toPlacedFurnitureEntity(
  p: PrismaPlacedFurniture,
): PlacedFurniture {
  return new PlacedFurniture(
    p.id,
    p.room_id,
    p.furniture_id,
    p.position_x,
    p.position_y,
    p.position_z,
    p.rotation_y,
    p.scale_x,
    p.scale_y,
    p.scale_z,
    p.created_at,
  );
}

export function toPrismaPlacedFurnitureCreateInput(f: PlacedFurniture) {
  return {
    furniture_id: f.furnitureId,
    position_x: f.positionX,
    position_y: f.positionY,
    position_z: f.positionZ,
    rotation_y: f.rotationY,
    scale_x: f.scaleX,
    scale_y: f.scaleY,
    scale_z: f.scaleZ,
  };
}

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

export function toPrismaFurniture(f: Furniture) {
  return {
    name: f.name,
    category: f.category,
    model_url: f.modelUrl,
    thumbnail_url: f.thumbnailUrl,
    placement_type: f.placementType,
    created_at: f.createdAt,
    scale_x: f.scaleX,
    scale_y: f.scaleY,
    scale_z: f.scaleZ,
  };
}
