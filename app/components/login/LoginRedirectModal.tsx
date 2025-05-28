'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useLoginRedirectModalStore } from '@/stores/useLoginRedirectModalStore';

export default function LoginRedirectModal() {
  const { open, closeModal } = useLoginRedirectModalStore();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeModal]);

  if (!open) return null;

  const handleConfirm = () => {
    closeModal();
    router.push('/login');
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-[#a86629cc] to-[#714326cc] backdrop-blur-sm'
      onClick={closeModal}
    >
      <div
        className='
          relative
          bg-white/20
          backdrop-blur-2xl
          rounded-2xl
          shadow-2xl
          p-7
          w-full
          max-w-xs
          border
          border-white/30
          flex flex-col
          items-center
        '
        style={{
          boxShadow: '0 4px 32px 0 rgba(48, 27, 1, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기(X) 버튼 */}
        <button
          onClick={closeModal}
          className='absolute top-5 right-5 text-white/80 hover:text-white transition'
        >
          <X size={22} />
        </button>
        <h2 className='text-white text-base font-semibold mb-2 text-center'>
          로그인이 필요합니다
        </h2>
        <p className='text-sm mb-6 text-white/80 text-center'>
          로그인 페이지로 이동하시겠습니까?
        </p>
        <div className='flex gap-2 w-full justify-center'>
          <button
            className='
              px-4 py-2 rounded-xl 
              bg-white/40 
              hover:bg-white/60 
              text-white
              font-semibold 
              transition 
              border border-white/60
              shadow
            '
            onClick={handleConfirm}
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
