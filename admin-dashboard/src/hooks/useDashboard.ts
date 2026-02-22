import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    status: string;
    total: number;
    createdAt: string;
    user?: { name: string | null; email: string };
  }>;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [productsRes, categoriesRes, ordersRes, recentRes] = await Promise.all([
        supabase.from('Product').select('id', { count: 'exact', head: true }),
        supabase.from('Category').select('id', { count: 'exact', head: true }),
        supabase.from('Order').select('id, total', { count: 'exact' }),
        supabase
          .from('Order')
          .select('id, status, total, createdAt, user:User(name, email)')
          .order('createdAt', { ascending: false })
          .limit(5),
      ]);

      const totalRevenue = (ordersRes.data ?? []).reduce(
        (sum: number, o: { total: number }) => sum + o.total,
        0
      );

      const recentOrders = (recentRes.data ?? []).map((order: Record<string, unknown>) => ({
        id: order.id as string,
        status: order.status as string,
        total: order.total as number,
        createdAt: order.createdAt as string,
        user: Array.isArray(order.user) ? order.user[0] : order.user,
      }));

      return {
        totalProducts: productsRes.count ?? 0,
        totalCategories: categoriesRes.count ?? 0,
        totalOrders: ordersRes.count ?? 0,
        totalRevenue,
        recentOrders,
      } as DashboardStats;
    },
  });
}
