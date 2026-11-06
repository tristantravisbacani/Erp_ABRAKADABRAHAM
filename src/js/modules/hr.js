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
  const JOB_STORAGE_KEY = 'hope_erp_jobs_v2';
  const DEFAULT_JOBS = [
    { jobCode: 'PRES', jobDesc: 'President', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'VP', jobDesc: 'Vice president', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'MGR', jobDesc: 'Manager', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'SA1', jobDesc: 'Sales Agent 1', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'SA2', jobDesc: 'Sales Agent 2', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'SPVR', jobDesc: 'Supervisor', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'CLK1', jobDesc: 'Clerk 1', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'CLK2', jobDesc: 'Clerk 2', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'PR1', jobDesc: 'Programmer 1', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'PR2', jobDesc: 'Programmer 2', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'ANYS', jobDesc: 'Analyst', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'ACCT', jobDesc: 'Accountant', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'WMAN', jobDesc: 'Warehouse man', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { jobCode: 'HRS', jobDesc: 'HR Specialist', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' }
  ];
  const DEPARTMENT_STORAGE_KEY = 'hope_erp_depts_v2';
  const DEFAULT_DEPARTMENTS = [
    { deptCode: 'ACT', deptName: 'Accounting', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { deptCode: 'BR1', deptName: 'Sales Branch 1', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { deptCode: 'BR2', deptName: 'Sales Branch 2', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { deptCode: 'EXC', deptName: 'Executive', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { deptCode: 'HRD', deptName: 'Human Resource', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { deptCode: 'IT', deptName: 'Information Tech', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { deptCode: 'PAY', deptName: 'Payroll', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { deptCode: 'WHS', deptName: 'Warehouse', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' }
  ];

  let memoryEmployees = null;
  let memoryJobs = null;
  let memoryDepartments = null;
  let employeeFilter = 'active';
  let employeeSearch = '';
  let hrTab = 'employees';
  let jobFilter = 'active';
  let jobSearch = '';
  let departmentFilter = 'active';
  let departmentSearch = '';

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

  function getJobs() {
    if (memoryJobs) return memoryJobs;
    try {
      const stored = localStorage.getItem(JOB_STORAGE_KEY);
      if (stored !== null) {
        const jobs = JSON.parse(stored);
        if (!Array.isArray(jobs)) throw new Error('Stored job data must be an array.');
        return jobs;
      }

      const jobs = DEFAULT_JOBS.map(function (job) {
        return Object.assign({}, job);
      });
      localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(jobs));
      return jobs;
    } catch (error) {
      console.error('[Job storage read error]', error);
      if (!memoryJobs) {
        memoryJobs = DEFAULT_JOBS.map(function (job) {
          return Object.assign({}, job);
        });
      }
      return memoryJobs;
    }
  }

  function saveJobs(jobs) {
    memoryJobs = jobs;
    try {
      localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(jobs));
    } catch (error) {
      console.error('[Job storage write error]', error);
    }
  }

  function getDepartments() {
    if (memoryDepartments) return memoryDepartments;
    try {
      const stored = localStorage.getItem(DEPARTMENT_STORAGE_KEY);
      if (stored !== null) {
        const departments = JSON.parse(stored);
        if (!Array.isArray(departments)) throw new Error('Stored department data must be an array.');
        return departments;
      }

      const departments = DEFAULT_DEPARTMENTS.map(function (department) {
        return Object.assign({}, department);
      });
      localStorage.setItem(DEPARTMENT_STORAGE_KEY, JSON.stringify(departments));
      return departments;
    } catch (error) {
      console.error('[Department storage read error]', error);
      if (!memoryDepartments) {
        memoryDepartments = DEFAULT_DEPARTMENTS.map(function (department) {
          return Object.assign({}, department);
        });
      }
      return memoryDepartments;
    }
  }

  function saveDepartments(departments) {
    memoryDepartments = departments;
    try {
      localStorage.setItem(DEPARTMENT_STORAGE_KEY, JSON.stringify(departments));
    } catch (error) {
      console.error('[Department storage write error]', error);
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
    const tabs = '<div class="filter-tabs hr-section-tabs" role="tablist" aria-label="Human Resources sections">' +
      '<button type="button" class="filter-tab' +
      (hrTab === 'employees' ? ' active' : '') +
      '" role="tab" aria-selected="' +
      (hrTab === 'employees') +
      '" onclick="window.setHRTab(&quot;employees&quot;)">Employees</button>' +
      '<button type="button" class="filter-tab' +
      (hrTab === 'jobs' ? ' active' : '') +
      '" role="tab" aria-selected="' +
      (hrTab === 'jobs') +
      '" onclick="window.setHRTab(&quot;jobs&quot;)">Jobs</button>' +
      '<button type="button" class="filter-tab' +
      (hrTab === 'departments' ? ' active' : '') +
      '" role="tab" aria-selected="' +
      (hrTab === 'departments') +
      '" onclick="window.setHRTab(&quot;departments&quot;)">Departments</button></div>';
    if (hrTab === 'jobs') {
      area.innerHTML = tabs + renderJobs(canSeeDeleted);
      return;
    }
    if (hrTab === 'departments') {
      area.innerHTML = tabs + renderDepartments(canSeeDeleted);
      return;
    }

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

    area.innerHTML = tabs +
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

  function renderJobs(canSeeDeleted) {
    const allJobs = getJobs();
    let jobs = allJobs;
    if (!canSeeDeleted) {
      jobs = jobs.filter(function (job) {
        return !job.isDeleted;
      });
    } else if (jobFilter === 'active') {
      jobs = jobs.filter(function (job) {
        return !job.isDeleted;
      });
    } else if (jobFilter === 'deleted') {
      jobs = jobs.filter(function (job) {
        return !!job.isDeleted;
      });
    }

    const query = jobSearch.trim().toLowerCase();
    if (query) {
      jobs = jobs.filter(function (job) {
        return [job.jobCode, job.jobDesc].some(function (value) {
          return String(value == null ? '' : value).toLowerCase().includes(query);
        });
      });
    }

    const activeCount = allJobs.filter(function (job) {
      return !job.isDeleted;
    }).length;
    const inactiveCount = allJobs.length - activeCount;
    const columnCount = canSeeDeleted ? 5 : 3;
    const headings = canSeeDeleted
      ? '<th>Job Code</th><th>Description</th><th>Status</th><th>Stamp</th><th>Actions</th>'
      : '<th>Job Code</th><th>Description</th><th>Actions</th>';
    const rows = jobs.length
      ? jobs.map(function (job) {
          const isDeleted = !!job.isDeleted;
          let actions = '—';
          if (isDeleted && canSeeDeleted) {
            actions = '<button type="button" class="btn-restore" onclick="window.restoreJob(&#39;' +
              window.jsArg(job.jobCode) +
              '&#39;)">Restore</button>';
          } else if (!isDeleted) {
            actions = '';
            if (window.can('hr.jobEdit')) {
              actions += '<button type="button" class="btn-edit" onclick="window.openEditJob(&#39;' +
                window.jsArg(job.jobCode) +
                '&#39;)">Edit</button>';
            }
            if (window.can('hr.jobDelete')) {
              actions += '<button type="button" class="btn-del" onclick="window.softDeleteJob(&#39;' +
                window.jsArg(job.jobCode) +
                '&#39;)">Delete</button>';
            }
            if (!actions) actions = '—';
          }
          const adminColumns = canSeeDeleted
            ? '<td><span class="badge ' +
              (isDeleted ? 'badge-deleted">Inactive' : 'badge-active">Active') +
              '</span></td><td><div class="employee-stamp">' +
              window.escapeHtml(job.stamp || '—') +
              '</div></td>'
            : '';
          return '<tr' +
            (isDeleted ? ' class="deleted-row"' : '') +
            '><td><strong>' +
            window.escapeHtml(job.jobCode) +
            '</strong></td><td>' +
            window.escapeHtml(job.jobDesc) +
            '</td>' +
            adminColumns +
            '<td><div class="action-btns">' +
            actions +
            '</div></td></tr>';
        }).join('')
      : '<tr><td colspan="' +
        columnCount +
        '"><div class="empty-state">No jobs found.</div></td></tr>';

    const filterTabs = canSeeDeleted
      ? '<div class="filter-tabs" role="group" aria-label="Filter jobs">' +
        '<button type="button" class="filter-tab' +
        (jobFilter === 'active' ? ' active' : '') +
        '" onclick="window.setJobFilter(&quot;active&quot;)">Active (' +
        activeCount +
        ')</button><button type="button" class="filter-tab' +
        (jobFilter === 'deleted' ? ' active' : '') +
        '" onclick="window.setJobFilter(&quot;deleted&quot;)">Inactive (' +
        inactiveCount +
        ')</button><button type="button" class="filter-tab' +
        (jobFilter === 'all' ? ' active' : '') +
        '" onclick="window.setJobFilter(&quot;all&quot;)">All (' +
        allJobs.length +
        ')</button></div>'
      : '';

    return '<div class="module-toolbar"><h3>Jobs</h3>' +
      '<div class="toolbar-right">' +
      filterTabs +
      '<input type="search" class="search-input" data-focus-key="jobs" aria-label="Search jobs" placeholder="Search jobs..." value="' +
      window.escapeHtml(jobSearch) +
      '" oninput="window.setJobSearch(this.value);window.rerenderKeepFocus(window.renderHR);" />' +
      (window.can('hr.jobAdd')
        ? '<button type="button" class="btn btn-primary btn-sm" onclick="window.openAddJob()">+ Add Job</button>'
        : '') +
      '</div></div><div class="data-table-wrap"><table class="data-table">' +
      '<thead><tr>' +
      headings +
      '</tr></thead><tbody>' +
      rows +
      '</tbody></table></div>';
  }

  function renderDepartments(canSeeDeleted) {
    const allDepartments = getDepartments();
    let departments = allDepartments;
    if (!canSeeDeleted) {
      departments = departments.filter(function (department) {
        return !department.isDeleted;
      });
    } else if (departmentFilter === 'active') {
      departments = departments.filter(function (department) {
        return !department.isDeleted;
      });
    } else if (departmentFilter === 'deleted') {
      departments = departments.filter(function (department) {
        return !!department.isDeleted;
      });
    }

    const query = departmentSearch.trim().toLowerCase();
    if (query) {
      departments = departments.filter(function (department) {
        return [department.deptCode, department.deptName].some(function (value) {
          return String(value == null ? '' : value).toLowerCase().includes(query);
        });
      });
    }

    const activeCount = allDepartments.filter(function (department) {
      return !department.isDeleted;
    }).length;
    const inactiveCount = allDepartments.length - activeCount;
    const columnCount = canSeeDeleted ? 5 : 3;
    const headings = canSeeDeleted
      ? '<th>Dept Code</th><th>Department Name</th><th>Status</th><th>Stamp</th><th>Actions</th>'
      : '<th>Dept Code</th><th>Department Name</th><th>Actions</th>';
    const rows = departments.length
      ? departments.map(function (department) {
          const isDeleted = !!department.isDeleted;
          let actions = '—';
          if (isDeleted && canSeeDeleted) {
            actions = '<button type="button" class="btn-restore" onclick="window.restoreDepartment(&#39;' +
              window.jsArg(department.deptCode) +
              '&#39;)">Restore</button>';
          } else if (!isDeleted) {
            actions = '';
            if (window.can('hr.deptEdit')) {
              actions += '<button type="button" class="btn-edit" onclick="window.openEditDepartment(&#39;' +
                window.jsArg(department.deptCode) +
                '&#39;)">Edit</button>';
            }
            if (window.can('hr.deptDelete')) {
              actions += '<button type="button" class="btn-del" onclick="window.softDeleteDepartment(&#39;' +
                window.jsArg(department.deptCode) +
                '&#39;)">Delete</button>';
            }
            if (!actions) actions = '—';
          }
          const adminColumns = canSeeDeleted
            ? '<td><span class="badge ' +
              (isDeleted ? 'badge-deleted">Inactive' : 'badge-active">Active') +
              '</span></td><td><div class="employee-stamp">' +
              window.escapeHtml(department.stamp || '—') +
              '</div></td>'
            : '';
          return '<tr' +
            (isDeleted ? ' class="deleted-row"' : '') +
            '><td><strong>' +
            window.escapeHtml(department.deptCode) +
            '</strong></td><td>' +
            window.escapeHtml(department.deptName) +
            '</td>' +
            adminColumns +
            '<td><div class="action-btns">' +
            actions +
            '</div></td></tr>';
        }).join('')
      : '<tr><td colspan="' +
        columnCount +
        '"><div class="empty-state">No departments found.</div></td></tr>';

    const filterTabs = canSeeDeleted
      ? '<div class="filter-tabs" role="group" aria-label="Filter departments">' +
        '<button type="button" class="filter-tab' +
        (departmentFilter === 'active' ? ' active' : '') +
        '" onclick="window.setDepartmentFilter(&quot;active&quot;)">Active (' +
        activeCount +
        ')</button><button type="button" class="filter-tab' +
        (departmentFilter === 'deleted' ? ' active' : '') +
        '" onclick="window.setDepartmentFilter(&quot;deleted&quot;)">Inactive (' +
        inactiveCount +
        ')</button><button type="button" class="filter-tab' +
        (departmentFilter === 'all' ? ' active' : '') +
        '" onclick="window.setDepartmentFilter(&quot;all&quot;)">All (' +
        allDepartments.length +
        ')</button></div>'
      : '';

    return '<div class="module-toolbar"><h3>Departments</h3>' +
      '<div class="toolbar-right">' +
      filterTabs +
      '<input type="search" class="search-input" data-focus-key="departments" aria-label="Search departments" placeholder="Search departments..." value="' +
      window.escapeHtml(departmentSearch) +
      '" oninput="window.setDepartmentSearch(this.value);window.rerenderKeepFocus(window.renderHR);" />' +
      (window.can('hr.deptAdd')
        ? '<button type="button" class="btn btn-primary btn-sm" onclick="window.openAddDepartment()">+ Add Department</button>'
        : '') +
      '</div></div><div class="data-table-wrap"><table class="data-table">' +
      '<thead><tr>' +
      headings +
      '</tr></thead><tbody>' +
      rows +
      '</tbody></table></div>';
  }

  window.employeeSearch = '';
  window.getEmployees = getEmployees;
  window.saveEmployees = saveEmployees;
  window.getJobs = getJobs;
  window.saveJobs = saveJobs;
  window.getDepartments = getDepartments;
  window.saveDepartments = saveDepartments;
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
  window.setHRTab = function (tab) {
    if (['employees', 'jobs', 'departments'].indexOf(tab) < 0) {
      console.warn('[HR tab] Invalid tab:', tab);
      return;
    }
    hrTab = tab;
    renderHR();
  };
  window.setJobFilter = function (filter) {
    if (['active', 'deleted', 'all'].indexOf(filter) < 0) {
      console.warn('[Job filter] Invalid filter:', filter);
      return;
    }
    jobFilter = filter;
    renderHR();
  };
  window.setJobSearch = function (query) {
    jobSearch = String(query == null ? '' : query);
  };
  window.setDepartmentFilter = function (filter) {
    if (['active', 'deleted', 'all'].indexOf(filter) < 0) {
      console.warn('[Department filter] Invalid filter:', filter);
      return;
    }
    departmentFilter = filter;
    renderHR();
  };
  window.setDepartmentSearch = function (query) {
    departmentSearch = String(query == null ? '' : query);
  };
  window.openAddJob = function () {
    if (!window.can('hr.jobAdd')) {
      window.alert('You do not have permission to add jobs.');
      return;
    }
    const form = document.getElementById('jobForm');
    const editCode = document.getElementById('jobEditCode');
    const jobCode = document.getElementById('jobCode');
    const title = document.getElementById('jobModalTitle');
    const saveButton = document.getElementById('jobSaveBtn');
    const error = document.getElementById('jobError');
    if (!form || !editCode || !jobCode || !title || !saveButton || !error) {
      console.error('[Job form error] Required form elements are missing.');
      return;
    }

    form.reset();
    editCode.value = '';
    jobCode.readOnly = false;
    title.textContent = 'Add Job';
    saveButton.textContent = 'Save Job';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('job');
  };
  window.openEditJob = function (jobCode) {
    if (!window.can('hr.jobEdit')) {
      window.alert('You do not have permission to edit jobs.');
      return;
    }
    const jobs = getJobs();
    const job = jobs.find(function (item) {
      return item.jobCode === jobCode && !item.isDeleted;
    });
    if (!job) {
      window.alert('Active job not found.');
      return;
    }

    const editCode = document.getElementById('jobEditCode');
    const jobCodeInput = document.getElementById('jobCode');
    const description = document.getElementById('jobDescription');
    const title = document.getElementById('jobModalTitle');
    const saveButton = document.getElementById('jobSaveBtn');
    const error = document.getElementById('jobError');
    if (!editCode || !jobCodeInput || !description || !title || !saveButton || !error) {
      console.error('[Job form error] Required form elements are missing.');
      return;
    }

    editCode.value = job.jobCode;
    jobCodeInput.value = job.jobCode;
    jobCodeInput.readOnly = true;
    description.value = job.jobDesc;
    title.textContent = 'Edit Job';
    saveButton.textContent = 'Update Job';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('job');
  };
  window.closeJobModal = function () {
    window.closeModal('job');
    const jobCode = document.getElementById('jobCode');
    if (jobCode) jobCode.readOnly = false;
  };
  window.saveJob = function (event) {
    if (event) event.preventDefault();

    const editCode = document.getElementById('jobEditCode');
    const jobCodeInput = document.getElementById('jobCode');
    const descriptionInput = document.getElementById('jobDescription');
    const error = document.getElementById('jobError');
    if (!editCode || !jobCodeInput || !descriptionInput || !error) {
      console.error('[Job form error] Required form elements are missing.');
      return;
    }

    const isEditing = !!editCode.value;
    const permission = isEditing ? 'hr.jobEdit' : 'hr.jobAdd';
    if (!window.can(permission)) {
      error.textContent = 'You do not have permission to ' + (isEditing ? 'edit' : 'add') + ' jobs.';
      error.classList.add('show');
      return;
    }
    error.textContent = '';
    error.classList.remove('show');

    const code = jobCodeInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!code || !description) {
      error.textContent = 'All fields are required.';
      error.classList.add('show');
      return;
    }
    if (!/^[A-Za-z0-9._-]+$/.test(code)) {
      error.textContent = 'Job Code can contain only letters, numbers, dots, dashes, and underscores.';
      error.classList.add('show');
      return;
    }

    const jobs = getJobs();
    if (isEditing) {
      const job = jobs.find(function (item) {
        return item.jobCode === editCode.value && !item.isDeleted;
      });
      if (!job) {
        error.textContent = 'Active job not found.';
        error.classList.add('show');
        return;
      }
      job.jobDesc = description;
      job.stamp = makeStamp('EDITED');
    } else {
      const duplicate = jobs.some(function (item) {
        return String(item.jobCode).toLowerCase() === code.toLowerCase();
      });
      if (duplicate) {
        error.textContent = 'Job Code already exists.';
        error.classList.add('show');
        return;
      }
      jobs.push({
        jobCode: code,
        jobDesc: description,
        isDeleted: false,
        stamp: makeStamp('CREATED')
      });
    }

    saveJobs(jobs);
    window.closeJobModal();
    renderHR();
  };
  window.softDeleteJob = function (jobCode) {
    if (!window.can('hr.jobDelete')) {
      window.alert('You do not have permission to delete jobs.');
      return;
    }
    if (!window.confirm('Mark this job as inactive?')) return;

    const job = getJobs().find(function (item) {
      return item.jobCode === jobCode && !item.isDeleted;
    });
    if (!job) {
      window.alert('Active job not found.');
      return;
    }
    job.isDeleted = true;
    job.stamp = makeStamp('DELETED');
    saveJobs(jobs);
    renderHR();
  };
  window.restoreJob = function (jobCode) {
    const role = window.currentUser && window.currentUser.role;
    if (role !== 'superadmin' && role !== 'admin') {
      window.alert('Only Superadmin or Admin can restore jobs.');
      return;
    }

    const jobs = getJobs();
    const job = jobs.find(function (item) {
      return item.jobCode === jobCode && item.isDeleted;
    });
    if (!job) {
      window.alert('Inactive job not found.');
      return;
    }
    job.isDeleted = false;
    job.stamp = makeStamp('RESTORED');
    saveJobs(jobs);
    renderHR();
  };
  window.openAddDepartment = function () {
    if (!window.can('hr.deptAdd')) {
      window.alert('You do not have permission to add departments.');
      return;
    }
    const form = document.getElementById('departmentForm');
    const editCode = document.getElementById('departmentEditCode');
    const code = document.getElementById('departmentCode');
    const title = document.getElementById('departmentModalTitle');
    const saveButton = document.getElementById('departmentSaveBtn');
    const error = document.getElementById('departmentError');
    if (!form || !editCode || !code || !title || !saveButton || !error) {
      console.error('[Department form error] Required form elements are missing.');
      return;
    }

    form.reset();
    editCode.value = '';
    code.readOnly = false;
    title.textContent = 'Add Department';
    saveButton.textContent = 'Save Department';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('department');
  };
  window.openEditDepartment = function (deptCode) {
    if (!window.can('hr.deptEdit')) {
      window.alert('You do not have permission to edit departments.');
      return;
    }
    const departments = getDepartments();
    const department = departments.find(function (item) {
      return item.deptCode === deptCode && !item.isDeleted;
    });
    if (!department) {
      window.alert('Active department not found.');
      return;
    }

    const editCode = document.getElementById('departmentEditCode');
    const code = document.getElementById('departmentCode');
    const name = document.getElementById('departmentName');
    const title = document.getElementById('departmentModalTitle');
    const saveButton = document.getElementById('departmentSaveBtn');
    const error = document.getElementById('departmentError');
    if (!editCode || !code || !name || !title || !saveButton || !error) {
      console.error('[Department form error] Required form elements are missing.');
      return;
    }

    editCode.value = department.deptCode;
    code.value = department.deptCode;
    code.readOnly = true;
    name.value = department.deptName;
    title.textContent = 'Edit Department';
    saveButton.textContent = 'Update Department';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('department');
  };
  window.closeDepartmentModal = function () {
    window.closeModal('department');
    const code = document.getElementById('departmentCode');
    if (code) code.readOnly = false;
  };
  window.saveDepartment = function (event) {
    if (event) event.preventDefault();

    const editCode = document.getElementById('departmentEditCode');
    const codeInput = document.getElementById('departmentCode');
    const nameInput = document.getElementById('departmentName');
    const error = document.getElementById('departmentError');
    if (!editCode || !codeInput || !nameInput || !error) {
      console.error('[Department form error] Required form elements are missing.');
      return;
    }

    const isEditing = !!editCode.value;
    const permission = isEditing ? 'hr.deptEdit' : 'hr.deptAdd';
    if (!window.can(permission)) {
      error.textContent = 'You do not have permission to ' + (isEditing ? 'edit' : 'add') + ' departments.';
      error.classList.add('show');
      return;
    }
    error.textContent = '';
    error.classList.remove('show');

    const code = codeInput.value.trim();
    const name = nameInput.value.trim();
    if (!code || !name) {
      error.textContent = 'All fields are required.';
      error.classList.add('show');
      return;
    }
    if (!/^[A-Za-z0-9._-]+$/.test(code)) {
      error.textContent = 'Dept Code can contain only letters, numbers, dots, dashes, and underscores.';
      error.classList.add('show');
      return;
    }

    const departments = getDepartments();
    if (isEditing) {
      const department = departments.find(function (item) {
        return item.deptCode === editCode.value && !item.isDeleted;
      });
      if (!department) {
        error.textContent = 'Active department not found.';
        error.classList.add('show');
        return;
      }
      department.deptName = name;
      department.stamp = makeStamp('EDITED');
    } else {
      const duplicate = departments.some(function (item) {
        return String(item.deptCode).toLowerCase() === code.toLowerCase();
      });
      if (duplicate) {
        error.textContent = 'Dept Code already exists.';
        error.classList.add('show');
        return;
      }
      departments.push({
        deptCode: code,
        deptName: name,
        isDeleted: false,
        stamp: makeStamp('CREATED')
      });
    }

    saveDepartments(departments);
    window.closeDepartmentModal();
    renderHR();
  };
  window.softDeleteDepartment = function (deptCode) {
    if (!window.can('hr.deptDelete')) {
      window.alert('You do not have permission to delete departments.');
      return;
    }
    if (!window.confirm('Mark this department as inactive?')) return;

    const departments = getDepartments();
    const department = departments.find(function (item) {
      return item.deptCode === deptCode && !item.isDeleted;
    });
    if (!department) {
      window.alert('Active department not found.');
      return;
    }
    department.isDeleted = true;
    department.stamp = makeStamp('DELETED');
    saveDepartments(departments);
    renderHR();
  };
  window.restoreDepartment = function (deptCode) {
    const role = window.currentUser && window.currentUser.role;
    if (role !== 'superadmin' && role !== 'admin') {
      window.alert('Only Superadmin or Admin can restore departments.');
      return;
    }

    const departments = getDepartments();
    const department = departments.find(function (item) {
      return item.deptCode === deptCode && item.isDeleted;
    });
    if (!department) {
      window.alert('Inactive department not found.');
      return;
    }
    department.isDeleted = false;
    department.stamp = makeStamp('RESTORED');
    saveDepartments(departments);
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
    } else if (event.key === 'Escape' && document.getElementById('jobModal').classList.contains('active')) {
      window.closeJobModal();
    } else if (event.key === 'Escape' && document.getElementById('departmentModal').classList.contains('active')) {
      window.closeDepartmentModal();
    }
  });
})();
