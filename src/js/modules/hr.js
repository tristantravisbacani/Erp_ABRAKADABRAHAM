(function () {
  'use strict';

  const STORAGE_KEY = 'hope_erp_emps_v2';
  const DEFAULT_EMPLOYEES = [
    { empNo: '00001', lastName: 'Smith', firstName: 'John', gender: 'M', birthDate: '1985-02-20', hireDate: '2010-05-11', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00003', lastName: 'Smith', firstName: 'Jane', gender: 'F', birthDate: '1990-05-16', hireDate: '2010-05-11', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00005', lastName: 'King', firstName: 'Don', gender: 'M', birthDate: '1986-02-14', hireDate: '2010-06-23', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00007', lastName: 'Jenskin', firstName: 'Floyd', gender: 'M', birthDate: '1990-02-20', hireDate: '2010-05-30', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00009', lastName: 'Cerudo', firstName: 'Bambie', gender: 'F', birthDate: '1983-06-23', hireDate: '2010-05-30', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00011', lastName: 'Davis', firstName: 'Tom', gender: 'M', birthDate: '1989-12-16', hireDate: '2010-06-30', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00013', lastName: 'Morris', firstName: 'Olive', gender: 'F', birthDate: '1991-07-21', hireDate: '2010-06-30', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00015', lastName: 'Zulueta', firstName: 'Maggie', gender: 'F', birthDate: '1990-08-03', hireDate: '2010-07-05', sepDate: '2011-03-30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00017', lastName: 'Celestino', firstName: 'Nelia', gender: 'F', birthDate: '1984-10-24', hireDate: '2010-07-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00019', lastName: 'Esperanza', firstName: 'Nehemiah', gender: 'M', birthDate: '1982-02-21', hireDate: '2010-07-05', sepDate: '2014-04-28', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00021', lastName: 'Manchester', firstName: 'Chelie', gender: 'F', birthDate: '1988-12-07', hireDate: '2010-07-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00023', lastName: 'Kline', firstName: 'Nicholas', gender: 'M', birthDate: '1992-01-21', hireDate: '2010-07-05', sepDate: '2010-12-23', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00025', lastName: 'Macapagal', firstName: 'Ivy', gender: 'F', birthDate: '1992-04-30', hireDate: '2010-07-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00027', lastName: 'Blanche', firstName: 'Ernest', gender: 'M', birthDate: '1986-12-21', hireDate: '2010-07-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00029', lastName: 'Chua', firstName: 'Evangeline', gender: 'F', birthDate: '1989-03-10', hireDate: '2010-07-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00031', lastName: 'Lancaster', firstName: 'Greta', gender: 'F', birthDate: '1987-08-17', hireDate: '2010-07-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00033', lastName: 'Parks', firstName: 'Nigel', gender: 'M', birthDate: '1993-06-23', hireDate: '2010-07-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00035', lastName: 'Carlston', firstName: 'Voltaire', gender: 'F', birthDate: '1985-06-12', hireDate: '2010-07-21', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00037', lastName: 'Silva', firstName: 'Yves', gender: 'M', birthDate: '1988-09-21', hireDate: '2010-07-21', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00039', lastName: 'Geisert', firstName: 'William', gender: 'M', birthDate: '1980-03-03', hireDate: '2010-07-21', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00041', lastName: 'Darwin', firstName: 'Helena', gender: 'F', birthDate: '1978-11-08', hireDate: '2010-09-01', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00043', lastName: 'Love', firstName: 'Queen', gender: 'F', birthDate: '1983-11-29', hireDate: '2010-09-01', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00045', lastName: 'Raven', firstName: 'Danny', gender: 'M', birthDate: '1984-02-15', hireDate: '2010-12-03', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00047', lastName: 'Devito', firstName: 'Clint', gender: 'M', birthDate: '1981-06-07', hireDate: '2010-12-03', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00049', lastName: 'Irving', firstName: 'Nancy', gender: 'F', birthDate: '1987-09-19', hireDate: '2010-12-03', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00051', lastName: 'Baltimore', firstName: 'Fergie', gender: 'F', birthDate: '1986-10-10', hireDate: '2011-01-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00053', lastName: 'Jones', firstName: 'Veronica', gender: 'F', birthDate: '1983-05-01', hireDate: '2011-01-05', sepDate: '2011-03-30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00055', lastName: 'Travis', firstName: 'Ursula', gender: 'F', birthDate: '1987-06-07', hireDate: '2011-01-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00057', lastName: 'Orleans', firstName: 'Sylvia', gender: 'F', birthDate: '1987-01-28', hireDate: '2011-01-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00059', lastName: 'Sy', firstName: 'Alice', gender: 'F', birthDate: '1984-08-13', hireDate: '2011-01-05', sepDate: '2011-04-20', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00061', lastName: 'De Leon', firstName: 'Girlie', gender: 'F', birthDate: '1983-07-27', hireDate: '2011-01-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { empNo: '00063', lastName: 'Grant', firstName: 'Albert', gender: 'M', birthDate: '1979-05-05', hireDate: '2011-01-05', sepDate: '', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' }
  ];

  let memoryEmployees = null;
  let employeeFilter = 'active';
  let employeeSearch = '';

  function cloneEmployees() {
    return DEFAULT_EMPLOYEES.map(function (employee) {
      return Object.assign({}, employee);
    });
  }

  function getEmployees() {
    if (memoryEmployees) return memoryEmployees;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const employees = JSON.parse(stored);
        if (!Array.isArray(employees)) {
          throw new Error('Stored employee data must be an array.');
        }
        return employees;
      }

      const employees = cloneEmployees();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
      return employees;
    } catch (error) {
      console.error('[Employee storage read error]', error);
      if (!memoryEmployees) memoryEmployees = cloneEmployees();
      return memoryEmployees;
    }
  }

  function saveEmployees(employees) {
    memoryEmployees = employees;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    } catch (error) {
      console.error('[Employee storage write error]', error);
    }
  }

  function makeStamp(action) {
    const now = new Date();
    const date = window.localDateStr(now);
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const firstName = window.currentUser && window.currentUser.firstName;
    const actor = firstName ? firstName.toLowerCase().replace(/\s+/g, '') : 'user';
    return action + ' ' + actor + ' ' + date + ' ' + hours + ':' + minutes + ' ' + ampm;
  }

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T00:00:00.000Z');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function renderHR() {
    const area = document.getElementById('contentArea');
    if (!area) return;
    if (!window.currentUser || !window.canModule('hr')) {
      area.innerHTML = '<div class="empty-state">Access denied.</div>';
      return;
    }

    const role = window.currentUser.role;
    const canSeeDeleted = role === 'superadmin' || role === 'admin';
    const allEmployees = getEmployees();
    let employees = allEmployees;
    if (!canSeeDeleted) {
      employees = employees.filter(function (employee) {
        return !employee.isDeleted;
      });
    } else if (employeeFilter === 'active') {
      employees = employees.filter(function (employee) {
        return !employee.isDeleted;
      });
    } else if (employeeFilter === 'deleted') {
      employees = employees.filter(function (employee) {
        return !!employee.isDeleted;
      });
    }

    const query = employeeSearch.trim().toLowerCase();
    if (query) {
      employees = employees.filter(function (employee) {
        return [employee.empNo, employee.lastName, employee.firstName].some(function (value) {
          return String(value == null ? '' : value).toLowerCase().includes(query);
        });
      });
    }

    const activeCount = allEmployees.filter(function (employee) {
      return !employee.isDeleted;
    }).length;
    const inactiveCount = allEmployees.length - activeCount;
    const columnCount = canSeeDeleted ? 10 : 8;
    const headings = canSeeDeleted
      ? '<th>Emp No</th><th>Last Name</th><th>First Name</th><th>Gender</th><th>Birth Date</th><th>Hire Date</th><th>Sep Date</th><th>Status</th><th>Stamp</th><th>Actions</th>'
      : '<th>Emp No</th><th>Last Name</th><th>First Name</th><th>Gender</th><th>Birth Date</th><th>Hire Date</th><th>Sep Date</th><th>Actions</th>';
    const rows = employees.length
      ? employees.map(function (employee) {
          const isDeleted = !!employee.isDeleted;
          let actions = '—';
          if (isDeleted && canSeeDeleted) {
            actions = '<button type="button" class="btn-restore" onclick="window.restoreEmployee(&#39;' +
              window.jsArg(employee.empNo) +
              '&#39;)">Restore</button>';
          } else if (!isDeleted) {
            actions = '';
            if (window.can('hr.empEdit')) {
              actions += '<button type="button" class="btn-edit" onclick="window.openEditEmployee(&#39;' +
                window.jsArg(employee.empNo) +
                '&#39;)">Edit</button>';
            }
            if (window.can('hr.empDelete')) {
              actions += '<button type="button" class="btn-del" onclick="window.softDeleteEmployee(&#39;' +
                window.jsArg(employee.empNo) +
                '&#39;)">Delete</button>';
            }
            if (!actions) actions = '—';
          }
          const adminColumns = canSeeDeleted
            ? '<td><span class="badge ' +
              (isDeleted ? 'badge-deleted">Inactive' : 'badge-active">Active') +
              '</span></td><td><div class="employee-stamp">' +
              window.escapeHtml(employee.stamp || '—') +
              '</div></td>'
            : '';
          return '<tr' +
            (isDeleted ? ' class="deleted-row"' : '') +
            '><td><strong>' +
            window.escapeHtml(employee.empNo) +
            '</strong></td><td>' +
            window.escapeHtml(employee.lastName) +
            '</td><td>' +
            window.escapeHtml(employee.firstName) +
            '</td><td>' +
            window.escapeHtml(employee.gender) +
            '</td><td>' +
            window.escapeHtml(employee.birthDate) +
            '</td><td>' +
            window.escapeHtml(employee.hireDate) +
            '</td><td>' +
            window.escapeHtml(employee.sepDate || '—') +
            '</td>' +
            adminColumns +
            '<td><div class="action-btns">' +
            actions +
            '</div></td>' +
            '</tr>';
        }).join('')
      : '<tr><td colspan="' +
        columnCount +
        '"><div class="empty-state">No employees found.</div></td></tr>';

    const filterTabs = canSeeDeleted
      ? '<div class="filter-tabs" role="group" aria-label="Filter employees">' +
        '<button type="button" class="filter-tab' +
        (employeeFilter === 'active' ? ' active' : '') +
        '" onclick="window.setEmployeeFilter(&quot;active&quot;)">Active (' +
        activeCount +
        ')</button><button type="button" class="filter-tab' +
        (employeeFilter === 'deleted' ? ' active' : '') +
        '" onclick="window.setEmployeeFilter(&quot;deleted&quot;)">Inactive (' +
        inactiveCount +
        ')</button><button type="button" class="filter-tab' +
        (employeeFilter === 'all' ? ' active' : '') +
        '" onclick="window.setEmployeeFilter(&quot;all&quot;)">All (' +
        allEmployees.length +
        ')</button></div>'
      : '';

    area.innerHTML =
      '<div class="module-toolbar"><h3>Employees</h3>' +
      '<div class="toolbar-right">' +
      filterTabs +
      '<input type="search" class="search-input" data-focus-key="employees" aria-label="Search employees" placeholder="Search employees..." value="' +
      window.escapeHtml(employeeSearch) +
      '" oninput="window.setEmployeeSearch(this.value);window.rerenderKeepFocus(window.renderHR);" />' +
      (window.can('hr.empAdd')
        ? '<button type="button" class="btn btn-primary btn-sm" onclick="window.openAddEmployee()">+ Add Employee</button>'
        : '') +
      '</div></div><div class="data-table-wrap"><table class="data-table">' +
      '<thead><tr>' +
      headings +
      '</tr></thead><tbody>' +
      (employees.length ? rows : '<tr><td colspan="' + columnCount + '"><div class="empty-state">No employees found.</div></td></tr>') +
      '</tbody></table></div>';
  }

  window.employeeSearch = '';
  window.getEmployees = getEmployees;
  window.saveEmployees = saveEmployees;
  window.renderHR = renderHR;
  window.setEmployeeSearch = function (query) {
    employeeSearch = String(query == null ? '' : query);
  };
  window.setEmployeeFilter = function (filter) {
    if (['active', 'deleted', 'all'].indexOf(filter) < 0) {
      console.warn('[Employee filter] Invalid filter:', filter);
      return;
    }
    employeeFilter = filter;
    renderHR();
  };
  window.openAddEmployee = function () {
    if (!window.can('hr.empAdd')) {
      window.alert('You do not have permission to add employees.');
      return;
    }

    const form = document.getElementById('employeeForm');
    const editNo = document.getElementById('employeeEditNo');
    const empNo = document.getElementById('employeeNo');
    const title = document.getElementById('employeeModalTitle');
    const saveButton = document.getElementById('employeeSaveBtn');
    const error = document.getElementById('employeeError');
    if (!form || !editNo || !empNo || !title || !saveButton || !error) {
      console.error('[Employee form error] Required form elements are missing.');
      return;
    }

    form.reset();
    editNo.value = '';
    empNo.readOnly = false;
    title.textContent = 'Add Employee';
    saveButton.textContent = 'Save Employee';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('employee');
  };
  window.openEditEmployee = function (empNo) {
    if (!window.can('hr.empEdit')) {
      window.alert('You do not have permission to edit employees.');
      return;
    }

    const employee = getEmployees().find(function (item) {
      return item.empNo === empNo && !item.isDeleted;
    });
    if (!employee) {
      window.alert('Active employee not found.');
      return;
    }

    const editNo = document.getElementById('employeeEditNo');
    const employeeNo = document.getElementById('employeeNo');
    const lastName = document.getElementById('employeeLastName');
    const firstName = document.getElementById('employeeFirstName');
    const gender = document.getElementById('employeeGender');
    const birthDate = document.getElementById('employeeBirthDate');
    const hireDate = document.getElementById('employeeHireDate');
    const sepDate = document.getElementById('employeeSepDate');
    const title = document.getElementById('employeeModalTitle');
    const saveButton = document.getElementById('employeeSaveBtn');
    const error = document.getElementById('employeeError');
    if (!editNo || !employeeNo || !lastName || !firstName || !gender || !birthDate || !hireDate || !sepDate || !title || !saveButton || !error) {
      console.error('[Employee form error] Required form elements are missing.');
      return;
    }

    editNo.value = employee.empNo;
    employeeNo.value = employee.empNo;
    employeeNo.readOnly = true;
    lastName.value = employee.lastName;
    firstName.value = employee.firstName;
    gender.value = employee.gender;
    birthDate.value = employee.birthDate;
    hireDate.value = employee.hireDate;
    sepDate.value = employee.sepDate || '';
    title.textContent = 'Edit Employee';
    saveButton.textContent = 'Update Employee';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('employee');
  };
  window.closeEmployeeModal = function () {
    window.closeModal('employee');
    const employeeNo = document.getElementById('employeeNo');
    if (employeeNo) employeeNo.readOnly = false;
  };
  window.saveEmployee = function (event) {
    if (event) event.preventDefault();

    const editNo = document.getElementById('employeeEditNo');
    const employeeNo = document.getElementById('employeeNo');
    const lastNameInput = document.getElementById('employeeLastName');
    const firstNameInput = document.getElementById('employeeFirstName');
    const genderInput = document.getElementById('employeeGender');
    const birthDateInput = document.getElementById('employeeBirthDate');
    const hireDateInput = document.getElementById('employeeHireDate');
    const sepDateInput = document.getElementById('employeeSepDate');
    const error = document.getElementById('employeeError');
    if (!editNo || !employeeNo || !lastNameInput || !firstNameInput || !genderInput || !birthDateInput || !hireDateInput || !sepDateInput || !error) {
      console.error('[Employee form error] Required form elements are missing.');
      return;
    }

    const isEditing = !!editNo.value;
    const permission = isEditing ? 'hr.empEdit' : 'hr.empAdd';
    if (!window.can(permission)) {
      error.textContent = 'You do not have permission to ' + (isEditing ? 'edit' : 'add') + ' employees.';
      error.classList.add('show');
      return;
    }

    error.textContent = '';
    error.classList.remove('show');
    const empNo = employeeNo.value.trim();
    const lastName = lastNameInput.value.trim();
    const firstName = firstNameInput.value.trim();
    const gender = genderInput.value;
    const birthDate = birthDateInput.value;
    const hireDate = hireDateInput.value;
    const sepDate = sepDateInput.value;
    if (!empNo || !lastName || !firstName || !birthDate || !hireDate) {
      error.textContent = 'All required fields must be completed.';
      error.classList.add('show');
      return;
    }
    if (!/^[A-Za-z0-9._-]+$/.test(empNo)) {
      error.textContent = 'Employee No. can contain only letters, numbers, dots, dashes, and underscores.';
      error.classList.add('show');
      return;
    }
    if (['M', 'F', 'O'].indexOf(gender) < 0) {
      error.textContent = 'Select a valid gender.';
      error.classList.add('show');
      return;
    }
    if (!isValidDate(birthDate) || !isValidDate(hireDate) || (sepDate && !isValidDate(sepDate))) {
      error.textContent = 'Enter valid birth, hire, and separation dates.';
      error.classList.add('show');
      return;
    }
    if (hireDate < birthDate) {
      error.textContent = 'Hire date cannot be before the birth date.';
      error.classList.add('show');
      return;
    }
    if (sepDate && sepDate < hireDate) {
      error.textContent = 'Separation date cannot be before the hire date.';
      error.classList.add('show');
      return;
    }

    const employees = getEmployees();
    if (isEditing) {
      const employee = employees.find(function (item) {
        return item.empNo === editNo.value && !item.isDeleted;
      });
      if (!employee) {
        error.textContent = 'Active employee not found.';
        error.classList.add('show');
        return;
      }
      employee.lastName = lastName;
      employee.firstName = firstName;
      employee.gender = gender;
      employee.birthDate = birthDate;
      employee.hireDate = hireDate;
      employee.sepDate = sepDate;
      employee.stamp = makeStamp('EDITED');
    } else {
      const duplicate = employees.some(function (item) {
        return String(item.empNo).toLowerCase() === empNo.toLowerCase();
      });
      if (duplicate) {
        error.textContent = 'Employee No. already exists.';
        error.classList.add('show');
        return;
      }
      employees.push({
        empNo: empNo,
        lastName: lastName,
        firstName: firstName,
        gender: gender,
        birthDate: birthDate,
        hireDate: hireDate,
        sepDate: sepDate,
        isDeleted: false,
        stamp: makeStamp('CREATED')
      });
    }

    saveEmployees(employees);
    window.closeEmployeeModal();
    renderHR();
  };
  window.softDeleteEmployee = function (empNo) {
    if (!window.can('hr.empDelete')) {
      window.alert('You do not have permission to delete employees.');
      return;
    }
    if (!window.confirm('Mark this employee as inactive?')) return;

    const employee = getEmployees().find(function (item) {
      return item.empNo === empNo && !item.isDeleted;
    });
    if (!employee) {
      window.alert('Active employee not found.');
      return;
    }
    employee.isDeleted = true;
    employee.stamp = makeStamp('DELETED');
    saveEmployees(getEmployees());
    renderHR();
  };
  window.restoreEmployee = function (empNo) {
    const role = window.currentUser && window.currentUser.role;
    if (role !== 'superadmin' && role !== 'admin') {
      window.alert('Only Superadmin or Admin can restore employees.');
      return;
    }

    const employee = getEmployees().find(function (item) {
      return item.empNo === empNo && item.isDeleted;
    });
    if (!employee) {
      window.alert('Inactive employee not found.');
      return;
    }
    employee.isDeleted = false;
    employee.stamp = makeStamp('RESTORED');
    saveEmployees(getEmployees());
    renderHR();
  };

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && document.getElementById('employeeModal').classList.contains('active')) {
      window.closeEmployeeModal();
    }
  });
})();
