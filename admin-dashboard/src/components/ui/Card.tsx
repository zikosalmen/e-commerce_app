import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: boolean;
}

export function Card({ children, className = '', style, padding = true }: CardProps) {
  return (
    <div
      style={style}
      className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--border-radius)] shadow-[var(--shadow-sm)] ${padding ? 'p-5 lg:p-6' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
