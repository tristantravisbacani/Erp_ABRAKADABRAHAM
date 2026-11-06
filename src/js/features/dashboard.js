(function () {
  'use strict';

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

  window.finishLogout = function () {
    window.clearSession();
    window.clearSupabaseERPData();
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

  window.handleLogout = async function () {
    if (window.currentUser && window.currentUser.authProvider === 'supabase') {
      try {
        const { error } = await window.supabaseClient.auth.signOut({ scope: 'local' });
        if (error) throw error;
      } catch (err) {
        console.error('[Supabase Logout Error]', err);
        const errorEl = document.getElementById('loginError');
        if (errorEl) {
          errorEl.textContent = 'Could not sign out. Please check your connection and try again.';
          errorEl.classList.add('show');
        }
        return;
      }
    }
    window.finishLogout();
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
      { section: 'Modules' },
      { id: 'customers', icon: '👥', label: 'Customers', roles: ['superadmin', 'admin', 'user'] },
      { id: 'products', icon: '📦', label: 'Products', roles: ['superadmin', 'admin', 'user'] },
      { id: 'hr', icon: '🏢', label: 'Human Resources', roles: ['superadmin', 'admin', 'user'] },
      { id: 'sales', icon: '💼', label: 'Sales', roles: ['superadmin', 'admin', 'user'] },
      { id: 'reports', icon: '📑', label: 'Reports', roles: ['superadmin', 'admin', 'user'] },
      { section: 'Administration' },
      { id: 'users', icon: '⚙️', label: 'User Management', roles: ['superadmin', 'admin'] }
    ];

    let html = '';
    let menuHtml = '';
    let pendingSection = null;
    let sectionOpen = false;

    items.forEach(function (item) {
      if (item.section) {
        pendingSection = item.section;
        return;
      }

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
        if (pendingSection) {
          if (sectionOpen) html += '</div>';
          html +=
            '<div class="nav-section"><div class="nav-section-title">' +
            pendingSection +
            '</div>';
          sectionOpen = true;
          pendingSection = null;
        }

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

    if (sectionOpen) html += '</div>';
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

  function getDashboardRevenue() {
    const detailsByTransaction = new Map();
    window.getSalesDetails().filter(function (detail) {
      return !detail.isDeleted;
    }).forEach(function (detail) {
      const details = detailsByTransaction.get(detail.transNo) || [];
      details.push(detail);
      detailsByTransaction.set(detail.transNo, details);
    });

    const prices = window.getPrices();
    return window.getSales().filter(function (sale) {
      return !sale.isDeleted;
    }).reduce(function (total, sale) {
      const details = detailsByTransaction.get(sale.transNo) || [];
      return total + details.reduce(function (saleTotal, detail) {
        const price = prices.filter(function (item) {
          return item.prodCode === detail.prodCode &&
            !item.isDeleted &&
            item.effDate <= sale.salesDate;
        }).sort(function (left, right) {
          return right.effDate.localeCompare(left.effDate);
        })[0];
        return saleTotal + Number(detail.quantity || 0) * (price ? Number(price.unitPrice) || 0 : 0);
      }, 0);
    }, 0);
  }

  function formatCompactMoney(amount) {
    if (amount >= 1e6) return '$' + (amount / 1e6).toFixed(2) + 'M';
    if (amount >= 1e3) return '$' + (amount / 1e3).toFixed(1) + 'k';
    return '$' + amount.toFixed(2);
  }

  window.renderDashboardHome = function () {
    const area = document.getElementById('contentArea');
    if (!area || !window.currentUser) return;
    const role = window.currentUser.role;
    const customers = window.getCustomers();
    const products = window.getProducts();
    const sales = window.getSales();

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

    const roleMessages = window.currentUser.authProvider === 'supabase'
      ? {
          superadmin:
          'You are signed in to Supabase as Superadmin. Customer, Product, HR, Sales, and Price History data use Supabase; Reports are calculated in the browser. User administration is managed in Supabase.',
          admin:
          'You are signed in to Supabase as Admin. Customer, Product, HR, Sales, and Price History data use Supabase; Reports are calculated in the browser. User administration is managed in Supabase.',
          user:
          'You are signed in to Supabase. Customer, Product, HR, Sales, and Price History data use Supabase; Reports are calculated in the browser. Access follows your assigned profile permissions.'
        }
      : {
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
        '        <div class="label">Total Customers</div>' +
        '        <div class="value">' + customers.filter(function (customer) { return !customer.isDeleted; }).length + '</div>' +
        '        <div class="change">' + customers.filter(function (customer) { return customer.isDeleted; }).length + ' inactive</div>' +
        '      </div>' +
        '      <div class="stat-card">' +
        '        <div class="label">Products</div>' +
        '        <div class="value">' + products.filter(function (product) { return !product.isDeleted; }).length + '</div>' +
        '        <div class="change">' + products.filter(function (product) { return product.isDeleted; }).length + ' inactive</div>' +
        '      </div>' +
        '      <div class="stat-card">' +
        '        <div class="label">Sales Transactions</div>' +
        '        <div class="value">' + sales.filter(function (sale) { return !sale.isDeleted; }).length + '</div>' +
        '        <div class="change">' + sales.filter(function (sale) { return sale.isDeleted; }).length + ' inactive</div>' +
        '      </div>' +
        '      <div class="stat-card">' +
        '        <div class="label">Total Revenue</div>' +
        '        <div class="value">' + formatCompactMoney(getDashboardRevenue()) + '</div>' +
        '        <div class="change">from active sales</div>' +
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

  // Restore the Supabase session; the previous local demo session is not an authentication source.
  document.addEventListener('DOMContentLoaded', async function () {
    window.restoreRememberedEmail();
    window.clearSession();

    const client = window.supabaseClient;
    if (!client) {
      const errorEl = document.getElementById('loginError');
      if (errorEl) {
        errorEl.textContent = 'Supabase is unavailable. Check your connection and reload the page.';
        errorEl.classList.add('show');
      }
      return;
    }

    client.auth.onAuthStateChange(function (event) {
      if (event === 'PASSWORD_RECOVERY') {
        setTimeout(function () {
          window.showPasswordRecoveryForm();
        }, 0);
      } else if (event === 'SIGNED_OUT' && window.currentUser) {
        setTimeout(function () {
          if (window.currentUser && window.currentUser.authProvider === 'supabase') {
            window.finishLogout();
          }
        }, 0);
      }
    });

    try {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      if (!data.session) return;

      await window.loadSupabaseUser(data.session.user);
      await window.initializeSupabaseERPData();
      window.showDashboard();
      const callbackParams = new URLSearchParams(window.location.hash.slice(1));
      if (callbackParams.get('type') === 'recovery') {
        window.showPasswordRecoveryForm();
      }
    } catch (err) {
      console.error('[Supabase Session Restore Error]', err);
      window.clearSupabaseERPData();
      window.currentUser = null;
      const errorEl = document.getElementById('loginError');
      if (errorEl) {
        errorEl.textContent = err.message || 'Could not restore your sign-in. Please log in again.';
        errorEl.classList.add('show');
      }
    }
  });

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
    } else if (page === 'customers') {
      window.renderCustomers();
    } else if (page === 'products') {
      window.renderProducts();
    } else if (page === 'hr') {
      window.renderHR();
    } else if (page === 'sales') {
      window.renderSales();
    } else if (page === 'reports') {
      window.renderReports();
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

})();
