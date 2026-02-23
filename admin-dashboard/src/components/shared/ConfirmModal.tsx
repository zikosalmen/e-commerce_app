import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  if (!open) return null;

  const finalConfirmLabel = confirmLabel || t('common.confirm');
  const finalCancelLabel = cancelLabel || t('common.cancel');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--border-radius)',
          padding: '24px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.15s ease-out',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: '24px',
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {finalCancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: variant === 'danger' ? 'var(--danger)' : 'var(--accent)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {finalConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
