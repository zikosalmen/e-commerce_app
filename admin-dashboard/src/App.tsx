import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect, type ReactNode, lazy, Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AppShell } from '@/components/layout/AppShell';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductEditPage = lazy(() => import('@/pages/ProductEditPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const UsersPage = lazy(() => import('@/pages/UsersPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AutoPostingPage = lazy(() => import('@/pages/AutoPostingPage'));
const AutoPostLogsPage = lazy(() => import('@/pages/AutoPostLogsPage'));
const AutoReplyPage = lazy(() => import('@/pages/AutoReplyPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function LoadingSpinner() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        border: '3px solid var(--border-color)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  // console.log("user:  , isloading: ",user,isLoading)
  if (!user ) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    const cleanup = initialize();
    return cleanup;
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AppShell />
                </RequireAdmin>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductEditPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="auto-posting" element={<AutoPostingPage />} />
              <Route path="auto-posting/logs" element={<AutoPostLogsPage />} />
              <Route path="auto-reply" element={<AutoReplyPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            fontSize: '14px',
            boxShadow: 'var(--shadow-md)',
          },
        }}
      />
    </QueryClientProvider>
  );
}
