(function () {
  'use strict';

  const config = {
    url: 'https://manfvzqubjdzezazwsox.supabase.co',
    publishableKey: 'sb_publishable_zYDEdwdO_Et2jALyTx8B_A_b8VvzQr5'
  };

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('[Supabase] Client library failed to load; cloud features are unavailable.');
    window.supabaseClient = null;
    return;
  }

  window.supabaseClient = window.supabase.createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
})();
