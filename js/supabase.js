/**
 * Hope, Inc. ERP — Hybrid Supabase & Offline Data Client
 * Task: S1-DEV-01 Project Scaffold
 * Role: Developer (Kurt Abraham)
 */

(function () {
  'use strict';

  // Default configuration or read from window.SUPABASE_CONFIG
  const config = (typeof window !== 'undefined' && window.SUPABASE_CONFIG) || {
    url: '',
    anonKey: '',
    forceOffline: false
  };

  let supabaseInstance = null;
  let isCloudActive = false;

  // Initialize Supabase cloud client if library and credentials are present
  if (
    !config.forceOffline &&
    config.url &&
    config.url.startsWith('https://') &&
    config.anonKey &&
    typeof window.supabase !== 'undefined'
  ) {
    try {
      supabaseInstance = window.supabase.createClient(config.url, config.anonKey);
      isCloudActive = true;
    } catch (err) {
      console.warn('[DB] Supabase cloud init failed, falling back to offline mode:', err);
      isCloudActive = false;
    }
  }

  // Unified Database Client with transparent LocalStorage fallback
  const dbClient = {
    isCloud: function () {
      return isCloudActive;
    },

    getClient: function () {
      return supabaseInstance;
    },

    // Read collection
    select: async function (table) {
      if (isCloudActive && supabaseInstance) {
        try {
          const { data, error } = await supabaseInstance.from(table).select('*');
          if (!error && data) return data;
          console.warn(`[DB] Cloud select failed for ${table}, falling back:`, error);
        } catch (e) {
          console.warn(`[DB] Network error during select for ${table}:`, e);
        }
      }
      const local = localStorage.getItem(`hope_erp_${table}`);
      return local ? JSON.parse(local) : [];
    },

    // Save collection
    saveAll: async function (table, data) {
      localStorage.setItem(`hope_erp_${table}`, JSON.stringify(data));
      if (isCloudActive && supabaseInstance) {
        try {
          await supabaseInstance.from(table).upsert(data);
        } catch (e) {
          console.warn(`[DB] Cloud upsert failed for ${table}:`, e);
        }
      }
      return data;
    }
  };

  window.dbClient = dbClient;

  // Signal DB readiness
  document.addEventListener('DOMContentLoaded', function () {
    const event = new CustomEvent('dbReady', {
      detail: {
        mode: isCloudActive ? 'cloud' : 'offline',
        url: config.url || 'local'
      }
    });
    window.dispatchEvent(event);
  });
})();
