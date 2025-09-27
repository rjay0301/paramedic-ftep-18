
import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key
const supabaseUrl = 'https://dmhwcjewqmfopfcblqcg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtaHdjamV3cW1mb3BmY2JscWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Mzg5MDAsImV4cCI6MjA1ODExNDkwMH0.bjI7es013LkXf41gF5_6jrf6LGd-yTGkxNSaiDCKe4o';

// Create Supabase client with production-ready configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    storage: localStorage,
    storageKey: 'ftep.auth.token',
  },
  global: {
    headers: {
      'x-client-info': 'ftep-react-app'
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
