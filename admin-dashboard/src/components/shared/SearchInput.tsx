import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  const { t } = useTranslation();
  const finalPlaceholder = placeholder || t('common.search');
  return (
    <div
      style={{
        position: 'relative',
        maxWidth: '320px',
        width: '100%',
      }}
    >
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={finalPlaceholder}
        style={{
          width: '100%',
          padding: '10px 36px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          fontFamily: 'var(--font-sans)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-bg)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '2px',
            display: 'flex',
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
