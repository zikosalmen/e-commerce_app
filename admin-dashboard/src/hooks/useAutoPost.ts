import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// ---- Types ----
export interface AutoPostSettings {
  id?: string;
  is_active: boolean;
  source_type: 'product' | 'category' | 'random';
  product_id?: string | null;
  category_id?: string | null;
  only_promo: boolean;
  frequency_type: 'interval' | 'daily_count';
  interval_hours?: number | null;
  posts_per_day?: number | null;
  scheduled_times: string[];
  start_date: string;
  end_date?: string | null;
  require_email_confirmation: boolean;
  global_text: string;
}

export interface AutoPostLog {
  id: string;
  product_id: string | null;
  product_name: string | null;
  product_price: number | null;
  generated_text: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'posted' | 'cancelled';
  scheduled_time: string | null;
  created_at: string;
  approved_at: string | null;
  webhook_payload: Record<string, unknown> | null;
}

// ---- Hooks ----

export function useAutoPostSettings() {
  return useQuery({
    queryKey: ['auto-post-settings'],
    queryFn: async (): Promise<AutoPostSettings | null> => {
      const res = await fetch(`${API_BASE}/api/auto-post/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const json = await res.json();
      return json.settings ?? null;
    },
    staleTime: 30_000,
  });
}

export function useSaveAutoPostSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: AutoPostSettings) => {
      const res = await fetch(`${API_BASE}/api/auto-post/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-post-settings'] });
      queryClient.invalidateQueries({ queryKey: ['auto-post-logs'] });
      toast.success('Settings saved & sent to n8n ✅');
    },
    onError: () => {
      toast.error('Failed to save settings');
    },
  });
}

export function useAutoPostLogs() {
  return useQuery({
    queryKey: ['auto-post-logs'],
    queryFn: async (): Promise<AutoPostLog[]> => {
      const res = await fetch(`${API_BASE}/api/auto-post/logs`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      const json = await res.json();
      return json.logs ?? [];
    },
    staleTime: 10_000,
    refetchInterval: 30_000, // auto-refresh every 30s
  });
}

export function useUpdateLogStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${API_BASE}/api/auto-post/logs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update log');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-post-logs'] });
      toast.success('Log status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });
}
