/**
 * Hope, Inc. ERP — Core Application Bootstrap
 * Task: Alignment with Final Prototype
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

  // ========== Security & String Helpers ==========
  window.escapeHtml = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Makes a value safe inside an inline handler such as onclick="fn('${jsArg(x)}')".
  // Escaped for the JS string first, then for the HTML attribute.
  window.jsArg = function (value) {
    return window.escapeHtml(
      String(value == null ? '' : value)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/[\r\n]+/g, ' ')
    );
  };

  // ========== Date Helpers (Local Time to Prevent Day-Shift Bugs) ==========
  window.localDateStr = function (d) {
    const dateObj = d ? new Date(d) : new Date();
    return (
      dateObj.getFullYear() +
      '-' +
      String(dateObj.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(dateObj.getDate()).padStart(2, '0')
    );
  };

  window.todayStr = function () {
    return window.localDateStr(new Date());
  };

  // ========== DOM & Focus Helpers ==========
  // Locks page scrolling only while at least one modal overlay is open.
  window.syncBodyScroll = function () {
    document.body.style.overflow = document.querySelector('.modal-overlay.active') ? 'hidden' : '';
  };

  // Re-draws a screen from a search box's oninput handler without losing the cursor.
  window.rerenderKeepFocus = function (renderFn) {
    const a = document.activeElement;
    const key = a && a.getAttribute ? a.getAttribute('data-focus-key') : null;
    let start = null,
      end = null;
    if (key) {
      try {
        start = a.selectionStart;
        end = a.selectionEnd;
      } catch (err) {}
    }
    renderFn();
    if (key) {
      const el = document.querySelector('[data-focus-key="' + key + '"]');
      if (el) {
        el.focus();
        try {
          if (start !== null) el.setSelectionRange(start, end);
        } catch (err) {}
      }
    }
  };

  // ========== Modal Controls ==========
  window.openModal = function (name) {
    const modalEl = document.getElementById(name + 'Modal');
    if (!modalEl) {
      const f = document.getElementById(name + 'Email');
      if (f) f.focus();
      return;
    }
    modalEl.classList.add('active');
    window.syncBodyScroll();
  };

  window.closeModal = function (name) {
    const modal = document.getElementById(name + 'Modal');
    if (modal) modal.classList.remove('active');
    window.syncBodyScroll();
    const error = document.getElementById(name + 'Error');
    const success = document.getElementById(name + 'Success');
    if (error) {
      error.classList.remove('show');
      error.textContent = '';
    }
    if (success) {
      success.classList.remove('show');
      success.textContent = '';
    }
  };

  window.switchModal = function (from, to) {
    window.closeModal(from);
    setTimeout(function () {
      window.openModal(to);
    }, 200);
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

  // Setup modal overlay outside click & escape handlers
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          window.closeModal(overlay.id.replace('Modal', ''));
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        ['login', 'register', 'reset'].forEach(function (name) {
          window.closeModal(name);
        });
      }
    });
  });

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
