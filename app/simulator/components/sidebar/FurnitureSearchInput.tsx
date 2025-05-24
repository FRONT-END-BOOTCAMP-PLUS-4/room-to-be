interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function FurnitureSearchInput({ value, onChange }: Props) {
  return (
    <input
      placeholder="가구 검색"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full mb-6 bg-white/30 text-white placeholder:text-white/70 border border-white 
        px-3 py-2 rounded-md leading-none transition
        focus:outline-none focus:ring-0 focus:border-white focus:shadow-none 
        hover:bg-white/40 hover:border-white
      "
    />
  );
}
