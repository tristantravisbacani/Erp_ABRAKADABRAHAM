/**
 * Hope, Inc. ERP — Core Application Bootstrap
 * Task: S1-DEV-02 (User Registration Modal Form & Handlers)
 * Role: Developer (Kurt Abraham)
 */

(function () {
  'use strict';

  // Global App State
  window.currentUser = null;

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

  const PERMISSION_GROUPS = [
    {
      key: 'customers',
      label: 'Customer Management',
      view: 'customers.view',
      items: ['customers.add', 'customers.edit', 'customers.delete']
    },
    {
      key: 'products',
      label: 'Product Management',
      view: 'products.view',
      items: [
        'products.add',
        'products.edit',
        'products.delete',
        'products.priceAdd',
        'products.priceEdit',
        'products.priceDelete'
      ]
    },
    {
      key: 'hr',
      label: 'Human Resources',
      view: 'hr.view',
      items: [
        'hr.jobAdd',
        'hr.jobEdit',
        'hr.jobDelete',
        'hr.deptAdd',
        'hr.deptEdit',
        'hr.deptDelete',
        'hr.empAdd',
        'hr.empEdit',
        'hr.empDelete',
        'hr.jhView',
        'hr.jhAdd',
        'hr.jhEdit',
        'hr.jhDelete'
      ]
    },
    {
      key: 'sales',
      label: 'Sales',
      view: 'sales.view',
      items: [
        'sales.add',
        'sales.edit',
        'sales.delete',
        'sales.detailView',
        'sales.detailAdd',
        'sales.detailEdit',
        'sales.detailDelete'
      ]
    },
    {
      key: 'reports',
      label: 'Reports',
      view: 'reports.view',
      items: [
        'reports.topCustomers',
        'reports.productMaster',
        'reports.topProducts',
        'reports.activeEmployees',
        'reports.allEmployees',
        'reports.empJobHistory',
        'reports.topSales'
      ]
    }
  ];
  window.PERMISSION_GROUPS = PERMISSION_GROUPS;

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
          '<div class="menu-item" onclick="window.navigateTo(\'users\')" data-id="users">' +
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
          '" onclick="window.navigateTo(\'' + item.id + '\')" data-id="' + item.id + '">' +
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

  const QUICK_ACTION_ICONS = {
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    box: '<path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    trend: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
  };

  window.quickActionIcon = function (name) {
    return (
      '<svg class="qa-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (QUICK_ACTION_ICONS[name] || '') +
      '</svg>'
    );
  };

  window.renderDashboardHome = function () {
    const area = document.getElementById('contentArea');
    if (!area || !window.currentUser) return;
    const role = window.currentUser.role;

    let quickButtons = '';
    if (window.canModule('customers')) {
      quickButtons += '<button class="quick-btn" onclick="window.navigateTo(\'customers\')">' + window.quickActionIcon('users') + ' View Customers</button>';
    }
    if (window.canModule('products')) {
      quickButtons += '<button class="quick-btn" onclick="window.navigateTo(\'products\')">' + window.quickActionIcon('box') + ' Manage Products</button>';
    }
    if (window.canModule('hr')) {
      quickButtons += '<button class="quick-btn" onclick="window.navigateTo(\'hr\')">' + window.quickActionIcon('briefcase') + ' Human Resources</button>';
    }
    if (window.canModule('sales')) {
      quickButtons += '<button class="quick-btn" onclick="window.navigateTo(\'sales\')">' + window.quickActionIcon('trend') + ' Sales Pipeline</button>';
    }
    if (window.canModule('reports')) {
      quickButtons += '<button class="quick-btn" onclick="window.navigateTo(\'reports\')">' + window.quickActionIcon('chart') + ' Reports</button>';
    }
    if (role !== 'user') {
      quickButtons += '<button class="quick-btn" onclick="window.navigateTo(\'users\')" data-id="quick-users">' + window.quickActionIcon('lock') + ' Manage Users</button>';
    }
    if (!quickButtons) {
      quickButtons = '<p class="empty-quick-actions">No quick actions available. Contact an administrator.</p>';
    }

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
      '    <div class="quick-actions">' +
      quickButtons +
      '    </div>' +
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
  // ========== NAVIGATION CONTROLLER ==========
  window.navigateTo = function (page) {
    if (!window.currentUser) return;
    if (['customers', 'products', 'hr', 'sales', 'reports'].includes(page) && !window.canModule(page)) {
      document.querySelectorAll('.nav-item, .menu-item').forEach(function (el) {
        el.classList.remove('active');
      });
      const pt = document.getElementById('pageTitle');
      if (pt) pt.textContent = 'Access Denied';
      const area = document.getElementById('contentArea');
      if (area) {
        area.innerHTML =
          '<div class="access-denied-wrap">' +
          '  <div class="access-denied-icon">🔒</div>' +
          '  <h2>Access Denied</h2>' +
          '  <p>You do not have authorization to view this module.</p>' +
          '  <p class="access-denied-hint">Contact a system administrator to request elevated permissions.</p>' +
          '  <button class="btn btn-primary" onclick="window.navigateTo(\'dashboard\')">Return to Dashboard</button>' +
          '</div>';
      }
      return;
    }
    if (page === 'users' && window.currentUser.role !== 'superadmin' && window.currentUser.role !== 'admin') {
      document.querySelectorAll('.nav-item, .menu-item').forEach(function (el) {
        el.classList.remove('active');
      });
      const pt = document.getElementById('pageTitle');
      if (pt) pt.textContent = 'Access Denied';
      const area = document.getElementById('contentArea');
      if (area) {
        area.innerHTML =
          '<div class="access-denied-wrap">' +
          '  <div class="access-denied-icon">🔒</div>' +
          '  <h2>Access Denied</h2>' +
          '  <p>Administrator privileges are required to access <strong>User Management</strong>.</p>' +
          '  <p class="access-denied-hint">Superadmin or Admin role is required.</p>' +
          '  <button class="btn btn-primary" onclick="window.navigateTo(\'dashboard\')">Return to Dashboard</button>' +
          '</div>';
      }
      return;
    }

    document.querySelectorAll('.nav-item, .menu-item').forEach(function (el) {
      el.classList.remove('active');
    });
    const el = document.querySelector('[data-id="' + page + '"]');
    if (el) el.classList.add('active');

    const pageTitle = document.getElementById('pageTitle');
    const titles = {
      dashboard: 'Dashboard',
      customers: 'Customer Management',
      products: 'Product Management',
      hr: 'Human Resources',
      sales: 'Sales Management',
      reports: 'Reports',
      users: 'User Management'
    };
    if (pageTitle) pageTitle.textContent = titles[page] || page;

    if (page === 'dashboard') {
      window.renderDashboardHome();
    } else if (page === 'users') {
      window.renderUserManagement();
    } else {
      const area = document.getElementById('contentArea');
      if (area) {
        area.innerHTML =
          '<div class="empty-state"><h3>' +
          (titles[page] || page) +
          '</h3><p>' +
          (titles[page] || page) +
          ' module arriving in assigned Sprint PR.</p></div>';
      }
    }
  };

  // ========== USER MANAGEMENT MODULE (S1-DEV-05 & S1-DEV-06) ==========
  window.userFilter = 'all';
  window.userSearch = '';

  window.renderUserManagement = function () {
    const area = document.getElementById('contentArea');
    if (!area) return;

    if (!window.currentUser || (window.currentUser.role !== 'superadmin' && window.currentUser.role !== 'admin')) {
      area.innerHTML = '<div class="empty-state">Access denied.</div>';
      return;
    }

    const isSuper = window.currentUser.role === 'superadmin';
    let allUsers = window.getUsers();

    // Admin Role Isolation: Admins cannot see or manage superadmin accounts
    if (!isSuper) {
      allUsers = allUsers.filter(function (u) {
        return u.role !== 'superadmin';
      });
    }

    // Counts for tabs
    const tAll = allUsers.length;
    const tActive = allUsers.filter(function (u) { return (u.status || 'active') === 'active'; }).length;
    const tPending = allUsers.filter(function (u) { return u.status === 'pending'; }).length;
    const tBlocked = allUsers.filter(function (u) { return u.status === 'blocked'; }).length;

    // Apply status filter
    let list = allUsers;
    if (window.userFilter === 'active') {
      list = list.filter(function (u) { return (u.status || 'active') === 'active'; });
    } else if (window.userFilter === 'pending') {
      list = list.filter(function (u) { return u.status === 'pending'; });
    } else if (window.userFilter === 'blocked') {
      list = list.filter(function (u) { return u.status === 'blocked'; });
    }

    // Apply live search (case-insensitive across name, email, and role)
    if (window.userSearch && window.userSearch.trim()) {
      const q = window.userSearch.trim().toLowerCase();
      list = list.filter(function (u) {
        const fullName = ((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase();
        const role = (u.role || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        return fullName.includes(q) || role.includes(q) || email.includes(q);
      });
    }

    const statusBadge = function (s) {
      if (s === 'active') return '<span class="badge badge-active">Active</span>';
      if (s === 'blocked') return '<span class="badge badge-deleted">Blocked</span>';
      if (s === 'pending') return '<span class="badge badge-pending">Pending</span>';
      if (s === 'disapproved') return '<span class="badge badge-deleted">Disapproved</span>';
      return window.escapeHtml(s || '-');
    };

    let rows = '';
    if (list.length === 0) {
      rows = '<tr><td colspan="5"><div class="empty-state">No users found.</div></td></tr>';
    } else {
      rows = list.map(function (u) {
        const isSelf = window.currentUser && u.email.toLowerCase() === window.currentUser.email.toLowerCase();
        const canEditUser = isSuper || (u.role === 'user');
        const canEditRights = isSuper || (u.role === 'user');
        let actions = '';

        if (u.status === 'pending' && canEditUser) {
          actions += '<button class="btn-restore" onclick="window.approveAccount(\'' + window.jsArg(u.email) + '\')">Approve</button> ';
          actions += '<button class="btn-del" onclick="window.disapproveAccount(\'' + window.jsArg(u.email) + '\')">Disapprove</button> ';
        }

        if (canEditUser && !isSelf) {
          if (u.status === 'blocked') {
            actions += '<button class="btn-restore" onclick="window.setAccountStatus(\'' + window.jsArg(u.email) + '\',\'active\')">Unblock</button> ';
          } else if (u.status === 'active') {
            actions += '<button class="btn-del" onclick="window.setAccountStatus(\'' + window.jsArg(u.email) + '\',\'blocked\')">Block</button> ';
          }
        }

        if (canEditRights && u.role === 'user') {
          actions += '<button class="btn-edit" onclick="window.openRightsModal(\'' + window.jsArg(u.email) + '\')">Rights</button> ';
        }

        if (canEditUser) {
          actions += '<button class="btn-edit" onclick="window.openEditAccount(\'' + window.jsArg(u.email) + '\')">Edit</button>';
        }

        if (!actions.trim()) actions = '—';

        return '<tr>' +
          '<td><strong>' + window.escapeHtml(u.firstName) + ' ' + window.escapeHtml(u.lastName || '') + '</strong></td>' +
          '<td>' + window.escapeHtml(u.email) + '</td>' +
          '<td><span class="role-badge role-' + window.escapeHtml(u.role) + '" style="font-size:0.75rem;">' + window.escapeHtml(u.role) + '</span></td>' +
          '<td>' + statusBadge(u.status || 'active') + '</td>' +
          '<td><div class="action-btns">' + actions.trim() + '</div></td>' +
          '</tr>';
      }).join('');
    }

    area.innerHTML =
      '<div class="module-toolbar">' +
      '  <h3>User Management</h3>' +
      '  <div class="toolbar-right">' +
      '    <input type="text" class="search-input" data-focus-key="userSearch" placeholder="Search users..." value="' + window.escapeHtml(window.userSearch) + '" oninput="window.userSearch=this.value;window.rerenderKeepFocus(window.renderUserManagement);" />' +
      '    <button class="btn btn-primary btn-sm" onclick="window.openAddAccount()">+ Add User</button>' +
      '  </div>' +
      '</div>' +
      '<p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px;">' +
      (isSuper
        ? 'Superadmin: manage all accounts, assign Admin role, and set rights for Users.'
        : 'Admin: manage Users only. Superadmin accounts are hidden and cannot be modified.') +
      '</p>' +
      '<div class="filter-tabs">' +
      '  <button class="filter-tab ' + (window.userFilter === 'all' ? 'active' : '') + '" onclick="window.userFilter=\'all\';window.renderUserManagement();">All (' + tAll + ')</button>' +
      '  <button class="filter-tab ' + (window.userFilter === 'active' ? 'active' : '') + '" onclick="window.userFilter=\'active\';window.renderUserManagement();">Active (' + tActive + ')</button>' +
      '  <button class="filter-tab ' + (window.userFilter === 'pending' ? 'active' : '') + '" onclick="window.userFilter=\'pending\';window.renderUserManagement();">Pending (' + tPending + ')</button>' +
      '  <button class="filter-tab ' + (window.userFilter === 'blocked' ? 'active' : '') + '" onclick="window.userFilter=\'blocked\';window.renderUserManagement();">Blocked (' + tBlocked + ')</button>' +
      '</div>' +
      '<div class="data-table-wrap">' +
      '  <table class="data-table">' +
      '    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>' +
      '    <tbody>' + rows + '</tbody>' +
      '  </table>' +
      '</div>';
  };

  // Helper to count active superadmins
  window.countActiveSuperadmins = function () {
    return window.getUsers().filter(function (u) {
      return u.role === 'superadmin' && (u.status || 'active') === 'active';
    }).length;
  };

  // Opens the empty "add account" form.
  window.openAddAccount = function () {
    const isSuper = window.currentUser && window.currentUser.role === 'superadmin';
    const title = document.getElementById('umUserTitle');
    if (title) title.textContent = 'Add User';
    const editEmail = document.getElementById('umEditEmail');
    if (editEmail) editEmail.value = '';
    const first = document.getElementById('umFirst');
    if (first) first.value = '';
    const last = document.getElementById('umLast');
    if (last) last.value = '';
    const email = document.getElementById('umEmail');
    if (email) {
      email.value = '';
      email.readOnly = false;
    }
    const status = document.getElementById('umStatus');
    if (status) status.value = 'active';
    const role = document.getElementById('umRole');
    if (role) {
      role.innerHTML = isSuper
        ? '<option value="user">User</option><option value="admin">Admin</option><option value="superadmin">Superadmin</option>'
        : '<option value="user">User</option>';
      role.disabled = false;
    }
    const err = document.getElementById('umUserError');
    if (err) err.classList.remove('show');
    const modal = document.getElementById('umUserModal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Opens the form filled in with the selected account.
  window.openEditAccount = function (email) {
    const u = window.findUser(email);
    if (!u) return;
    const isSuper = window.currentUser && window.currentUser.role === 'superadmin';
    if (!isSuper && u.role === 'superadmin') return;

    const title = document.getElementById('umUserTitle');
    if (title) title.textContent = 'Edit User';
    const editEmail = document.getElementById('umEditEmail');
    if (editEmail) editEmail.value = u.email;
    const first = document.getElementById('umFirst');
    if (first) first.value = u.firstName || '';
    const last = document.getElementById('umLast');
    if (last) last.value = u.lastName || '';
    const emailField = document.getElementById('umEmail');
    if (emailField) {
      emailField.value = u.email;
      emailField.readOnly = true;
    }
    const status = document.getElementById('umStatus');
    if (status) status.value = u.status || 'active';

    const role = document.getElementById('umRole');
    if (role) {
      if (isSuper) {
        role.innerHTML =
          '<option value="user">User</option><option value="admin">Admin</option><option value="superadmin">Superadmin</option>';
        role.disabled = false;
      } else {
        // Admin cannot promote to admin/superadmin
        role.innerHTML = '<option value="user">User</option>';
        if (u.role !== 'user') {
          role.innerHTML = '<option value="' + window.escapeHtml(u.role) + '">' + window.escapeHtml(u.role) + '</option>';
          role.disabled = true;
        } else {
          role.disabled = false;
        }
      }
      role.value = u.role;
    }

    const err = document.getElementById('umUserError');
    if (err) err.classList.remove('show');
    const modal = document.getElementById('umUserModal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Closes the account popup.
  window.closeAccountModal = function () {
    const modal = document.getElementById('umUserModal');
    if (modal) modal.classList.remove('active');
    const role = document.getElementById('umRole');
    if (role) role.disabled = false;
    window.syncBodyScroll();
  };

  // Checks the form, then saves the account: adds a new one or updates the one being edited.
  window.saveAccount = function (ev) {
    if (ev) ev.preventDefault();
    const err = document.getElementById('umUserError');
    if (err) err.classList.remove('show');

    const isSuper = window.currentUser && window.currentUser.role === 'superadmin';
    const editEmail = (document.getElementById('umEditEmail') ? document.getElementById('umEditEmail').value : '').trim();
    const firstName = (document.getElementById('umFirst') ? document.getElementById('umFirst').value : '').trim();
    const lastName = (document.getElementById('umLast') ? document.getElementById('umLast').value : '').trim();
    const email = (document.getElementById('umEmail') ? document.getElementById('umEmail').value : '').trim();
    const role = document.getElementById('umRole') ? document.getElementById('umRole').value : 'user';
    const status = document.getElementById('umStatus') ? document.getElementById('umStatus').value : 'active';

    if (!firstName || !lastName || !email) {
      if (err) {
        err.textContent = 'All fields required.';
        err.classList.add('show');
      }
      return;
    }

    if (!isSuper && (role === 'admin' || role === 'superadmin') && !editEmail) {
      if (err) {
        err.textContent = 'Admin can only create User accounts.';
        err.classList.add('show');
      }
      return;
    }

    if (editEmail) {
      const u = window.findUser(editEmail);
      if (!u) return;
      if (!isSuper && u.role === 'superadmin') {
        if (err) {
          err.textContent = 'Cannot modify Superadmin.';
          err.classList.add('show');
        }
        return;
      }

      const isSelfEdit = window.currentUser && u.email.toLowerCase() === window.currentUser.email.toLowerCase();
      if (isSelfEdit && ((isSuper && role !== u.role) || status !== 'active')) {
        if (err) {
          err.textContent = 'You cannot change your own role or block/deactivate your own account.';
          err.classList.add('show');
        }
        return;
      }

      // Last Superadmin Guard
      if (u.role === 'superadmin' && (role !== 'superadmin' || status !== 'active')) {
        if (window.countActiveSuperadmins() <= 1) {
          if (err) {
            err.textContent = 'Cannot demote or deactivate the last remaining Superadmin.';
            err.classList.add('show');
          }
          return;
        }
      }

      const oldRole = u.role;
      u.firstName = firstName;
      u.lastName = lastName;
      u.status = status;
      if (isSuper) u.role = role;

      if (u.role === 'superadmin' || u.role === 'admin') {
        u.perms = window.fullPermissions();
      } else if (oldRole !== 'user') {
        u.perms = window.emptyPermissions();
      }

      window.upsertUser(u);

      if (isSelfEdit) {
        window.currentUser.firstName = firstName;
        window.currentUser.name = (firstName + ' ' + lastName).trim();
        window.saveSession(window.currentUser);
        window.updateUserInfo();
      }
    } else {
      if (window.findUser(email)) {
        if (err) {
          err.textContent = 'Email already exists.';
          err.classList.add('show');
        }
        return;
      }
      const perms = (role === 'superadmin' || role === 'admin')
        ? window.fullPermissions()
        : window.emptyPermissions();
      window.upsertUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role,
        status: status,
        perms: perms
      });
    }

    window.closeAccountModal();
    window.renderUserManagement();
  };

  // Approves a pending account.
  window.approveAccount = function (email) {
    const u = window.findUser(email);
    if (!u) return;
    if (window.currentUser && window.currentUser.role === 'admin' && u.role !== 'user') return;
    u.status = 'active';
    if (!u.perms || !Object.values(u.perms).some(Boolean)) {
      u.perms = window.sampleUserPermissions();
    }
    window.upsertUser(u);
    window.renderUserManagement();
  };

  // Rejects / disapproves a pending account.
  window.disapproveAccount = function (email) {
    const u = window.findUser(email);
    if (!u) return;
    if (window.currentUser && window.currentUser.role === 'admin' && u.role !== 'user') return;
    // Last Superadmin Guard
    if (u.role === 'superadmin' && window.countActiveSuperadmins() <= 1) {
      alert('Cannot disapprove the last remaining Superadmin.');
      return;
    }
    u.status = 'disapproved';
    window.upsertUser(u);
    window.renderUserManagement();
  };

  // Changes an account between active and blocked.
  window.setAccountStatus = function (email, status) {
    const u = window.findUser(email);
    if (!u) return;
    if (window.currentUser && window.currentUser.role === 'admin' && u.role === 'superadmin') return;
    if (window.currentUser && email.toLowerCase() === window.currentUser.email.toLowerCase()) {
      alert('You cannot block your own account.');
      return;
    }
    // Last Superadmin Guard
    if (u.role === 'superadmin' && status !== 'active' && window.countActiveSuperadmins() <= 1) {
      alert('Cannot block the last remaining active Superadmin.');
      return;
    }
    u.status = status;
    window.upsertUser(u);
    window.renderUserManagement();
  };

  // ========== RIGHTS MANAGEMENT (S1-DEV-07) ==========
  window.rightsEmail = null;
  window.rightsDraft = null;

  // Opens the rights checklist for the chosen account.
  window.openRightsModal = function (email) {
    const u = window.findUser(email);
    if (!u || u.role !== 'user') return;
    if (window.currentUser && window.currentUser.role === 'admin' && u.role === 'superadmin') return;

    window.rightsEmail = email;
    window.rightsDraft = Object.assign({}, u.perms || window.emptyPermissions());

    const titleEl = document.getElementById('umRightsTitle');
    if (titleEl) {
      titleEl.textContent = 'Rights — ' + window.escapeHtml(u.firstName) + ' ' + window.escapeHtml(u.lastName || '');
    }
    const subEl = document.getElementById('umRightsSub');
    if (subEl) subEl.textContent = u.email;

    window.renderRightsForm();

    const modal = document.getElementById('umRightsModal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Closes the rights popup.
  window.closeRightsModal = function () {
    const modal = document.getElementById('umRightsModal');
    if (modal) modal.classList.remove('active');
    window.syncBodyScroll();
    window.rightsEmail = null;
    window.rightsDraft = null;
  };

  // Builds the checklist of rights for the account being edited.
  window.renderRightsForm = function () {
    const body = document.getElementById('umRightsBody');
    if (!body || !window.rightsDraft) return;

    body.innerHTML = window.PERMISSION_GROUPS.map(function (g) {
      const viewOn = !!window.rightsDraft[g.view];
      const items = g.items
        .map(function (k) {
          const isChecked = !!window.rightsDraft[k];
          return (
            '<label class="rights-item ' +
            (viewOn ? '' : 'disabled') +
            '">' +
            '<input type="checkbox" data-perm="' +
            k +
            '" ' +
            (isChecked ? 'checked' : '') +
            ' ' +
            (viewOn ? '' : 'disabled') +
            ' onchange="window.togglePermission(\'' +
            k +
            '\', this.checked)" />' +
            window.escapeHtml(window.ALL_PERMISSIONS[k] || k) +
            '</label>'
          );
        })
        .join('');

      return (
        '<div class="rights-card">' +
        '  <label class="rights-header">' +
        '    <input type="checkbox" data-perm="' +
        g.view +
        '" ' +
        (viewOn ? 'checked' : '') +
        ' onchange="window.toggleModuleView(\'' +
        g.key +
        '\', this.checked)" />' +
        '    ' +
        window.escapeHtml(g.label) +
        '    <div class="rights-btn-group">' +
        '      <button type="button" class="btn btn-secondary btn-sm" onclick="window.selectAllInGroup(\'' +
        g.key +
        '\', true)">All</button>' +
        '      <button type="button" class="btn btn-secondary btn-sm" onclick="window.selectAllInGroup(\'' +
        g.key +
        '\', false)">None</button>' +
        '    </div>' +
        '  </label>' +
        '  <div class="rights-grid">' +
        items +
        '</div>' +
        '</div>'
      );
    }).join('');
  };

  // Switches a module's "view" right on or off in the rights checklist.
  window.toggleModuleView = function (groupKey, on) {
    const g = window.PERMISSION_GROUPS.find(function (x) {
      return x.key === groupKey;
    });
    if (!g || !window.rightsDraft) return;
    window.rightsDraft[g.view] = on;
    if (!on) {
      g.items.forEach(function (k) {
        window.rightsDraft[k] = false;
      });
    }
    window.renderRightsForm();
  };

  // Switches one right on or off in the rights checklist.
  window.togglePermission = function (key, on) {
    if (window.rightsDraft) {
      window.rightsDraft[key] = on;
    }
  };

  // Ticks or unticks every right in one group.
  window.selectAllInGroup = function (groupKey, on) {
    const g = window.PERMISSION_GROUPS.find(function (x) {
      return x.key === groupKey;
    });
    if (!g || !window.rightsDraft) return;

    window.rightsDraft[g.view] = on;

    g.items.forEach(function (k) {
      window.rightsDraft[k] = on;
    });
    window.renderRightsForm();
  };

  // Saves the rights chosen for the account.
  window.saveRights = function () {
    if (!window.rightsEmail || !window.rightsDraft) return;
    const u = window.findUser(window.rightsEmail);
    if (!u) return;

    u.perms = Object.assign({}, window.rightsDraft);
    window.upsertUser(u);
    window.closeRightsModal();
    window.renderUserManagement();
  };

  // Modal backdrop click listener
  document.addEventListener('DOMContentLoaded', function () {
    const umModal = document.getElementById('umUserModal');
    const umRightsModal = document.getElementById('umRightsModal');
    if (umRightsModal) {
      umRightsModal.addEventListener('click', function (e) {
        if (e.target.id === 'umRightsModal') window.closeRightsModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (umRightsModal && umRightsModal.classList.contains('active')) {
          window.closeRightsModal();
        } else if (umModal && umModal.classList.contains('active')) {
          window.closeAccountModal();
        }
      }
    });
    if (umModal) {
      umModal.addEventListener('click', function (e) {
        if (e.target.id === 'umUserModal') window.closeAccountModal();
      });
    }
  });

})();
