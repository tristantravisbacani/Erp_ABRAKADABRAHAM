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
    console.log('[Auth] Login handler placeholder (PR S1-DEV-03)');
  };

  window.handleGoogleSignIn = function () {
    console.log('[Auth] Google OAuth handler placeholder');
    alert('Google OAuth integration configured. Set OAuth credentials in Supabase to enable.');
  };
})();
