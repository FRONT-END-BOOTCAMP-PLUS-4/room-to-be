console.log('🟡 시드 파일 실행 시작됨');

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('👀 main 함수 진입');

  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: '2',
      name: '방업슈',
      email: 'rlatkdwn3379@gmail.com',
      image: '',
    },
  });

  console.log('✅ 유저 upsert 완료');
}

main()
  .then(() => {
    console.log('🌱 Seed completed.');
  })
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
