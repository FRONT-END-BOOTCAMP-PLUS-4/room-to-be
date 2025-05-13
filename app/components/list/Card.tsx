import { ElementType, ReactNode } from 'react';

interface ListItemProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  [key: string]: any;
}

export default function ListItem({
  as: Component = 'li',
  className = '',
  children,
  ...props
}: ListItemProps) {
  return (
    <Component
      className={`relative w-full max-w-[400px] aspect-[10/7] rounded-[15px] overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
