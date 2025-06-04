'use client';

import { useEffect, useRef, useState } from 'react';

import type { FurnitureStoreInfo } from '@/app/types/furniture';

import { Slider } from '@/components/ui/slider';

import FurnitureSizeInput from './FurnitureSizeInput';

const scaleInputs = [
  {
    label: '가로',
    key: 'baseX',
    scaleKey: 'scaleX',
    originalBaseKey: 'originalBaseX',
    originalScaleKey: 'originalScaleX',
  },
  {
    label: '세로',
    key: 'baseZ',
    scaleKey: 'scaleZ',
    originalBaseKey: 'originalBaseZ',
    originalScaleKey: 'originalScaleZ',
  },
  {
    label: '높이',
    key: 'baseY',
    scaleKey: 'scaleY',
    originalBaseKey: 'originalBaseY',
    originalScaleKey: 'originalScaleY',
  },
] as const;

interface UnlockedScaleInputsProps {
  furniture: FurnitureStoreInfo;
  onChange: (updates: Record<string, number>, saveHistory?: boolean) => void;
}

export default function UnlockedScaleInputs({
  furniture,
  onChange,
}: UnlockedScaleInputsProps) {
  return (
    <>
      {scaleInputs.map(
        ({ label, key, scaleKey, originalBaseKey, originalScaleKey }) => {
          const baseValue = furniture[key] ?? 0;
          const originalBaseValue = furniture[originalBaseKey] || 1;
          const originalScaleValue = furniture[originalScaleKey] || 1;

          const isModified = baseValue !== originalBaseValue;
          const initialDisplay = isModified ? baseValue : originalBaseValue;

          const [sliderVal, setSliderVal] = useState(initialDisplay);

          // 선택된 가구 바뀌면 슬라이더 초기화
          useEffect(() => {
            setSliderVal(initialDisplay);
          }, [initialDisplay]);

          const update = (val: number, commit = false) => {
            const newBase = Math.round(val);
            const newScale = (val / originalBaseValue) * originalScaleValue;

            onChange(
              {
                [key]: newBase,
                [scaleKey]: newScale,
              },
              commit,
            );
          };
          const dragStartValueRef = useRef<number | null>(null);
          return (
            <div key={key} className='w-full'>
              <FurnitureSizeInput
                label={label}
                value={Math.round(sliderVal)}
                onChange={(val) => {
                  setSliderVal(val);
                  update(val, true);
                }}
              />
              <Slider
                value={[sliderVal]}
                min={10}
                max={3000}
                step={1}
                onPointerDown={() => {
                  dragStartValueRef.current = sliderVal; // 드래그 시작 시 원본 값 저장
                }}
                onValueChange={([val]) => {
                  setSliderVal(val);
                  update(val, false); // 실시간 반영 (히스토리 X)
                }}
                onValueCommit={([val]) => {
                  if (
                    Math.round(val) !==
                    Math.round(dragStartValueRef.current ?? val)
                  ) {
                    update(val, true); // 실제 값이 바뀌었으면 히스토리 저장
                  }
                  dragStartValueRef.current = null;
                }}
              />
            </div>
          );
        },
      )}
    </>
  );
}
