import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  imageUrl: string | null;
  images: string;
  categoryId: string;
  category?: { id: string; name: string };
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  imageUrl?: string | null;
  images?: string;
  categoryId: string;
  featured: boolean;
  isActive: boolean;
}

interface UseProductsOptions {
  search?: string;
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { search = '', categoryId, page = 1, pageSize = 10 } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return useQuery({
    queryKey: ['products', { search, categoryId, page, pageSize }],
    queryFn: async () => {
      let query = supabase
        .from('Product')
        .select('*, category:Category(*)', { count: 'exact' })
        .order('createdAt', { ascending: false })
        .range(from, to);

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      if (categoryId) {
        query = query.eq('categoryId', categoryId);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { products: (data ?? []) as Product[], total: count ?? 0 };
    },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('Product')
        .select('*, category:Category(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: ProductFormData) => {
      // Provide an ID since it violating non-null constraint
      const payload = {
        ...product,
        id: `prod_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`
      };
      
      const { data, error } = await supabase
        .from('Product')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }: ProductFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('Product')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('Product').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
