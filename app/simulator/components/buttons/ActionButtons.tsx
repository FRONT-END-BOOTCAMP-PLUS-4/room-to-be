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
    <div className='flex gap-2 font-medium text-base'>
      <Button
        onClick={() => history.back()}
        className='
        w-[74.5px]
        bg-white/30 text-white
        hover:bg-white/40
        rounded-lg py-2
        border-none shadow-none
        transition
      '
      >
        나가기
      </Button>
      <Button
        onClick={onSaveClick}
        className='
        w-[74.5px]
        bg-white/30 text-white
        hover:bg-white/40
        rounded-lg py-2
        border-none shadow-none
        transition
      '
      >
        {mode === 'edit' ? '수정하기' : '저장하기'}
      </Button>
    </div>
  );
}
