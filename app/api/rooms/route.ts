import { NextRequest, NextResponse } from 'next/server';

import { PrismaRoomRepository } from '@/backend/infra/db/models/PrismaRoomRepository';
import { GetRoomsByUserIdDto } from '@/backend/dto/GetRoomsByUserIdDto';
import { SaveRoomDto } from '@/backend/dto/SaveRoomDto';
import { GetRoomsByUserId } from '@/backend/usecase/room/GetRoomsByUserId';
import { SaveRoom } from '@/backend/usecase/room/SaveRoom';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SaveRoomDto;

    const usecase = new SaveRoom(new PrismaRoomRepository());
    const room = await usecase.execute(body);

    return NextResponse.json(room, { status: 201 });
  } catch (err) {
    console.error('[POST /api/rooms] Error:', err);
    return NextResponse.json({ error: 'Failed to save room' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 },
      );
    }

    const dto: GetRoomsByUserIdDto = { userId };
    const rooms = await GetRoomsByUserId(dto);

    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/rooms]', error);
    return NextResponse.json(
      { message: '서버 오류 (방 목록 조회 실패)' },
      { status: 500 },
    );
  }
}
