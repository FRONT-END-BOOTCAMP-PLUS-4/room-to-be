import { FurnitureRepository } from '@/backend/domain/repositories/FurnitureRepository';
import { Furniture } from '@/backend/domain/entities/Furniture';

export class GetFurnitureByCategory {
  constructor(private repo: FurnitureRepository) {}

  async execute(category: string): Promise<Furniture[]> {
    return this.repo.getByCategory(category);
  }
}
