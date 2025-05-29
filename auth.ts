import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';

import { prisma } from './backend/infra/db/prisma/prismaClient';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    // TODO: 네이버 로그인 설정(이메일부분 승인 수정하기)
    Naver({
      profile(profile) {
        console.log('NAVER PROFILE:', profile);
        return {
          name: profile.response.name ?? '',
          email: profile.response.email ?? 'naver Login',
          image: profile.response.profile_image ?? null,
        };
      },
    }),
    // 카카오 로그인 설정정
    Kakao({
      profile(profile) {
        console.log('KAKAO PROFILE:', profile);
        return {
          name: profile.properties?.nickname || profile.profile_nickname || '',
          email: profile.kakao_account?.email,
          image: profile.properties?.profile_image ?? null,
        };
      },
    }),
  ],
});
