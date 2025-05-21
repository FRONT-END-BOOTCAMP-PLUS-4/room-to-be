import { FurnitureRepository } from '@/backend/domain/repositories/FurnitureRepository';
export class GetFurnitureById {
  constructor(private repo: FurnitureRepository) {}

  async execute(id: string) {
    return this.repo.getById(id);
  }
}
