import CarouselSlideItem from './components/landing/CarouselSlideItem';
import CarouselSlider from './components/landing/CarouselSlider';

const slidesData = [
  {
    title: 'Draw the Space,Fill the Home',
    desc: 'RoomToBe lets you design your future room in 3D — drag, drop, and plan your space before you move in.',
    image: '/assets/images/main-room01.png',
    image2: '/assets/images/room01-box.png',
    bg: 'gradient-01',
  },
  {
    title: 'The Room You Dreamed of, Now Reality',
    desc: 'RoomToBe lets you design your future room in 3D — drag, drop, and plan your space before you move in.',
    image: '/assets/images/main-room02.png',
    image2: '/assets/images/room02-box.png',
    bg: 'gradient-02',
  },
  {
    title: 'A New Room with Just One Drag',
    desc: 'RoomToBe lets you design your future room in 3D — drag, drop, and plan your space before you move in.',
    image: '/assets/images/main-room03.png',
    image2: '/assets/images/room03-box.png',
    bg: 'gradient-03',
  },
  {
    title: 'A New Room with Just One Drag',
    desc: 'RoomToBe lets you design your future room in 3D — drag, drop, and plan your space before you move in.',
    image: '/assets/images/main-room04.png',
    image2: '/assets/images/room04-box.png',
    bg: 'gradient-04',
  },
];

export default async function Page() {
  const SLIDE_COUNT = slidesData.length;
  // 슬라이드 데이터로부터 JSX 생성
  const slidesJsx = slidesData.map((slide, idx) => (
    <CarouselSlideItem
      key={idx}
      slide={slide}
      idx={idx + 1}
      SLIDE_COUNT={SLIDE_COUNT}
    />
  ));
  return (
    <>
      <CarouselSlider slides={slidesJsx} />
    </>
  );
}
