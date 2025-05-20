'use client';

import clsx from 'clsx';

import { Checkbox } from '@/components/ui/checkbox';

type CustomCheckButtonProps = {
  id?: string;
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function CustomCheckButton({
  id = 'custom-check',
  className,
  checked,
  defaultChecked,
  onCheckedChange,
}: CustomCheckButtonProps) {
  return (
    <Checkbox
      id={id}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      className={clsx(
        'w-3 h-3 rounded-[2px] border border-white ',
        'data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20',
        'text-black flex items-center justify-center transition',
        className,
      )}
    />
  );
}
