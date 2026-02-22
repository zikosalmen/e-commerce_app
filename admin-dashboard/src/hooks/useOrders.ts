import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: { id: string; name: string; imageUrl: string | null };
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  stripeSessionId: string | null;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string | null; email: string };
  items?: OrderItem[];
}

interface UseOrdersOptions {
  status?: string;
  page?: number;
  pageSize?: number;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { status, page = 1, pageSize = 10 } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return useQuery({
    queryKey: ['orders', { status, page, pageSize }],
    queryFn: async () => {
      let query = supabase
        .from('Order')
        .select('*, user:User(id, name, email), items:OrderItem(*, product:Product(id, name, imageUrl))', { count: 'exact' })
        .order('createdAt', { ascending: false })
        .range(from, to);

      if (status && status !== 'ALL') {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { orders: (data ?? []) as Order[], total: count ?? 0 };
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('Order')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
