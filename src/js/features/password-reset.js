(function () {
  'use strict';

  // Helper to generate a 64-character simulated secure token
  function generateResetToken() {
    const chars = '0123456789abcdef';
    let token = '';
    for (let i = 0; i < 64; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  }

  // ========== Password Reset Step 1: Request Token ==========
  window.handleReset = function (e) {
    if (e) e.preventDefault();
    try {
      const emailInput = document.getElementById('resetEmail');
      const errorEl = document.getElementById('resetError');
      const successEl = document.getElementById('resetSuccess');
      const tokenSection = document.getElementById('resetTokenSection');
      const tokenInput = document.getElementById('resetToken');

      if (errorEl) {
        errorEl.classList.remove('show');
        errorEl.textContent = '';
      }
      if (successEl) {
        successEl.classList.remove('show');
        successEl.textContent = '';
      }

      const email = emailInput ? emailInput.value.trim() : '';
      if (!email) {
        if (errorEl) {
          errorEl.textContent = 'Please enter your email address.';
          errorEl.classList.add('show');
        }
        return;
      }

      // Generate the simulated demo reset token.
      const token = generateResetToken();
      const expiresAt = Date.now() + 2 * 3600 * 1000; // 2 hour validity window

      try {
        const storedTokens = JSON.parse(localStorage.getItem('hope_erp_reset_tokens') || '[]');
        storedTokens.push({
          token: token,
          email: email.toLowerCase(),
          expiresAt: expiresAt,
          isUsed: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('hope_erp_reset_tokens', JSON.stringify(storedTokens));
      } catch (err) {}

      if (successEl) {
        successEl.innerHTML =
          'If an account exists for <strong>' +
          window.escapeHtml(email) +
          '</strong>, a secure reset link has been dispatched.<br>' +
          '<small style="display:block;margin-top:6px;color:var(--text-muted);">' +
          'Demo Mode: Token generated below for testing.</small>';
        successEl.classList.add('show');
      }

      if (tokenSection) {
        tokenSection.style.display = 'block';
        if (tokenInput) tokenInput.value = token;
      }
    } catch (err) {
      console.error('[Reset Error]', err);
    }
  };

  // ========== Password Reset Step 2: Validate Token & Set Password ==========
  window.handleSetNewPassword = function (e) {
    if (e) e.preventDefault();
    try {
      const tokenInput = document.getElementById('resetToken');
      const newPasswordInput = document.getElementById('newPassword');
      const confirmPasswordInput = document.getElementById('confirmNewPassword');
      const errorEl = document.getElementById('resetError');
      const successEl = document.getElementById('resetSuccess');

      if (errorEl) {
        errorEl.classList.remove('show');
        errorEl.textContent = '';
      }
      if (successEl) {
        successEl.classList.remove('show');
        successEl.textContent = '';
      }

      const rawToken = tokenInput ? tokenInput.value : '';
      const token = rawToken.trim();
      const newPass = newPasswordInput ? newPasswordInput.value : '';
      const confirmPass = confirmPasswordInput ? confirmPasswordInput.value : '';

      if (!token || !newPass || !confirmPass) {
        if (errorEl) {
          errorEl.textContent = 'Please fill in all password fields.';
          errorEl.classList.add('show');
        }
        return;
      }

      if (newPass !== confirmPass) {
        if (errorEl) {
          errorEl.textContent = 'Passwords do not match.';
          errorEl.classList.add('show');
        }
        return;
      }

      if (newPass.length < 6) {
        if (errorEl) {
          errorEl.textContent = 'Password must be at least 6 characters long.';
          errorEl.classList.add('show');
        }
        return;
      }

      // Verify token in local token registry
      const storedTokens = JSON.parse(localStorage.getItem('hope_erp_reset_tokens') || '[]');
      const tokenRecord = storedTokens.find(function (t) {
        return t.token === token;
      });

      if (!tokenRecord) {
        if (errorEl) {
          errorEl.textContent = 'Invalid reset token. Please request a new link.';
          errorEl.classList.add('show');
        }
        return;
      }

      if (tokenRecord.isUsed) {
        if (errorEl) {
          errorEl.textContent = 'This reset token has already been used.';
          errorEl.classList.add('show');
        }
        return;
      }

      if (tokenRecord.expiresAt < Date.now()) {
        if (errorEl) {
          errorEl.textContent = 'This reset token has expired. Request a new link.';
          errorEl.classList.add('show');
        }
        return;
      }

      // Find user and update password
      const user = window.findUser(tokenRecord.email);
      if (!user) {
        if (errorEl) {
          errorEl.textContent = 'Associated user account no longer exists.';
          errorEl.classList.add('show');
        }
        return;
      }

      user.password = newPass;
      user.passwordUpdatedAt = new Date().toISOString();
      window.upsertUser(user);

      // Mark token as used
      tokenRecord.isUsed = true;
      tokenRecord.usedAt = new Date().toISOString();
      localStorage.setItem('hope_erp_reset_tokens', JSON.stringify(storedTokens));

      if (successEl) {
        successEl.textContent = 'Password successfully updated! Redirecting to sign in...';
        successEl.classList.add('show');
      }

      setTimeout(function () {
        window.closeModal('reset');
        const loginEmail = document.getElementById('loginEmail');
        if (loginEmail) loginEmail.value = user.email;
        const loginPassword = document.getElementById('loginPassword');
        if (loginPassword) loginPassword.value = '';
        window.openModal('login');
      }, 1200);
    } catch (err) {
      console.error('[Set New Password Error]', err);
    }
  };

  // Demo Google sign-in: signs in as sample Google account
  window.handleGoogleSignIn = function () {
    try {
      const email = 'google.user@gmail.com';
      const errorEl = document.getElementById('loginError');
      if (errorEl) errorEl.classList.remove('show');

      let user = window.findUser(email);
      if (!user) {
        user = {
          email: email,
          firstName: 'Google',
          lastName: 'User',
          role: 'user',
          status: 'pending',
          perms: window.emptyPermissions()
        };
        window.upsertUser(user);
      }

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
        firstName: user.firstName || 'Google'
      };

      ['login', 'register', 'reset'].forEach(function (n) {
        const m = document.getElementById(n + 'Modal');
        if (m) m.classList.remove('active');
      });
      window.syncBodyScroll();
      window.saveSession(window.currentUser);
      window.showDashboard();
    } catch (err) {
      console.error('[Google sign-in error]', err);
    }
  };
})();
