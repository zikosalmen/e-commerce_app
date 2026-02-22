import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface AutoReplySettings {
  id?: string;
  is_active: boolean;
  fetch_fb_messages: boolean;
  fetch_ig_messages: boolean;
  fetch_fb_comments: boolean;
  fetch_ig_comments: boolean;
  created_at?: string;
}

export function useAutoReplySettings() {
  return useQuery({
    queryKey: ['auto-reply-settings'],
    queryFn: async (): Promise<AutoReplySettings | null> => {
      const res = await fetch(`${API_BASE}/api/auto-reply/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const json = await res.json();
      return json.settings ?? null;
    },
    staleTime: 30_000,
  });
}

export function useSaveAutoReplySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: AutoReplySettings) => {
      const res = await fetch(`${API_BASE}/api/auto-reply/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-reply-settings'] });
      toast.success('Conversational bridge synchronized ✅');
    },
    onError: () => {
      toast.error('Failed to sync settings');
    },
  });
}
