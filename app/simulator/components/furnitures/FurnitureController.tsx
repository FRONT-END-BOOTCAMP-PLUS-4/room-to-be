'use client'

import { useState } from 'react'
import { useFurnitureStore } from '@/stores/useFurnitureStore'
import FurnitureSizeInput from './FurnitureSizeInput'
import { Slider } from '@/components/ui/slider'
import { CustomCheckButton } from '@/app/components/buttons/CustomCheckButton'

const scaleInputs = [
  {
    label: '가로',
    key: 'baseX',
    scaleKey: 'scaleX',
    originalKey: 'originalBaseX',
  },
  {
    label: '세로',
    key: 'baseZ',
    scaleKey: 'scaleZ',
    originalKey: 'originalBaseZ',
  },
  {
    label: '높이',
    key: 'baseY',
    scaleKey: 'scaleY',
    originalKey: 'originalBaseY',
  },
] as const

export default function FurnitureController() {
  const { selectedFurniture, updateSelectedFurniture } = useFurnitureStore()
  const [isScaleLocked, setIsScaleLocked] = useState(false)

  return (
    <div
      className='w-[219px] px-[30px] py-[40px] rounded-[30px]
        bg-gradient-to-r from-white/10 to-black/20 backdrop-blur-md
        shadow-[0_0_15px_#00000026] flex flex-col items-center justify-center gap-4'
    >
      <div className='w-full flex flex-col items-center'>
        {selectedFurniture && (
          <>
            <div
              className='mb-2 text-sm font-semibold text-white/70 text-center w-full truncate'
              title={selectedFurniture.name}
            >
              {selectedFurniture.name}
            </div>

            <img
              src={selectedFurniture.thumbnailUrl}
              alt='썸네일'
              className='w-full h-auto rounded-[10px] object-contain'
            />
          </>
        )}
      </div>

      {selectedFurniture && (
        <>
          <div className='w-[159px] h-[28px] px-[10px] rounded-[8px] bg-white/30 flex items-center justify-between'>
            <CustomCheckButton
              checked={isScaleLocked}
              onCheckedChange={(val) => setIsScaleLocked(Boolean(val))}
            />
            <span className='text-[12px] text-white'>크기 비율 유지</span>
          </div>

          {isScaleLocked ? (
            <div className='w-full'>
              <div className='flex h-[39px]'>
                <label className='text-[12px] text-white/70 pt-[6px]'>스케일</label>
              </div>
              <Slider
                value={[Math.round(selectedFurniture.baseX)]}
                min={10}
                max={3000}
                step={1}
                onValueChange={([val]) => {
                  const {
                    originalBaseX,
                    originalBaseY,
                    originalBaseZ,
                    originalScale,
                  } = selectedFurniture

                  const scaleRatio = val / originalBaseX
                  const newScale = scaleRatio * originalScale

                  updateSelectedFurniture({
                    baseX: Math.round(val),
                    baseY: Math.round(originalBaseY * scaleRatio),
                    baseZ: Math.round(originalBaseZ * scaleRatio),
                    scaleX: newScale,
                    scaleY: newScale,
                    scaleZ: newScale,
                  })
                }}
              />
            </div>
          ) : (
            scaleInputs.map(({ label, key, scaleKey, originalKey }) => {
              const baseValue = selectedFurniture[key]
              const originalValue = selectedFurniture[originalKey]
              const isModified = baseValue !== originalValue
              const displayValue = isModified ? baseValue : originalValue

              const handleChange = (val: number) => {
                const newScale = (val / originalValue) * selectedFurniture.originalScale
                updateSelectedFurniture({
                  [key]: Math.round(val),
                  [scaleKey]: newScale,
                })
              }

              return (
                <div key={key} className='w-full'>
                  <FurnitureSizeInput
                    label={label}
                    value={Math.round(displayValue)}
                    onChange={handleChange}
                  />
                  <Slider
                    value={[Math.round(displayValue)]}
                    min={10}
                    max={3000}
                    step={1}
                    onValueChange={([val]) => handleChange(val)}
                    className='mt-2'
                  />
                </div>
              )
            })
          )}
        </>
      )}
    </div>
  )
}