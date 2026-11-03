/**
 * Hope, Inc. ERP — Core Application Bootstrap
 * Task: S1-DEV-01 Project Scaffold
 * Role: Developer (Kurt Abraham)
 */

(function () {
  'use strict';

  // Global App State
  window.currentUser = null;

  // Connection status pill updater
  window.addEventListener('dbReady', function (e) {
    const statusPill = document.getElementById('dbStatusPill');
    if (statusPill) {
      if (e.detail.mode === 'cloud') {
        statusPill.textContent = '● Supabase Cloud';
        statusPill.className = 'status-pill status-cloud';
      } else {
        statusPill.textContent = '○ Local Storage (Offline Mode)';
        statusPill.className = 'status-pill status-offline';
      }
    }
    console.info(`[Hope ERP] Database layer ready in ${e.detail.mode.toUpperCase()} mode.`);
  });

  // Modal Control Helpers
  window.openModal = function (name) {
    const el = document.getElementById(name + 'Modal');
    if (el) el.classList.add('active');
  };

  window.closeModal = function (name) {
    const el = document.getElementById(name + 'Modal');
    if (el) el.classList.remove('active');
  };

  window.switchModal = function (from, to) {
    window.closeModal(from);
    window.openModal(to);
  };

  // Toggle Password Visibility
  window.togglePassword = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁';
    }
  };

  // Temporary stubs for forms until assigned PRs arrive
  window.handleLogin = function (e) {
    if (e) e.preventDefault();
    console.log('[Auth] Login handler placeholder (PR S1-DEV-03)');
  };

  window.handleRegister = function (e) {
    if (e) e.preventDefault();
    console.log('[Auth] Register handler placeholder (PR S1-DEV-02)');
  };

  window.handleGoogleSignIn = function () {
    console.log('[Auth] Google OAuth handler placeholder');
    alert('Google OAuth integration configured. Set OAuth credentials in Supabase to enable.');
  };
})();
