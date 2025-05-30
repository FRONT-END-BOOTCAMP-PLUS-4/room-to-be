import { NextRequest, NextResponse } from 'next/server';

import { PrismaRoomRepository } from '@/backend/infra/db/models/PrismaRoomRepository';
import { SaveRoomDto } from '@/backend/dto/SaveRoomDto';
import { DeleteRoomUseCase } from '@/backend/usecase/room/DeleteRoom';
import { UpdateRoom } from '@/backend/usecase/room/UpdateRoom';

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
    background: first.background,
    cameraX: first.cameraX,
    cameraY: first.cameraY,
    cameraZ: first.cameraZ,
    isNightMode: first.isNightMode,
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

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params;
  const body: SaveRoomDto = await req.json();

  const repo = new PrismaRoomRepository();
  const updateRoom = new UpdateRoom(repo);

  try {
    const updated = await updateRoom.execute(id, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('Room update failed:', error);
    return NextResponse.json({ error: 'Room update failed' }, { status: 500 });
  }
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
