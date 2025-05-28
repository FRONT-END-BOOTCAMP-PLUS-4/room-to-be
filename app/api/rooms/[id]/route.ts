import { NextRequest, NextResponse } from 'next/server';

import { PrismaRoomRepository } from '@/backend/infra/db/models/PrismaRoomRepository';
import { DeleteRoomUseCase } from '@/backend/usecase/room/DeleteRoom';

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const repo = new PrismaRoomRepository();
  const dtos = await repo.findById(params.id);

  if (dtos.length === 0) {
    return new Response(JSON.stringify({ message: 'Room not found' }), {
      status: 404,
    });
  }

  const first = dtos[0];

  const room = {
    id: first.roomId,
    name: first.roomName,
    roomWidth: first.roomWidth,
    roomHeight: first.roomHeight,
    thumbnailUrl: first.roomThumbnailUrl,
    userId: first.userId,
    createdAt: first.createdAt,
    furnitures: dtos.map((dto) => ({
      id: dto.placedId,
      furnitureId: dto.furnitureId,
      name: dto.furnitureName,
      category: dto.category,
      modelUrl: dto.modelUrl,
      thumbnailUrl: dto.furnitureThumbnailUrl,
      placementType: dto.placementType,
      positionX: dto.positionX,
      positionY: dto.positionY,
      positionZ: dto.positionZ,
      rotationY: dto.rotationY,
      scaleX: dto.scaleX,
      scaleY: dto.scaleY,
      scaleZ: dto.scaleZ,
    })),
  };

  return new Response(JSON.stringify(room), { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params;

  const roomRepository = new PrismaRoomRepository();
  const deleteRoom = new DeleteRoomUseCase(roomRepository);

  try {
    await deleteRoom.execute(id);
    return NextResponse.json(
      { message: 'Room deleted successfully' },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.message === 'Room not found') {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
