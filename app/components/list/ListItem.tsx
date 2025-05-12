import { ReactNode } from 'react';

interface ListItemProps {
  className?: string;
  children: ReactNode;
  [key: string]: any;
}

export default function ListItem({
  className = '',
  children,
  ...props
}: ListItemProps) {
  return (
    <li
      className={`relative w-full max-w-[400px] aspect-[10/7] rounded-[15px] overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </li>
  );
}
