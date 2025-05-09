// // backend/infra/db/prisma/seed.ts
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   const user = await prisma.user.upsert({
//     where: { email: 'test@example.com' },
//     update: {},
//     create: {
//       id: 'user1',
//       name: '홍길동',
//       email: 'test@example.com',
//       image: 'https://via.placeholder.com/150',
//     },
//   });

//   const bed = await prisma.furniture.upsert({
//     where: { id: 'furniture1' },
//     update: {},
//     create: {
//       id: 'furniture1',
//       name: '침대',
//       type: 'bed',
//       model_url: 'https://example.com/models/bed.glb',
//       thumbnail_url: 'https://example.com/thumbs/bed.png',
//     },
//   });

//   const desk = await prisma.furniture.upsert({
//     where: { id: 'furniture2' },
//     update: {},
//     create: {
//       id: 'furniture2',
//       name: '책상',
//       type: 'desk',
//       model_url: 'https://example.com/models/desk.glb',
//       thumbnail_url: 'https://example.com/thumbs/desk.png',
//     },
//   });

//   const room = await prisma.room.create({
//     data: {
//       id: 'room1',
//       name: '우리 집 원룸',
//       width: 400,
//       height: 300,
//       thumbnail_url: 'https://example.com/thumbs/room.png',
//       user_id: user.id,
//     },
//   });

//   await prisma.placedFurniture.createMany({
//     data: [
//       {
//         id: 'placed1',
//         room_id: room.id,
//         furniture_id: bed.id,
//         position_x: 0,
//         position_y: 0,
//         position_z: 0,
//         rotation_y: 0,
//         scale: 1,
//       },
//       {
//         id: 'placed2',
//         room_id: room.id,
//         furniture_id: desk.id,
//         position_x: 100,
//         position_y: 0,
//         position_z: 50,
//         rotation_y: 0.5,
//         scale: 1,
//       },
//     ],
//   });
// }

// main()
//   .then(() => {
//     console.log('✅ Seed completed.');
//   })
//   .catch((e) => {
//     console.error('❌ Seed failed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
