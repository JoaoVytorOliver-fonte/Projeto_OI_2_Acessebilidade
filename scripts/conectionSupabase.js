const supabaseUrl = process.env.supabaseUrl
const supabaseKey = process.env.supabaseKey

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey)