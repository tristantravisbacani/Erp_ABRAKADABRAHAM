(function () {
  'use strict';

  function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
  }

  function clearMessage(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = '';
    element.classList.remove('show');
  }

  function getSupabaseClient() {
    if (!window.supabaseClient) {
      throw new Error('Supabase is unavailable. Check your connection and reload the page.');
    }
    return window.supabaseClient;
  }

  window.loadSupabaseUser = async function (authUser) {
    const client = getSupabaseClient();
    const profileResult = await client
      .from('profiles')
      .select('id, email, first_name, last_name, role, account_status, access_scope')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profileResult.error) throw profileResult.error;
    if (!profileResult.data) throw new Error('Your account profile was not found. Contact an administrator.');

    const profile = profileResult.data;
    const statusProblem = window.accountStatusError({ status: profile.account_status });
    if (statusProblem) {
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) console.error('[Supabase sign-out Error]', error);
      throw new Error(statusProblem);
    }

    const permissionResult = await client
      .from('user_permissions')
      .select('permission, enabled')
      .eq('user_id', authUser.id);

    if (permissionResult.error) throw permissionResult.error;

    const permissions = window.emptyPermissions();
    permissionResult.data.forEach(function (item) {
      if (Object.prototype.hasOwnProperty.call(permissions, item.permission)) {
        permissions[item.permission] = item.enabled;
      }
    });

    window.currentUser = {
      id: authUser.id,
      email: profile.email,
      name: (profile.first_name + ' ' + profile.last_name).trim() || 'User',
      firstName: profile.first_name || 'User',
      role: profile.role,
      perms: permissions,
      accessScope: profile.access_scope,
      authProvider: 'supabase'
    };

    return window.currentUser;
  };

  window.handleRegister = async function (e) {
    if (e) e.preventDefault();
    clearMessage('registerError');
    clearMessage('registerSuccess');

    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmRegPassword').value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showMessage('registerError', 'Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      showMessage('registerError', 'Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      showMessage('registerError', 'Passwords do not match.');
      return;
    }

    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { first_name: firstName, last_name: lastName },
          emailRedirectTo: window.location.origin + window.location.pathname
        }
      });

      if (error) throw error;
      if (data.session) {
        const { error: signOutError } = await client.auth.signOut({ scope: 'local' });
        if (signOutError) throw signOutError;
      }

      showMessage(
        'registerSuccess',
        'Registration submitted. Confirm your email if requested; an administrator must approve your account before you can sign in.'
      );
      const form = document.getElementById('registerForm');
      if (form) form.reset();
    } catch (err) {
      console.error('[Supabase Registration Error]', err);
      showMessage('registerError', err.message || 'Registration failed. Please try again.');
    }
  };

  window.handleLogin = async function (e) {
    if (e) e.preventDefault();
    clearMessage('loginError');

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    if (!email || !password) {
      showMessage('loginError', 'Please fill in all fields.');
      return;
    }

    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) throw error;

      await window.loadSupabaseUser(data.user);

      try {
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe && rememberMe.checked) {
          localStorage.setItem('hope_erp_remember_email', email);
        } else {
          localStorage.removeItem('hope_erp_remember_email');
        }
      } catch (storageError) {
        console.error('[Remembered Email Error]', storageError);
      }
      if (typeof window.showDashboard === 'function') window.showDashboard();
    } catch (err) {
      console.error('[Supabase Login Error]', err);
      window.currentUser = null;
      showMessage('loginError', err.message || 'Sign in failed. Check your email and password.');
    }
  };

  window.accountStatusError = function (user) {
    if (!user) return 'User account not found.';
    if (user.status === 'blocked') return 'This account is blocked. Contact an administrator.';
    if (user.status === 'pending') return 'This account is pending approval. Contact an administrator.';
    if (user.status === 'disapproved' || user.status === 'rejected') return 'This registration was not approved.';
    return '';
  };

  window.can = function (perm) {
    if (!window.currentUser) return false;
    if (window.currentUser.role === 'superadmin' || window.currentUser.role === 'admin') return true;
    if (window.currentUser.authProvider === 'supabase') {
      return !!(window.currentUser.perms && window.currentUser.perms[perm]);
    }
    const user = window.findUser(window.currentUser.email);
    return !!(user && user.perms && user.perms[perm]);
  };

  window.canModule = function (mod) {
    return window.can(mod + '.view');
  };

  window.saveSession = function (user) {
    if (user && user.authProvider === 'supabase') return;
    try {
      localStorage.setItem('hope_erp_session_v4', JSON.stringify(user));
    } catch (err) {
      console.error('[Local Demo Session Error]', err);
    }
  };

  window.getSession = function () {
    try {
      const session = localStorage.getItem('hope_erp_session_v4');
      return session ? JSON.parse(session) : null;
    } catch (err) {
      console.error('[Local Demo Session Error]', err);
      return null;
    }
  };

  window.clearSession = function () {
    try {
      localStorage.removeItem('hope_erp_session_v4');
    } catch (err) {
      console.error('[Local Demo Session Error]', err);
    }
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
    } catch (err) {
      console.error('[Remembered Email Error]', err);
    }
  };
})();
