// backend/controllers/api/room/route.ts

import { NextRequest } from 'next/server';

import { CreateRoomDto } from '@/backend/dto/createRoomDto';
import { createRoom } from '@/backend/usecase/room/createRoom';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateRoomDto;

    const result = await createRoom(body);

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error('[POST /api/room]', error);
    return Response.json({ message: '서버 오류' }, { status: 500 });
  }
}
