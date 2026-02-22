import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface AppUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  createdAt: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('User')
        .select('id, name, email, role, image, createdAt')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return (data ?? []) as AppUser[];
    },
  });
}
