
import { prisma } from '../prisma/prismaClient';
import { FurnitureRepository } from '@/backend/domain/repositories/FurnitureRepository';
import { Furniture } from '@/backend/domain/entities/Furniture';
import { toDomainFurniture, toPrismaFurniture } from '@/backend/utils/mapper';

export class PrismaFurnitureRepository implements FurnitureRepository {
  async getAll(): Promise<Furniture[]> {
    const raws = await prisma.furniture.findMany();
    return raws.map(toDomainFurniture);
  }

  async getByPlacementType(placementType: 'floor' | 'wall'): Promise<Furniture[]> {
    const raws = await prisma.furniture.findMany({
      where: { placement_type: placementType },
    });
    return raws.map(toDomainFurniture);
  }

  async create(furniture: Furniture): Promise<Furniture> {
    const created = await prisma.furniture.create({
      data: toPrismaFurniture(furniture),
    });
    return toDomainFurniture(created);
  }
}
