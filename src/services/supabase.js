import { createClient } from '@supabase/supabase-js';

// Project URL daripada Supabase Data API (tanpa akhiran /rest/v1/)
const SUPABASE_URL = 'https://axwouvsqibqbhaikaxbf.supabase.co'; 

// Masukkan Publishable Key / Anon Key anda dari menu API Keys
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4d291dnNxaWJxYmhhaWtheGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NzUzMzEsImV4cCI6MjEwODU1MTMzMX0.Fem1tb7c_u18dbYoWG80sNiZC6Nm-Sq3E2zzA3Nrl3M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);