export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/protected/:path*'], // TODO:인증 필요한 경로 설정
};
