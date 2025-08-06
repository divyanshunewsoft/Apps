import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // If Supabase is not configured, set loading to false and return
    if (!supabase) {
      if (isMounted) {
        setLoading(false);
      }
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    signIn: (email: string, password: string) => 
      supabase ? supabase.auth.signInWithPassword({ email, password }) : Promise.reject(new Error('Supabase not configured')),
    signUp: (email: string, password: string) => 
      supabase ? supabase.auth.signUp({ email, password }) : Promise.reject(new Error('Supabase not configured')),
    signOut: () => 
      supabase ? supabase.auth.signOut() : Promise.reject(new Error('Supabase not configured')),
  };
}