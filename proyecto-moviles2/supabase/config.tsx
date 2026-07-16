import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://jkhzcgtbwlcdbvzkrppn.supabase.co', 
    'sb_publishable_AY22wAXm0h6pQFKKhCYVkw_JDZzkJJg')