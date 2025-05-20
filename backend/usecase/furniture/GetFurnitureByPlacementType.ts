import { FurnitureRepository } from '@/backend/domain/repositories/FurnitureRepository';
import { Furniture } from '@/backend/domain/entities/Furniture';

export class GetFurnitureByPlacementType {
  constructor(private repo: FurnitureRepository) {}

  async execute(placementType: 'wall' | 'floor'): Promise<Furniture[]> {
    return this.repo.getByPlacementType(placementType);
  }
}
