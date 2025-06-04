import CarouselSlideItem from './components/landing/CarouselSlideItem';
import CarouselSlider from './components/landing/CarouselSlider';

const slidesData = [
  {
    title: '가구를 끌어다 놓기만 하면 돼요',
    desc: '원하는 가구를 클릭하고 드래그해서 방 안에 배치해보세요.\n어렵지 않아요, 진짜 가구 옮기듯이 쉽고 직관적이에요.',
    image: '/assets/images/main-room01.png',
    image2: '/assets/images/room01-box.png',
    bg: 'gradient-01',
  },
  {
    title: '돌리고, 늘리고, 마음대로 조절해요',
    desc: '가구의 크기를 바꾸고 방향도 돌릴 수 있어요.\n손에 잡히는 느낌으로 조작해보세요.',
    image: '/assets/images/main-room02.png',
    image2: '/assets/images/room02-box.png',
    bg: 'gradient-02',
  },
  {
    title: '로그인하면 저장까지!',
    desc: '구글 로그인 한 번이면, 내가 만든 방을 저장하고\n나중에 다시 불러와서 이어서 꾸밀 수 있어요.',
    image: '/assets/images/main-room03.png',
    image2: '/assets/images/room03-box.png',
    bg: 'gradient-03',
  },
  {
    title: '앉아서 방 꾸미기 끝!',
    desc: '설치도 필요 없고, 앱도 필요 없어요.\n브라우저에서 바로, 지금 시작하세요.',
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
