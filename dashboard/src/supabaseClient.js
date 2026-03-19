import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tojefhjisctafyvbguqt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvamVmaGppc2N0YWZ5dmJndXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NTIzOTcsImV4cCI6MjA4OTIyODM5N30.65VpUSd4hwbcilaK48MAnpIpdJdXsjJosnzTC04ebNs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
