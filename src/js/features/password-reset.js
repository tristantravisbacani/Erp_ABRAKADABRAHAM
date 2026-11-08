(function () {
  'use strict';

  const DEMO_ACCOUNT_EMAILS = new Set([
    'ceo@hope.com',
    'superadmin@hope.com',
    'admin@hope.com',
    'manager@hope.com',
    'user@hope.com'
  ]);

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

  function clearRecoveryCallbackUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('passwordRecovery');
    url.searchParams.delete('type');
    url.searchParams.delete('code');
    url.hash = '';
    window.history.replaceState(null, '', url.pathname + url.search);
  }

  window.showPasswordRecoveryForm = function () {
    const requestForm = document.getElementById('resetForm');
    const passwordSection = document.getElementById('resetTokenSection');
    const subtitle = document.getElementById('resetModalSubtitle');
    if (requestForm) requestForm.style.display = 'none';
    if (passwordSection) passwordSection.style.display = 'block';
    if (subtitle) subtitle.textContent = 'Choose a new password for your account';
    window.openModal('reset');
  };

  window.openPasswordResetRequest = function () {
    const requestForm = document.getElementById('resetForm');
    const passwordSection = document.getElementById('resetTokenSection');
    const subtitle = document.getElementById('resetModalSubtitle');
    if (requestForm) {
      requestForm.style.display = '';
      requestForm.reset();
    }
    if (passwordSection) passwordSection.style.display = 'none';
    if (subtitle) subtitle.textContent = "We'll send you a secure link to reset it";
    clearMessage('resetError');
    clearMessage('resetSuccess');
    window.openModal('reset');
  };

  window.handleReset = async function (e) {
    if (e) e.preventDefault();
    clearMessage('resetError');
    clearMessage('resetSuccess');

    const emailInput = document.getElementById('resetEmail');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) {
      showMessage('resetError', 'Please enter your email address.');
      return;
    }
    if (DEMO_ACCOUNT_EMAILS.has(email.toLowerCase())) {
      showMessage('resetError', 'Password reset is disabled for demo accounts. Use the shared demo password shown on the login screen.');
      return;
    }

    try {
      const client = getSupabaseClient();
      const redirectUrl = new URL(window.location.href);
      redirectUrl.hash = '';
      redirectUrl.searchParams.set('passwordRecovery', '1');
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl.toString()
      });
      if (error) throw error;

      showMessage(
        'resetSuccess',
        'If an account exists for this email, a password reset link has been sent.'
      );
    } catch (err) {
      console.error('[Supabase Password Reset Error]', err);
      showMessage('resetError', err.message || 'Could not send a password reset link. Please try again.');
    }
  };

  window.handleSetNewPassword = async function (e) {
    if (e) e.preventDefault();
    clearMessage('resetError');
    clearMessage('resetSuccess');

    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmNewPassword');
    const password = newPasswordInput ? newPasswordInput.value : '';
    const confirmation = confirmPasswordInput ? confirmPasswordInput.value : '';

    if (!password || !confirmation) {
      showMessage('resetError', 'Please fill in both password fields.');
      return;
    }
    if (password.length < 8) {
      showMessage('resetError', 'Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmation) {
      showMessage('resetError', 'Passwords do not match.');
      return;
    }

    let passwordUpdated = false;
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.updateUser({ password: password });
      if (error) throw error;
      passwordUpdated = true;

      const loginEmail = document.getElementById('loginEmail');
      if (loginEmail && window.currentUser) loginEmail.value = window.currentUser.email;

      const { error: signOutError } = await client.auth.signOut({ scope: 'local' });
      if (signOutError) throw signOutError;
      window.currentUser = null;
      window.clearSession();
      clearRecoveryCallbackUrl();

      showMessage('resetSuccess', 'Password updated. You can now sign in with your new password.');
      setTimeout(function () {
        window.closeModal('reset');
        const requestForm = document.getElementById('resetForm');
        const passwordSection = document.getElementById('resetTokenSection');
        const subtitle = document.getElementById('resetModalSubtitle');
        if (requestForm) {
          requestForm.style.display = '';
          requestForm.reset();
        }
        if (passwordSection) passwordSection.style.display = 'none';
        if (subtitle) subtitle.textContent = "We'll send you a secure link to reset it";
        const form = document.getElementById('setNewPasswordForm');
        if (form) form.reset();
        if (typeof window.finishLogout === 'function') window.finishLogout();
        window.openModal('login');
      }, 1200);
    } catch (err) {
      console.error('[Supabase Set New Password Error]', err);
      showMessage(
        'resetError',
        passwordUpdated
          ? 'Your password was updated, but sign-out failed. Please sign out before leaving this device.'
          : err.message || 'Could not update your password. Request a new reset link.'
      );
    }
  };

  window.handleGoogleSignIn = async function () {
    clearMessage('loginError');
    clearMessage('registerError');
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('[Supabase Google Sign-in Error]', err);
      const registerModal = document.getElementById('registerModal');
      const errorElement = registerModal && registerModal.classList.contains('active')
        ? 'registerError'
        : 'loginError';
      showMessage(errorElement, err.message || 'Google sign-in is unavailable. Please try email and password.');
    }
  };
})();
