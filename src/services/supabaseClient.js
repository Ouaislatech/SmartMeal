import { createClient } from '@supabase/supabase-js';

// Créer un client Supabase avec les clés d'API
const supabaseUrl = 'https://zmmsxmowcmjesuzebbks.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptbXN4bW93Y21qZXN1emViYmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMDQ1ODksImV4cCI6MjA1OTY4MDU4OX0.Wzz7pQAZnxoc1kQ_cPARAXUKPDX-SbJM0oqrr-55u_A';

// Initialiser le client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
