import { NextRequest, NextResponse } from 'next/server';

import { GetRoomsByUserIdDto } from '@/backend/dto/GetRoomsByUserIdDto';
import { SaveRoom } from '@/backend/usecase/room/SaveRoom';
import { GetRoomsByUserId } from '@/backend/usecase/room/GetRoomsByUserId';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const name = form.get('name') as string;
    const width = parseInt(form.get('width') as string, 10);
    const height = parseInt(form.get('height') as string, 10);
    const userId = form.get('userId') as string;
    const image = form.get('image') as Blob;

    if (!name || !width || !height || !userId || !image) {
      return NextResponse.json({ message: '필수 값 누락' }, { status: 400 });
    }

    const result = await SaveRoom({
      name,
      width,
      height,
      userId,
      imageBlob: image,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/rooms]', error);
    return NextResponse.json(
      {
        message: '서버 오류 (방 저장 실패)',
        error: error?.message || String(error),
      },
      { status: 500 },
    );
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
