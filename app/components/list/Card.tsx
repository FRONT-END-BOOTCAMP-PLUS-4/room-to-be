import React, { ElementType, forwardRef, ReactNode } from 'react';

interface ListItemProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  [key: string]: any;
}

const Card = forwardRef<HTMLElement, ListItemProps>(
  ({ as: Component = 'li', className = '', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`relative w-full max-w-[400px] aspect-[10/7] rounded-[15px] overflow-hidden ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

// 디버깅용 이름 설정
Card.displayName = 'Card';

export default Card;
