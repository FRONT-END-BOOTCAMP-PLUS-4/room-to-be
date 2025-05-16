export default function useFormatToThreeDigitInt(scale: number, size: number): number {
  // scale이 0.01 ~ 1 사이로 가정
  const clampedScale = Math.min(Math.max(scale, 0.01), 1); // 0.01 ~ 1 제한

  // scale=0.01 => multiplier=10
  // scale=1 => multiplier=1000
  
  // 선형 보간 계산
  const multiplier = 10 + (clampedScale - 0.01) * ((1000 - 10) / (1 - 0.01));

  const result = Math.min(3000, Math.round(size * multiplier));
  return result;
}