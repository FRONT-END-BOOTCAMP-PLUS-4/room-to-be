import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';

import { prisma } from './backend/infra/db/prisma/prismaClient';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' }, // JWT 세션 전략 명시
  providers: [
    Google,

    // TODO: 네이버 로그인 설정(이메일부분 승인 수정하기)
    // Naver({
    //   profile(profile) {
    //     return {
    //       name: profile.response.name ?? '',
    //       email: profile.response.email ?? 'naver Login',
    //       image: profile.response.profile_image ?? null,
    //     };
    //   },
    // }),
    // Kakao({
    //   profile(profile) {

    //     return {
    //       name: profile.properties?.nickname || profile.profile_nickname || '',
    //       email: profile.kakao_account?.email,
    //       image: profile.properties?.profile_image ?? null,
    //     };
    //   },
    // }),
  ],
  callbacks: {
    // JWT 생성 시 유저 ID 저장
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // 세션으로 JWT의 id 전달
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
