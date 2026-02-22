import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, total, pageSize, onPageChange }: PaginationProps) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
      }}
    >
      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        {t('common.showing', { 
          start: (page - 1) * pageSize + 1, 
          end: Math.min(page * pageSize, total), 
          total 
        })}
      </span>

      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            opacity: page <= 1 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            if (totalPages <= 7) return true;
            if (p === 1 || p === totalPages) return true;
            if (Math.abs(p - page) <= 1) return true;
            return false;
          })
          .map((p, idx, arr) => {
            const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
            return (
              <span key={p} style={{ display: 'flex', gap: '4px' }}>
                {showEllipsis && (
                  <span
                    style={{
                      padding: '6px 8px',
                      color: 'var(--text-muted)',
                      fontSize: '13px',
                    }}
                  >
                    …
                  </span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: p === page ? 'none' : '1px solid var(--border-color)',
                    backgroundColor: p === page ? 'var(--accent)' : 'var(--bg-card)',
                    color: p === page ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: p === page ? 600 : 400,
                    minWidth: '36px',
                  }}
                >
                  {p}
                </button>
              </span>
            );
          })}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            opacity: page >= totalPages ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
