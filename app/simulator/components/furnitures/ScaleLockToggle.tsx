'use client';

import { CustomCheckButton } from '@/app/components/buttons/CustomCheckButton';

interface ScaleLockToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

export default function ScaleLockToggle({
  checked,
  onChange,
}: ScaleLockToggleProps) {
  return (
    <div className='w-[159px] h-[28px] px-[10px] rounded-[8px] bg-white/30 flex items-center justify-between'>
      <CustomCheckButton
        checked={checked}
        onCheckedChange={(val) => onChange(Boolean(val))}
      />
      <span className='text-[12px] text-white'>크기 비율 유지</span>
    </div>
  );
}
