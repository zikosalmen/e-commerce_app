import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  link?: string;
  isLoading?: boolean;
}

export function StatCard({ label, value, icon: Icon, color, bg, link, isLoading }: StatCardProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
        <div className="skeleton w-12 h-12 mb-4 rounded-xl" />
        <div className="skeleton h-3 w-1/2 mb-2" />
        <div className="skeleton h-8 w-3/4" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => link && navigate(link)}
      className={`
        relative bg-[var(--bg-card)] border border-[var(--border-color)]
        rounded-2xl p-6 shadow-sm group
        transition-all duration-300
        ${link ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
          style={{ backgroundColor: bg }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        
        {link && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
          {value}
        </p>
      </div>
      
      {/* Decorative background element */}
      <div 
        className="absolute -right-2 -bottom-2 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none"
        style={{ color: color }}
      >
        <Icon size={96} />
      </div>
    </motion.div>
  );
}
