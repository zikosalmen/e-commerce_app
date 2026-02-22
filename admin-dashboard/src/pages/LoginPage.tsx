import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@ecommerce.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password)
      toast.success(t('auth.welcome'));
      navigate('/admin');
    } catch (err: unknown) {
      console.error('Login error:', err);
      let message = t('auth.failed');
      if (err instanceof Error) {
        message = err.message;
        if (message.includes('Invalid login credentials')) {
            message = t('auth.invalid');
        }
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        padding: '16px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.1), transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '24px',
              color: '#fff',
              marginBottom: '16px',
              boxShadow: '0 8px 32px rgba(124,58,237,0.3)',
            }}
          >
            A
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#F8FAFC',
              marginBottom: '4px',
            }}
          >
            {t('auth.title')}
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>
            {t('auth.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#94A3B8',
                marginBottom: '6px',
              }}
            >
              {t('auth.emailLabel')}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B',
                }}
              />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-sans)',
                }
              }
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#94A3B8',
                marginBottom: '6px',
              }}
            >
              {t('auth.passwordLabel')}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B',
                }}
              />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: loading
                ? 'linear-gradient(135deg, #6D28D9, #7C3AED)'
                : 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {loading ? t('auth.signingIn') : t('auth.signIn')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
