import { NextRequest, NextResponse } from 'next/server';

import { PrismaFurnitureRepository } from '@/backend/infra/db/models/PrismaFurnitureRepository';
import { FurnitureDto } from '@/backend/dto/FurnitureDto';
import { createFurniture } from '@/backend/usecase/furniture/CreateFurniture';
import { GetFurnitureByPlacementType } from '@/backend/usecase/furniture/GetFurnitureByPlacementType';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placementType = searchParams.get('placementType') as 'wall' | 'floor';

  if (!placementType || !['wall', 'floor'].includes(placementType)) {
    return NextResponse.json(
      { error: 'Invalid placementType' },
      { status: 400 },
    );
  }

  const repo = new PrismaFurnitureRepository();
  const usecase = new GetFurnitureByPlacementType(repo);
  const furnitureList = await usecase.execute(placementType);

  const dtoList: FurnitureDto[] = furnitureList.map((f) => ({
    id: f.id,
    name: f.name,
    category: f.category,
    modelUrl: f.modelUrl,
    thumbnailUrl: f.thumbnailUrl,
    placementType: f.placementType,
  }));

  return NextResponse.json(dtoList);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const category = formData.get('category');
    const placementType = formData.get('placementType');
    const modelFile = formData.get('model') as File | null;
    const thumbnailFile = formData.get('thumbnail') as File | null;

    if (
      typeof name !== 'string' ||
      typeof category !== 'string' ||
      (placementType !== 'wall' && placementType !== 'floor') ||
      !modelFile ||
      !thumbnailFile
    ) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 },
      );
    }

    const repo = new PrismaFurnitureRepository();
    const furniture = await createFurniture(repo, {
      name,
      category,
      placementType,
      modelBlob: modelFile,
      thumbnailBlob: thumbnailFile,
    });

    const dto: FurnitureDto = {
      id: furniture.id,
      name: furniture.name,
      category: furniture.category,
      modelUrl: furniture.modelUrl,
      thumbnailUrl: furniture.thumbnailUrl,
      placementType: furniture.placementType,
    };

    return NextResponse.json(dto, { status: 201 });
  } catch (error) {
    console.error('가구 생성 실패:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
