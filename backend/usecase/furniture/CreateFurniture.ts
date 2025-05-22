// backend/usecases/furniture/createFurniture.ts
import { Furniture } from '@/backend/domain/entities/Furniture';
import { FurnitureRepository } from '@/backend/domain/repositories/FurnitureRepository';
import {
  uploadFurnitureModel,
  uploadFurnitureThumbnail,
} from '@/backend/infra/db/supabase/SupabaseStorageUploader';

interface CreateFurnitureParams {
  name: string;
  category: string;
  placementType: 'floor' | 'wall';
  modelBlob: Blob;
  thumbnailBlob: Blob;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

export async function createFurniture(
  repo: FurnitureRepository,
  params: CreateFurnitureParams,
): Promise<Furniture> {
  const id = crypto.randomUUID();

  const modelUrl = await uploadFurnitureModel(params.modelBlob, id);
  const thumbnailUrl = await uploadFurnitureThumbnail(params.thumbnailBlob, id);

  const furniture = new Furniture(
    id,
    params.name,
    params.category,
    modelUrl,
    thumbnailUrl,
    params.placementType,
    new Date(),
    params.scaleX,
    params.scaleY,
    params.scaleZ,
  );

  return await repo.create(furniture);
}
