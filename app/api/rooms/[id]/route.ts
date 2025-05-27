import { NextRequest, NextResponse } from 'next/server';

import { PrismaRoomRepository } from '@/backend/infra/db/models/PrismaRoomRepository';
import { toRoomDto } from '@/backend/dto/RoomResponseDto';
import { DeleteRoomUseCase } from '@/backend/usecase/room/DeleteRoom';
import { GetRoomById } from '@/backend/usecase/room/GetRoomById';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const roomId = params.id;
  const roomRepo = new PrismaRoomRepository();
  const getRoom = new GetRoomById(roomRepo);

  const room = await getRoom.execute(roomId);
  if (!room) {
    return new Response('Not Found', { status: 404 });
  }

  return Response.json({ room: toRoomDto(room) });
}

export async function DELETE(
  req: NextRequest,
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
