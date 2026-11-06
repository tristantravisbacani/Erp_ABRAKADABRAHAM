(function () {
  'use strict';

  // ========== Form Handlers ==========
  window.handleRegister = function (e) {
    if (e) e.preventDefault();
    try {
      const firstName = document.getElementById('regFirstName').value.trim();
      const lastName = document.getElementById('regLastName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const errorEl = document.getElementById('registerError');
      const successEl = document.getElementById('registerSuccess');

      if (errorEl) errorEl.classList.remove('show');
      if (successEl) successEl.classList.remove('show');

      if (!firstName || !lastName || !email) {
        if (errorEl) {
          errorEl.textContent = 'Please fill in all fields.';
          errorEl.classList.add('show');
        }
        return;
      }

      if (window.findUser(email)) {
        if (errorEl) {
          errorEl.textContent = 'An account with this email already exists. Please sign in.';
          errorEl.classList.add('show');
        }
        return;
      }

      const newUser = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: 'user',
        status: 'pending',
        perms: window.emptyPermissions()
      };
      window.upsertUser(newUser);

      if (successEl) {
        successEl.textContent =
          'Registration submitted. An admin must approve your account before you can sign in.';
        successEl.classList.add('show');
      }
      const form = document.getElementById('registerForm');
      if (form) form.reset();
    } catch (err) {
      console.error('[Register Error]', err);
    }
  };

  window.handleLogin = function (e) {
    if (e) e.preventDefault();
    try {
      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');
      const errorEl = document.getElementById('loginError');

      if (errorEl) {
        errorEl.classList.remove('show');
        errorEl.textContent = '';
      }

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!email || !password) {
        if (errorEl) {
          errorEl.textContent = 'Please fill in all fields.';
          errorEl.classList.add('show');
        }
        return;
      }

      let user = window.findUser(email);
      if (!user) {
        if (errorEl) {
          errorEl.textContent = 'No account found for this email. Please create a new account first.';
          errorEl.classList.add('show');
        }
        return;
      }

      // Normalize status and permissions for seed/legacy users
      if (!user.status) user.status = 'active';
      if (!user.perms) {
        user.perms =
          user.role === 'superadmin' || user.role === 'admin'
            ? window.fullPermissions()
            : window.sampleUserPermissions();
        window.upsertUser(user);
      }

      const statusProblem = window.accountStatusError(user);
      if (statusProblem) {
        if (errorEl) {
          errorEl.textContent = statusProblem;
          errorEl.classList.add('show');
        }
        return;
      }

      window.currentUser = {
        email: user.email,
        name: (user.firstName + ' ' + (user.lastName || '')).trim(),
        role: user.role,
        firstName: user.firstName || 'User'
      };

      try {
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe && rememberMe.checked) {
          localStorage.setItem('hope_erp_remember_email', email);
        } else {
          localStorage.removeItem('hope_erp_remember_email');
        }
      } catch (err) {}

      if (typeof window.saveSession === 'function') {
        window.saveSession(window.currentUser);
      }
      if (typeof window.showDashboard === 'function') {
        window.showDashboard();
      }
    } catch (err) {
      console.error('[Login error]', err);
      const errorEl = document.getElementById('loginError');
      if (errorEl) {
        errorEl.textContent = 'Login failed: ' + err.message;
        errorEl.classList.add('show');
      }
    }
  };

  window.accountStatusError = function (user) {
    if (!user) return 'User account not found.';
    if (user.status === 'blocked') return 'This account is blocked. Contact an administrator.';
    if (user.status === 'pending') return 'This account is pending approval. Contact an administrator.';
    if (user.status === 'disapproved' || user.status === 'rejected') return 'This registration was not approved.';
    return '';
  };

  // ========== Permissions Checking ==========
  window.can = function (perm) {
    if (!window.currentUser) return false;
    if (window.currentUser.role === 'superadmin' || window.currentUser.role === 'admin') return true;
    const u = window.findUser(window.currentUser.email);
    if (!u || !u.perms) return false;
    return !!u.perms[perm];
  };

  window.canModule = function (mod) {
    return window.can(mod + '.view');
  };

  // ========== Session Persistence Helpers ==========
  window.saveSession = function (user) {
    try {
      localStorage.setItem('hope_erp_session_v4', JSON.stringify(user));
    } catch (e) {}
  };

  window.getSession = function () {
    try {
      const s = localStorage.getItem('hope_erp_session_v4');
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  };

  window.clearSession = function () {
    try {
      localStorage.removeItem('hope_erp_session_v4');
    } catch (e) {}
  };

  window.restoreRememberedEmail = function () {
    try {
      const saved = localStorage.getItem('hope_erp_remember_email');
      const emailInput = document.getElementById('loginEmail');
      const rememberCheckbox = document.getElementById('rememberMe');
      if (saved && emailInput) {
        emailInput.value = saved;
        if (rememberCheckbox) rememberCheckbox.checked = true;
      }
    } catch (e) {}
  };

})();
