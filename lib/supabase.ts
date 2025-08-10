import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use valid placeholder URLs to prevent initialization errors
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

// Check if we have valid Supabase configuration
const isValidSupabaseConfig = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder' &&
         supabaseUrl.includes('.supabase.co');
};

// Create Supabase client only if we have valid configuration
let supabase: ReturnType<typeof createClient<Database>> | null = null;

try {
  if (isValidSupabaseConfig()) {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'tcg-lean-coach-app',
        },
      },
    });
  }
} catch (error) {
  console.warn('Supabase initialization failed:', error);
  supabase = null;
}

export { supabase };

// Database connection status
export const isSupabaseConnected = () => {
  return supabase !== null && isValidSupabaseConfig();
};

// Test database connection
export const testConnection = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  
  try {
    const { data, error } = await supabase.from('courses').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

// Auth helpers
export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, metadata?: any) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};