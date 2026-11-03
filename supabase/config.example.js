// Template configuration for connecting the ERP website to Supabase.
// Copy this file or fill in your project credentials in js/supabase.js.

const SUPABASE_CONFIG = {
  // Replace with your project URL from Supabase Dashboard -> Settings -> API
  url: 'https://YOUR_PROJECT_ID.supabase.co',

  // Replace with your anon public API key from Supabase Dashboard -> Settings -> API
  anonKey: 'YOUR_SUPABASE_ANON_PUBLIC_KEY',

  // Optional: set to true to force offline localStorage mode even with internet access
  forceOffline: false
};

if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
