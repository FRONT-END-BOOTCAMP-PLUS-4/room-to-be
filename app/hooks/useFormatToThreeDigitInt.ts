export default function formatToThreeDigitInt(value: number): number {
  const abs = Math.abs(value);
  let scaled = abs;

  if (abs < 1) {
    scaled = abs * 1000;
  } else if (abs < 100) {
    scaled = abs * 10;
  }

  return Math.min(999, Math.round(scaled));
}
