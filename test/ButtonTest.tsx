'use client';
import BoxTextButton from '@/app/components/BoxTextButton';
import CircleIconButton from '@/app/components/CircleIconButton';
import IconButton from '@/app/components/IconButton';
import OnlyTextButton from '@/app/components/OnlyTextButton';

export default function ButtonTest() {
  return (
    <>
      <div className='flex gap-2'>
        <BoxTextButton>화살표 BoxTextButton</BoxTextButton>
        <BoxTextButton showImg={true}>화살표</BoxTextButton>
      </div>
      <div className='flex gap-2'>
        <OnlyTextButton>OnlyTextButton</OnlyTextButton>
        <OnlyTextButton showImage={true}>OnlyTextButton</OnlyTextButton>
      </div>
      <div className='flex gap-2'>
        <IconButton width={15} height={15} imageSrc='/assets/icons/stop.svg' />
        <IconButton width={15} height={15} imageSrc='/assets/icons/pause.svg' />
        <IconButton width={15} height={15} imageSrc='/assets/icons/kebab.svg' />
        <IconButton width={23} height={45} imageSrc='/assets/icons/left.svg' />
        <IconButton width={23} height={45} imageSrc='/assets/icons/right.svg' />
        <IconButton width={30} height={30} imageSrc='/assets/icons/cross.svg' />
      </div>
      <div className='flex gap-2'>
        <CircleIconButton imageSrc='assets/icons/trash.svg' />
        <CircleIconButton imageSrc='assets/icons/share.svg' />
      </div>
    </>
  );
}
