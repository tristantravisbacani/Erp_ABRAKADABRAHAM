(function () {
  'use strict';

  const config = {
    url: 'https://manfvzqubjdzezazwsox.supabase.co',
    publishableKey: 'sb_publishable_zYDEdwdO_Et2jALyTx8B_A_b8VvzQr5'
  };

  let statusRequest = 0;

  window.setSupabaseStatus = function (status) {
    const labels = {
      checking: 'Checking connection',
      connected: 'Connected',
      unavailable: 'Unavailable'
    };
    const descriptions = {
      checking: 'Checking whether the cloud service is reachable. This does not indicate whether you are signed in.',
      connected: 'The cloud authentication service is reachable. This does not indicate whether you are signed in or whether your database permissions are configured.',
      unavailable: 'The cloud service could not be reached. Check your internet connection and try again.'
    };
    document.querySelectorAll('[data-supabase-status]').forEach(function (statusElement) {
      statusElement.textContent = labels[status];
      statusElement.className = 'status-pill status-' + status;
      statusElement.title = descriptions[status];
    });
  };

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('[Supabase] Client library failed to load; cloud features are unavailable.');
    window.supabaseClient = null;
    window.setSupabaseStatus('unavailable');
    return;
  }

  window.supabaseClient = window.supabase.createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });

  async function checkSupabaseAvailability() {
    const request = ++statusRequest;
    window.setSupabaseStatus('checking');
    if (!navigator.onLine) {
      window.setSupabaseStatus('unavailable');
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(function () {
      controller.abort();
    }, 5000);
    try {
      const response = await fetch(config.url + '/auth/v1/health', {
        method: 'GET',
        headers: { apikey: config.publishableKey },
        cache: 'no-store',
        signal: controller.signal
      });
      if (request !== statusRequest) return;
      window.setSupabaseStatus(response.ok ? 'connected' : 'unavailable');
    } catch (error) {
      if (request !== statusRequest) return;
      window.setSupabaseStatus('unavailable');
      console.warn('[Supabase Status Check]', error);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  window.refreshSupabaseStatus = checkSupabaseAvailability;
  checkSupabaseAvailability();
  window.addEventListener('online', checkSupabaseAvailability);
  window.addEventListener('focus', checkSupabaseAvailability);
  window.setInterval(checkSupabaseAvailability, 60000);
  window.addEventListener('offline', function () {
    statusRequest += 1;
    window.setSupabaseStatus('unavailable');
  });
})();
