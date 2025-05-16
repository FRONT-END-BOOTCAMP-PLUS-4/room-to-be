'use client';

import BoxTextButton from '../buttons/BoxTextButton';
import TemplateList from '../list/TemplateCard';
import Modal from './Modal';

interface TemplateSelectModalProps {
  onBack: () => void;
}

export default function TemplateSelectModal({
  onBack,
}: TemplateSelectModalProps) {
  const templates = [
    {
      id: 1,
      imageUrl: '/assets/images/room01.jpg',
      tags: ['우드', '내추럴', '미니멀'],
    },
    {
      id: 2,
      imageUrl: '/assets/images/room02.jpg',
      tags: ['미드센추리 모던', '빈티지', '내추럴'],
    },
    {
      id: 3,
      imageUrl: '/assets/images/room03.jpg',
      tags: ['모던', '미니멀', '감성'],
    },
    {
      id: 4,
      imageUrl: '/assets/images/room04.jpg',
      tags: ['게이밍', '하이테크', '퍼플톤'],
    },
    {
      id: 5,
      imageUrl: '/assets/images/room05.jpg',
      tags: ['하이테크', '모던', '다크톤'],
    },
    {
      id: 6,
      imageUrl: '/assets/images/room06.jpg',
      tags: ['모던', '럭셔리', '딥톤'],
    },
  ];
  return (
    <Modal width='1280px' height='773px' onBack={onBack}>
      <div className='flex flex-wrap justify-center'>
        {templates.map(({ id, imageUrl, tags }) => (
          <div
            key={id}
            className='flex flex-col w-[360px] h-[290px] mb-[50px] mx-[13px]'
          >
            <TemplateList imageUrl={imageUrl} alt={'템플릿' + id} />
            <div className='flex gap-2 mt-3'>
              {tags.map((tag, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-center py-[6px] px-[12px] text-[12px] h-[26px] rounded-[6px] bg-white/20 text-white border border-white'
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
