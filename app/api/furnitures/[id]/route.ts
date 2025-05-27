import { NextRequest, NextResponse } from 'next/server';

import { PrismaFurnitureRepository } from '@/backend/infra/db/models/PrismaFurnitureRepository';
import { FurnitureDto } from '@/backend/dto/FurnitureDto';
import { GetFurnitureById } from '@/backend/usecase/furniture/GetFurnitureById';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const furnitureId = params.id;

  const repo = new PrismaFurnitureRepository();
  const usecase = new GetFurnitureById(repo);

  const furniture = await usecase.execute(furnitureId);

  if (!furniture) {
    return NextResponse.json({ error: 'Furniture not found' }, { status: 404 });
  }

  const dto: FurnitureDto = {
    id: furniture.id,
    name: furniture.name,
    category: furniture.category,
    modelUrl: furniture.modelUrl,
    thumbnailUrl: furniture.thumbnailUrl,
    placementType: furniture.placementType,
    scaleX: furniture.scaleX,
    scaleY: furniture.scaleY,
    scaleZ: furniture.scaleZ,
  };

  return NextResponse.json(dto);
}
