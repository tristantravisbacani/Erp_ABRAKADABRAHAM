/**
 * Hope, Inc. ERP — Core Application Bootstrap
 * Task: S1-DEV-02 (User Registration Modal Form & Handlers)
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
  window.syncBodyScroll = function () {
    document.body.style.overflow = document.querySelector('.modal-overlay.active') ? 'hidden' : '';
  };

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

  // ========== Permissions Catalogue & Generators ==========
  const ALL_PERMISSIONS = {
    'customers.view': 'View Customers',
    'customers.add': 'Add Customer',
    'customers.edit': 'Edit Customer',
    'customers.delete': 'Delete Customer',
    'products.view': 'View Products',
    'products.add': 'Add Product',
    'products.edit': 'Edit Product',
    'products.delete': 'Delete Product',
    'products.priceAdd': 'Add Price',
    'products.priceEdit': 'Edit Price',
    'products.priceDelete': 'Delete Price',
    'hr.view': 'View Human Resources',
    'hr.jobAdd': 'Add Job',
    'hr.jobEdit': 'Edit Job',
    'hr.jobDelete': 'Delete Job',
    'hr.deptAdd': 'Add Department',
    'hr.deptEdit': 'Edit Department',
    'hr.deptDelete': 'Delete Department',
    'hr.empAdd': 'Add Employee',
    'hr.empEdit': 'Edit Employee',
    'hr.empDelete': 'Delete Employee',
    'hr.jhView': 'View Job History',
    'hr.jhAdd': 'Add Job History',
    'hr.jhEdit': 'Edit Job History',
    'hr.jhDelete': 'Delete Job History',
    'sales.view': 'View Sales',
    'sales.add': 'Add Sale',
    'sales.edit': 'Edit Sale',
    'sales.delete': 'Delete Sale',
    'sales.detailView': 'View Sale Details',
    'sales.detailAdd': 'Add Sale Detail',
    'sales.detailEdit': 'Edit Sale Detail',
    'sales.detailDelete': 'Delete Sale Detail',
    'reports.view': 'View Reports',
    'reports.topCustomers': 'Top Customers',
    'reports.productMaster': 'Product Master List',
    'reports.topProducts': 'Top Products',
    'reports.activeEmployees': 'Active Employees',
    'reports.allEmployees': 'All Employees',
    'reports.empJobHistory': 'Employee Job History',
    'reports.topSales': 'Top Sales'
  };

  window.ALL_PERMISSIONS = ALL_PERMISSIONS;

  window.fullPermissions = function () {
    const p = {};
    Object.keys(ALL_PERMISSIONS).forEach(function (k) {
      p[k] = true;
    });
    return p;
  };

  window.emptyPermissions = function () {
    const p = {};
    Object.keys(ALL_PERMISSIONS).forEach(function (k) {
      p[k] = false;
    });
    return p;
  };

  window.sampleUserPermissions = function () {
    const p = window.emptyPermissions();
    [
      'customers.view',
      'customers.add',
      'customers.edit',
      'products.view',
      'products.add',
      'products.edit',
      'sales.view',
      'sales.detailView',
      'reports.view',
      'reports.productMaster',
      'reports.topSales'
    ].forEach(function (k) {
      p[k] = true;
    });
    return p;
  };

  // ========== User Store & State Management ==========
  const DEFAULT_USERS = [
    {
      email: 'superadmin@hope.com',
      firstName: 'Kurt Thomas Jon',
      lastName: 'Abraham',
      role: 'superadmin',
      status: 'active',
      perms: window.fullPermissions()
    },
    {
      email: 'ceo@hope.com',
      firstName: 'Tristan Travis',
      lastName: 'Bacani',
      role: 'superadmin',
      status: 'active',
      perms: window.fullPermissions()
    },
    {
      email: 'admin@hope.com',
      firstName: 'Mischa Andrei Sir',
      lastName: 'Solis',
      role: 'admin',
      status: 'active',
      perms: window.fullPermissions()
    },
    {
      email: 'manager@hope.com',
      firstName: 'Clark Jarred',
      lastName: 'Deocampo',
      role: 'admin',
      status: 'active',
      perms: window.fullPermissions()
    },
    {
      email: 'user@hope.com',
      firstName: 'Simon Conrad',
      lastName: 'Mangubat',
      role: 'user',
      status: 'active',
      perms: window.sampleUserPermissions()
    }
  ];

  let memoryUsers = null;

  window.getUsers = function () {
    try {
      const stored = localStorage.getItem('hope_erp_users_v4');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('hope_erp_users_v4', JSON.stringify(DEFAULT_USERS));
      return [...DEFAULT_USERS];
    } catch (e) {
      if (!memoryUsers) memoryUsers = [...DEFAULT_USERS];
      return memoryUsers;
    }
  };

  window.saveUsers = function (users) {
    try {
      localStorage.setItem('hope_erp_users_v4', JSON.stringify(users));
    } catch (e) {
      memoryUsers = users;
    }
  };

  window.findUser = function (email) {
    if (!email) return null;
    return window
      .getUsers()
      .find(function (u) {
        return u.email.toLowerCase() === email.toLowerCase();
      });
  };

  window.upsertUser = function (user) {
    const users = window.getUsers();
    const idx = users.findIndex(function (u) {
      return u.email.toLowerCase() === user.email.toLowerCase();
    });
    if (idx >= 0) users[idx] = user;
    else users.push(user);
    window.saveUsers(users);
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

  // ========== View Transitions & Dashboard Rendering ==========
  window.showDashboard = function () {
    ['login', 'register', 'reset'].forEach(function (name) {
      const el = document.getElementById(name + 'Modal');
      if (el) el.classList.remove('active');
    });
    window.syncBodyScroll();

    const landing = document.getElementById('landing');
    const dashboard = document.getElementById('dashboard');
    if (landing) landing.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = 'Dashboard';

    window.renderSidebar();
    window.renderDashboardHome();
    window.updateUserInfo();
  };

  window.handleLogout = function () {
    window.clearSession();
    window.currentUser = null;

    document.querySelectorAll('.modal-overlay.active').forEach(function (m) {
      m.classList.remove('active');
    });
    window.syncBodyScroll();

    const lf = document.getElementById('loginForm');
    if (lf) lf.reset();
    const lp = document.getElementById('loginPassword');
    if (lp) lp.type = 'password';
    const le = document.getElementById('loginError');
    if (le) {
      le.classList.remove('show');
      le.textContent = '';
    }

    window.restoreRememberedEmail();

    const landing = document.getElementById('landing');
    const dashboard = document.getElementById('dashboard');
    if (dashboard) dashboard.style.display = 'none';
    if (landing) landing.style.display = 'block';
  };

  window.logout = window.handleLogout;

  window.updateUserInfo = function () {
    if (!window.currentUser) return;
    const nameEl = document.getElementById('userName');
    const roleEl = document.getElementById('userRoleLabel');
    const avatarEl = document.getElementById('userAvatar');
    const badgeEl = document.getElementById('roleBadge');

    if (nameEl) nameEl.textContent = window.currentUser.name || 'User';
    if (roleEl) roleEl.textContent = window.currentUser.role || 'user';
    if (avatarEl) {
      const firstInitial = (window.currentUser.firstName || 'U')[0] || 'U';
      avatarEl.textContent = firstInitial.toUpperCase();
    }
    if (badgeEl) {
      badgeEl.textContent = window.currentUser.role || 'user';
      badgeEl.className = 'role-badge ' + (window.currentUser.role || 'user');
    }
  };

  window.renderSidebar = function () {
    const nav = document.getElementById('sidebarNav');
    if (!nav || !window.currentUser) return;
    const role = window.currentUser.role;

    const items = [
      { id: 'dashboard', icon: '📊', label: 'Dashboard', roles: ['superadmin', 'admin', 'user'] },
      { id: 'customers', icon: '👥', label: 'Customers', roles: ['superadmin', 'admin', 'user'] },
      { id: 'products', icon: '📦', label: 'Products', roles: ['superadmin', 'admin', 'user'] },
      { id: 'hr', icon: '🏢', label: 'Human Resources', roles: ['superadmin', 'admin', 'user'] },
      { id: 'sales', icon: '💼', label: 'Sales', roles: ['superadmin', 'admin', 'user'] },
      { id: 'reports', icon: '📑', label: 'Reports', roles: ['superadmin', 'admin', 'user'] },
      { id: 'users', icon: '⚙️', label: 'User Management', roles: ['superadmin', 'admin'] }
    ];

    let html = '';
    let menuHtml = '';

    items.forEach(function (item) {
      if (!item.roles.includes(role)) return;
      if (role === 'user' && ['customers', 'products', 'hr', 'sales', 'reports'].includes(item.id)) {
        if (!window.canModule(item.id)) return;
      }

      if (item.id === 'users') {
        menuHtml +=
          '<div class="menu-item" onclick="alert(\'User Management Console arriving in PR S1-DEV-05\')">' +
          '<span class="icon">' +
          item.icon +
          '</span> ' +
          item.label +
          '</div>';
      } else {
        const isActive = item.id === 'dashboard' ? ' active' : '';
        html +=
          '<div class="nav-item' +
          isActive +
          '" onclick="alert(\'' +
          item.label +
          ' module arriving in assigned Sprint PR\')">' +
          '<span class="icon">' +
          item.icon +
          '</span> ' +
          item.label +
          '</div>';
      }
    });

    nav.innerHTML = html;
    const userMenuItems = document.getElementById('userMenuItems');
    if (userMenuItems) userMenuItems.innerHTML = menuHtml;
  };

  window.renderDashboardHome = function () {
    const area = document.getElementById('contentArea');
    if (!area || !window.currentUser) return;
    const role = window.currentUser.role;

    const roleMessages = {
      superadmin: 'You have full system access. You can manage all modules, approve users, and assign rights.',
      admin: 'You can manage core modules and standard user rights (except Superadmin accounts).',
      user: 'You have operational access to modules assigned to your profile by an administrator.'
    };

    area.innerHTML =
      '<div class="dash-grid">' +
      '  <div class="dash-main">' +
      '    <div class="welcome-msg">' +
      '      <h2>Welcome back, ' +
      window.escapeHtml(window.currentUser.firstName || 'User') +
      '!</h2>' +
      '      <p>' +
      (roleMessages[role] || 'Welcome to Hope, Inc. ERP system.') +
      '</p>' +
      '    </div>' +
      '    <div class="stats-grid">' +
      '      <div class="stat-card">' +
      '        <div class="label">System Modules</div>' +
      '        <div class="value">5</div>' +
      '        <div class="change">Customers, Products, HR, Sales, Reports</div>' +
      '      </div>' +
      '      <div class="stat-card">' +
      '        <div class="label">Rights Catalog</div>' +
      '        <div class="value">41</div>' +
      '        <div class="change">Granular access rights</div>' +
      '      </div>' +
      '      <div class="stat-card">' +
      '        <div class="label">Your Role</div>' +
      '        <div class="value" style="font-size: 18px; text-transform: capitalize;">' +
      window.escapeHtml(role) +
      '</div>' +
      '        <div class="change">Session Active</div>' +
      '      </div>' +
      '      <div class="stat-card">' +
      '        <div class="label">Platform Status</div>' +
      '        <div class="value" style="font-size: 18px; color: var(--success);">Operational</div>' +
      '        <div class="change">Zero server errors</div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="dash-side">' +
      '    <h3>Quick Actions</h3>' +
      '    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">' +
      '      Navigate modules using the top underline navigation bar.' +
      '    </p>' +
      '    <button class="btn btn-primary btn-full" onclick="window.handleLogout()" style="margin-top: auto;">Sign out</button>' +
      '  </div>' +
      '</div>';
  };

  // Restore session or remembered email on startup
  document.addEventListener('DOMContentLoaded', function () {
    window.restoreRememberedEmail();
    const session = window.getSession();
    if (session && session.email) {
      window.currentUser = session;
      window.showDashboard();
    }
  });

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

      // Generate simulated secure token matching 03_password_reset_schema.sql
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
    console.log('[Auth] Google OAuth handler placeholder');
    alert('Google OAuth integration configured. Set OAuth credentials in Supabase to enable.');
  };
})();
