// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tgkfynplysrqswbwijzz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRna2Z5bnBseXNycXN3Yndpanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjEyNjYsImV4cCI6MjA2MDIzNzI2Nn0.1n9pgwEzUHezbwn3Inj-o0d5Ryz79fuSDSmJ5gBlJww";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);