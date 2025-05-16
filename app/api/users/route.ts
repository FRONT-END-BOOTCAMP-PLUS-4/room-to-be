import { NextRequest, NextResponse } from 'next/server';
import { PrismaUserRepository } from '@/backend/infra/db/models/PrismaUserRepository';
import { GetUserProfile } from '@/backend/usecase/room/GetUserProfile';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const userRepository = new PrismaUserRepository();
    const getUserProfile = new GetUserProfile(userRepository);

    const result = await getUserProfile.execute({ userId });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
