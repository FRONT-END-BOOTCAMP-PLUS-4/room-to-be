import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Props {
  value: 'wall' | 'floor';
  onChange: (val: 'wall' | 'floor') => void;
}

export default function PlacementToggle({ value, onChange }: Props) {
  return (
    <ToggleGroup
      type='single'
      value={value}
      onValueChange={(val) => {
        if (val === 'wall' || val === 'floor') onChange(val);
      }}
      className='mb-2 flex justify-start gap-2'
    >
      <ToggleGroupItem value='floor' asChild>
        <button className='h-[30px] w-[60px] text-white text-[11px] font-medium border border-white bg-white/20 rounded-md px-2 leading-none text-center hover:bg-white/40 hover:text-white data-[state=on]:bg-white/50 data-[state=on]:text-white transition'>
          바닥
        </button>
      </ToggleGroupItem>

      <ToggleGroupItem value='wall' asChild>
        <button className='h-[30px] w-[60px] text-white text-[11px] font-medium border border-white bg-white/30 rounded-md px-2 py-[1px] leading-none min-h-0 text-center hover:bg-white/40 hover:text-white data-[state=on]:bg-white/50 data-[state=on]:text-white transition'>
          벽
        </button>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
