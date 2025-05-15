'use client'

import { useRouter } from 'next/navigation';
import Modal from './Modal';
import StartModalItem from './StartModalItem';

export default function InteriorStartModal() {
  const router = useRouter();

  return (
    <Modal width='864px' height='564px'>
      <div className='flex justify-around w-full'>
        <StartModalItem
          alt='빈 프로젝트 이미지'
          src='/assets/images/newroom.png'
          contentText='비어있는 페이지에서 인테리어를 시작합니다.'
          btnText='빈 프로젝트 시작하기'
          onClick={()=>'현재모달 닫고 Template Select 모달 뜨게해야 함'}
        />
        <div className='h-[450px] w-px bg-white' />
        <StartModalItem
          alt='템플릿 이미지'
          src='/assets/images/template.png'
          contentText='템플릿을 사용하여 인테리어를 시작합니다.'
          btnText='템플릿으로 시작하기'
          onClick={()=>'현재모달 닫고 Room Size 모달 뜨게해야 함'}
        />
      </div>
    </Modal>
  );
}
