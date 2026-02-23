import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

type Variant = 'primary' | 'ghost' | 'danger' | 'secondary' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25',
  ghost:   'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  danger:  'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 shadow-sm',
  secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white',
  outline: 'bg-transparent border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-8 py-3.5 text-base gap-2.5 rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Omit motion props from HTML props to avoid conflicts
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...buttonProps } = props as any;

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-bold transition-all duration-200 
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...buttonProps}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </motion.button>
  );
}
