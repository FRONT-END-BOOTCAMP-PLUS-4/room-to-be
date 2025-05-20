import { Furniture } from '../entities/Furniture';

export interface FurnitureRepository {
  getAll(): Promise<Furniture[]>;
  getByPlacementType(placementType: 'floor' | 'wall'): Promise<Furniture[]>;
  create(furniture: Furniture): Promise<Furniture>;
  getById(id: string): Promise<Furniture | null>;
}
