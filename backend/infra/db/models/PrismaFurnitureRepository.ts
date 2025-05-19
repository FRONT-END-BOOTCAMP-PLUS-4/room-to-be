// backend/infra/db/models/PrismaFurnitureRepository.ts
import { prisma } from '../prisma/prismaClient';
import { FurnitureRepository } from '@/backend/domain/repositories/FurnitureRepository';
import { Furniture } from '@/backend/domain/entities/Furniture';
import { toDomainFurniture, toPrismaFurniture } from '@/backend/utils/mapper';

export class PrismaFurnitureRepository implements FurnitureRepository {
  async getAll(): Promise<Furniture[]> {
    const results = await prisma.furniture.findMany();
    return results.map(toDomainFurniture);
  }

  async getByCategory(category: string): Promise<Furniture[]> {
    const results = await prisma.furniture.findMany({ where: { category } });
    return results.map(toDomainFurniture);
  }

  async getByPlacementType(
    placementType: 'floor' | 'wall',
  ): Promise<Furniture[]> {
    const results = await prisma.furniture.findMany({
      where: { placement_type: placementType },
    });
    return results.map(toDomainFurniture);
  }

  async create(furniture: Furniture): Promise<Furniture> {
    const result = await prisma.furniture.create({
      data: toPrismaFurniture(furniture),
    });
    return toDomainFurniture(result);
  }
}
