(function () {
  'use strict';

  // ========== USER MANAGEMENT MODULE (S1-DEV-05 & S1-DEV-06) ==========
  window.userFilter = 'all';
  window.userSearch = '';
  window.managedUsers = [];
  window.userManagementRenderId = 0;

  function isSupabaseUserManagement() {
    return !!(window.currentUser && window.currentUser.authProvider === 'supabase');
  }

  function getManagedUsers() {
    return isSupabaseUserManagement() ? window.managedUsers : window.getUsers();
  }

  function findManagedUser(email) {
    if (!email) return null;
    const normalizedEmail = email.toLowerCase();
    return getManagedUsers().find(function (user) {
      return user.email.toLowerCase() === normalizedEmail;
    }) || null;
  }

  function permissionsForProfile(rows) {
    const permissions = window.emptyPermissions();
    (rows || []).forEach(function (item) {
      if (Object.prototype.hasOwnProperty.call(permissions, item.permission)) {
        permissions[item.permission] = item.enabled;
      }
    });
    return permissions;
  }

  function showAccountActionError(error) {
    console.error('[Supabase User Management Error]', error);
    window.alert(error.message || 'Could not update this account. Please try again.');
  }

  async function saveManagedUser(user, updates) {
    const client = window.supabaseClient;
    if (!client) throw new Error('Supabase is unavailable. Check your connection and reload the page.');

    const { error } = await client.rpc('admin_update_user', {
      p_user_id: user.id,
      p_first_name: updates.firstName,
      p_last_name: updates.lastName,
      p_role: updates.role,
      p_account_status: updates.status,
      p_permissions: updates.perms
    });
    if (error) throw error;
  }

  window.renderUserManagement = async function (refreshData) {
    const area = document.getElementById('contentArea');
    if (!area) return;

    if (!window.currentUser || (window.currentUser.role !== 'superadmin' && window.currentUser.role !== 'admin')) {
      area.innerHTML = '<div class="empty-state">Access denied.</div>';
      return;
    }

    const renderId = ++window.userManagementRenderId;
    if (isSupabaseUserManagement()) {
      if (refreshData !== false || !window.managedUsers.length) {
        area.innerHTML = '<div class="empty-state">Loading accounts from Supabase...</div>';
        try {
          const { data, error } = await window.supabaseClient
            .from('profiles')
            .select('id, email, first_name, last_name, role, account_status, access_scope, user_permissions(permission, enabled)')
            .order('created_at', { ascending: true });
          if (error) throw error;
          if (renderId !== window.userManagementRenderId) return;

          window.managedUsers = data.map(function (profile) {
            return {
              id: profile.id,
              email: profile.email,
              firstName: profile.first_name,
              lastName: profile.last_name,
              role: profile.role,
              status: profile.account_status,
              accessScope: profile.access_scope,
              perms: permissionsForProfile(profile.user_permissions)
            };
          });
        } catch (error) {
          if (renderId !== window.userManagementRenderId) return;
          console.error('[Supabase User List Error]', error);
          area.innerHTML =
            '<div class="empty-state">' +
            '<p>Could not load accounts from Supabase.</p>' +
            '<p>' + window.escapeHtml(error.message || 'Check your connection and permissions, then try again.') + '</p>' +
            '<button class="btn btn-primary" onclick="window.renderUserManagement()">Retry</button>' +
            '</div>';
          return;
        }
      }
    }

    const isSuper = window.currentUser.role === 'superadmin';
    let allUsers = getManagedUsers();

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
        const isDemo = u.accessScope === 'sandbox';
        const canEditUser = !isDemo && (isSuper || (u.role === 'user'));
        const canEditRights = !isDemo && (isSuper || (u.role === 'user'));
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
          '<td>' + statusBadge(u.status || 'active') +
          (isDemo ? '<br><small>Protected demo account</small>' : '') + '</td>' +
          '<td><div class="action-btns">' + actions.trim() + '</div></td>' +
          '</tr>';
      }).join('');
    }

    area.innerHTML =
      '<div class="module-toolbar">' +
      '  <h3>User Management</h3>' +
      '  <div class="toolbar-right">' +
      '    <input type="text" class="search-input" data-focus-key="userSearch" placeholder="Search users..." value="' + window.escapeHtml(window.userSearch) + '" oninput="window.userSearch=this.value;window.rerenderKeepFocus(function(){window.renderUserManagement(false);});" />' +
      (isSupabaseUserManagement()
        ? ''
        : '    <button class="btn btn-primary btn-sm" onclick="window.openAddAccount()">+ Add User</button>') +
      '  </div>' +
      '</div>' +
      '<p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:16px;">' +
      (isSuper
        ? 'Superadmin: manage accounts, assign roles, and set rights. Shared demo accounts are protected.'
        : 'Admin: manage User accounts only. Superadmin accounts are hidden and cannot be modified. Shared demo accounts are protected.') +
      '</p>' +
      (isSupabaseUserManagement()
        ? '<p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:16px;">New accounts register through the public signup form and appear here as pending. Approval and permission changes are enforced by Supabase.</p>'
        : '') +
      '<div class="filter-tabs">' +
      '  <button class="filter-tab ' + (window.userFilter === 'all' ? 'active' : '') + '" onclick="window.userFilter=\'all\';window.renderUserManagement(false);">All (' + tAll + ')</button>' +
      '  <button class="filter-tab ' + (window.userFilter === 'active' ? 'active' : '') + '" onclick="window.userFilter=\'active\';window.renderUserManagement(false);">Active (' + tActive + ')</button>' +
      '  <button class="filter-tab ' + (window.userFilter === 'pending' ? 'active' : '') + '" onclick="window.userFilter=\'pending\';window.renderUserManagement(false);">Pending (' + tPending + ')</button>' +
      '  <button class="filter-tab ' + (window.userFilter === 'blocked' ? 'active' : '') + '" onclick="window.userFilter=\'blocked\';window.renderUserManagement(false);">Blocked (' + tBlocked + ')</button>' +
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
    if (isSupabaseUserManagement()) {
      window.alert('New accounts must register through the public signup form before an administrator can approve them.');
      return;
    }

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
    const u = findManagedUser(email);
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
  window.saveAccount = async function (ev) {
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

    if (isSupabaseUserManagement()) {
      const managedUser = findManagedUser(editEmail);
      if (!editEmail || !managedUser) {
        if (err) {
          err.textContent = 'New accounts must register through the public signup form.';
          err.classList.add('show');
        }
        return;
      }
      if (managedUser.accessScope === 'sandbox') {
        if (err) {
          err.textContent = 'Shared demo accounts are protected from user-management changes.';
          err.classList.add('show');
        }
        return;
      }

      try {
        const nextPermissions = role === 'superadmin' || role === 'admin'
          ? window.fullPermissions()
          : managedUser.role === 'user'
            ? managedUser.perms
            : window.emptyPermissions();
        await saveManagedUser(managedUser, {
          firstName: firstName,
          lastName: lastName,
          role: isSuper ? role : managedUser.role,
          status: status,
          perms: nextPermissions
        });

        if (managedUser.email.toLowerCase() === window.currentUser.email.toLowerCase()) {
          await window.loadSupabaseUser({ id: managedUser.id });
          window.updateUserInfo();
        }

        window.closeAccountModal();
        await window.renderUserManagement();
      } catch (error) {
        console.error('[Supabase Account Update Error]', error);
        if (err) {
          err.textContent = error.message || 'Could not update this account. Please try again.';
          err.classList.add('show');
        }
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
  window.approveAccount = async function (email) {
    const u = findManagedUser(email);
    if (!u) return;
    if (window.currentUser && window.currentUser.role === 'admin' && u.role !== 'user') return;
    if (u.accessScope === 'sandbox') return;
    if (isSupabaseUserManagement()) {
      try {
        const permissions = Object.values(u.perms || {}).some(Boolean)
          ? u.perms
          : window.sampleUserPermissions();
        await saveManagedUser(u, {
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          status: 'active',
          perms: permissions
        });
        await window.renderUserManagement();
      } catch (error) {
        showAccountActionError(error);
      }
      return;
    }

    u.status = 'active';
    if (!u.perms || !Object.values(u.perms).some(Boolean)) {
      u.perms = window.sampleUserPermissions();
    }
    window.upsertUser(u);
    window.renderUserManagement();
  };

  // Rejects / disapproves a pending account.
  window.disapproveAccount = async function (email) {
    const u = findManagedUser(email);
    if (!u) return;
    if (window.currentUser && window.currentUser.role === 'admin' && u.role !== 'user') return;
    if (u.accessScope === 'sandbox') return;
    if (isSupabaseUserManagement()) {
      try {
        await saveManagedUser(u, {
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          status: 'disapproved',
          perms: u.perms
        });
        await window.renderUserManagement();
      } catch (error) {
        showAccountActionError(error);
      }
      return;
    }

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
  window.setAccountStatus = async function (email, status) {
    const u = findManagedUser(email);
    if (!u) return;
    if (window.currentUser && window.currentUser.role === 'admin' && u.role === 'superadmin') return;
    if (u.accessScope === 'sandbox') return;
    if (window.currentUser && email.toLowerCase() === window.currentUser.email.toLowerCase()) {
      alert('You cannot block your own account.');
      return;
    }
    if (isSupabaseUserManagement()) {
      try {
        await saveManagedUser(u, {
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          status: status,
          perms: u.perms
        });
        await window.renderUserManagement();
      } catch (error) {
        showAccountActionError(error);
      }
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
    const u = findManagedUser(email);
    if (!u || u.role !== 'user') return;
    if (window.currentUser && window.currentUser.role === 'admin' && u.role === 'superadmin') return;
    if (u.accessScope === 'sandbox') return;

    window.rightsEmail = email;
    window.rightsDraft = Object.assign({}, u.perms || window.emptyPermissions());

    const titleEl = document.getElementById('umRightsTitle');
    if (titleEl) {
      titleEl.textContent = 'Rights — ' + window.escapeHtml(u.firstName) + ' ' + window.escapeHtml(u.lastName || '');
    }
    const errorEl = document.getElementById('umRightsError');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('show');
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
  window.saveRights = async function () {
    if (!window.rightsEmail || !window.rightsDraft) return;
    const u = findManagedUser(window.rightsEmail);
    if (!u) return;

    const permissions = Object.assign({}, window.rightsDraft);
    if (isSupabaseUserManagement()) {
      try {
        await saveManagedUser(u, {
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          status: u.status,
          perms: permissions
        });
        window.closeRightsModal();
        await window.renderUserManagement();
      } catch (error) {
        console.error('[Supabase Permission Update Error]', error);
        const errorEl = document.getElementById('umRightsError');
        if (errorEl) {
          errorEl.textContent = error.message || 'Could not save permissions. Please try again.';
          errorEl.classList.add('show');
        }
      }
      return;
    }

    u.perms = permissions;
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
