type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/12 text-emerald-500',
  warning: 'bg-amber-500/12 text-amber-500',
  danger:  'bg-red-500/12 text-red-500',
  info:    'bg-blue-500/12 text-blue-500',
  neutral: 'bg-[var(--bg-input)] text-[var(--text-muted)]',
  purple:  'bg-[var(--accent-bg)] text-[var(--accent)]',
};

// Map common status strings to variants automatically
export function statusVariant(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (['delivered', 'paid', 'active', 'posted', 'approved'].includes(s)) return 'success';
  if (['pending', 'processing'].includes(s)) return 'warning';
  if (['cancelled', 'rejected'].includes(s)) return 'danger';
  if (['shipped', 'refunded'].includes(s)) return 'info';
  return 'neutral';
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
