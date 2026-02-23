import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest text-[11px]">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}
