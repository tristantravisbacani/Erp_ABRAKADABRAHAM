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
    const columnCount = canSeeDeleted ? 9 : 7;
    const headings = canSeeDeleted
      ? '<th>Emp No</th><th>Last Name</th><th>First Name</th><th>Gender</th><th>Birth Date</th><th>Hire Date</th><th>Sep Date</th><th>Status</th><th>Stamp</th>'
      : '<th>Emp No</th><th>Last Name</th><th>First Name</th><th>Gender</th><th>Birth Date</th><th>Hire Date</th><th>Sep Date</th>';
    const rows = employees.length
      ? employees.map(function (employee) {
          const isDeleted = !!employee.isDeleted;
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
      '</div></div><div class="data-table-wrap"><table class="data-table">' +
      '<thead><tr>' +
      headings +
      '</tr></thead><tbody>' +
      (employees.length ? rows : '<tr><td colspan="' + (columnCount + 1) + '"><div class="empty-state">No employees found.</div></td></tr>') +
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
})();
