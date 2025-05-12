
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmslwsxawesophtbfzsz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtc2x3c3hhd2Vzb3BodGJmenN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTk3NjksImV4cCI6MjA2MTA5NTc2OX0.lENEWmZGEVodHgEa4HzSaoE7Rq1dZ9_4cVlr2av1b2U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
