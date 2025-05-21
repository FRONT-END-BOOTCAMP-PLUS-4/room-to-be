// hooks/useSliderProgress.ts

import { useEffect, useRef, useState } from 'react';

/**
 * 슬라이더 자동 진행(Progress Bar) 커스텀 훅
 * - progress(0~100)와 setProgress 반환
 * - autoplay, 슬라이드 변경 등 외부 상태에 반응
 */
export function useSliderProgress({
  playing, // 자동재생 여부
  autoPlayInterval, // 진행 시간(ms)
  onComplete, // 100% 도달 시 실행 함수 (ex. 슬라이드 이동)
  deps = [], // progress를 리셋할 추가 의존성 (예: current)
}: {
  playing: boolean;
  autoPlayInterval: number;
  onComplete: () => void;
  deps?: any[];
}) {
  // 진행 바 상태 (0~100)
  const [progress, setProgress] = useState(0);

  // 현재 progress 값을 참조 (비동기 클로저 문제 방지)
  const progressRef = useRef<number>(0);

  // interval 관리
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. playing이 true일 때, progress를 자동으로 증가시키는 interval 실행
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 100 / (autoPlayInterval / 30); // 약 30ms마다 100%까지 증가
          progressRef.current = next;
          if (next >= 100) return 100;
          return next;
        });
      }, 30);
    }
    // interval 해제 (clean-up)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, ...deps]);

  // 2. progress가 100% 도달 시, onComplete 호출(슬라이드 이동 등), 그리고 progress 리셋
  useEffect(() => {
    if (!playing) return;
    if (progress >= 100) {
      onComplete?.();
      setProgress(0);
      progressRef.current = 0;
    }
  }, [progress, playing]);

  // 3. deps(슬라이드 인덱스 등)가 변경될 때 progress 초기화
  useEffect(() => {
    setProgress(0);
    progressRef.current = 0;
  }, deps);

  // progress 상태와 직접 조작용 setProgress 반환
  return { progress, setProgress };
}
