import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => () => void; 
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  initialized: false,
  login: async (email: string, password: string) => {
    if(!supabase){
      throw new Error('Supabase client not initialized');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
     if(!supabase){
      throw new Error('Supabase client not initialized');
    }
    
    const role = data.user?.user_metadata?.role;
    console.log('Login successful, role:', role);
    
    if (role !== 'ADMIN') {
      await supabase.auth.signOut();
      throw new Error('Access denied. Admin role required.');
    }

    set({ user: data.user, session: data.session, isLoading: false });
  },

  logout: async () => {
     if(!supabase){
      throw new Error('Supabase client not initialized');
    }
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  initialize: () => {
    if (get().initialized) return () => {};

    set({ initialized: true });
     if(!supabase){
      throw new Error('Supabase client not initialized');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const role = session.user?.user_metadata?.role;
        if (role === 'ADMIN') {
          
          set({ user: session.user, session, isLoading: false });
        } else {
           if(!supabase){
      throw new Error('Supabase client not initialized');
    }
          
          supabase.auth.signOut();
          set({ user: null, session: null, isLoading: false });
        }
      } else {
        set({ user: null, session: null, isLoading: false });
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        set({ user: null, session: null, isLoading: false });
      } else if (session) {
        const role = session.user?.user_metadata?.role;
        if (role === 'ADMIN') {
          set({ user: session.user, session, isLoading: false });
        } else if (event === 'SIGNED_IN') {
           if(!supabase){
      throw new Error('Supabase client not initialized');
    }
           await supabase.auth.signOut();
           set({ user: null, session: null, isLoading: false });
        }
      } else {
          set({ isLoading: false });
      }
    });
    
    return () => subscription.unsubscribe();
  },
}));
