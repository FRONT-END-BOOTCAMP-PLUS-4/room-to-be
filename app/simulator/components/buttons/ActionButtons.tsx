'use client';

import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  mode: 'create' | 'edit';
  onSaveClick: () => void;
}

export default function ActionButtons({
  mode,
  onSaveClick,
}: ActionButtonsProps) {
  return (
    <div className='flex gap-2'>
      <Button
        onClick={() => history.back()}
        className='
        w-[74.5px] h-8
        bg-white/30 text-white
        hover:bg-white/40
        rounded-lg
        border-none shadow-none
        font-normal text-[12px]
        transition
      '
      >
        나가기
      </Button>
      <Button
        onClick={onSaveClick}
        className='
        w-[74.5px] h-8
        bg-white/30 text-white
        hover:bg-white/40
        rounded-lg
        border-none shadow-none
        font-normal text-[12px]
        transition
      '
      >
        {mode === 'edit' ? '수정하기' : '저장하기'}
      </Button>
    </div>
  );
}
