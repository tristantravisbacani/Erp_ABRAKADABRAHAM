(function () {
  'use strict';

  const STORAGE_KEY = 'hope_erp_sales_v2';
  const DEFAULT_SALES = [
    { transNo: 'TR000001', salesDate: '2010-06-27', custNo: 'C0001', empNo: '00005', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000002', salesDate: '2010-07-05', custNo: 'C0003', empNo: '00005', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000003', salesDate: '2010-07-05', custNo: 'C0002', empNo: '00015', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000004', salesDate: '2010-07-07', custNo: 'C0004', empNo: '00017', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000005', salesDate: '2010-07-09', custNo: 'C0005', empNo: '00019', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000006', salesDate: '2010-07-07', custNo: 'C0001', empNo: '00005', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000007', salesDate: '2010-07-07', custNo: 'C0002', empNo: '00015', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000008', salesDate: '2010-07-10', custNo: 'C0006', empNo: '00021', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000009', salesDate: '2010-07-10', custNo: 'C0007', empNo: '00021', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000010', salesDate: '2010-07-10', custNo: 'C0008', empNo: '00021', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000011', salesDate: '2010-07-10', custNo: 'C0009', empNo: '00005', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000012', salesDate: '2010-07-12', custNo: 'C0004', empNo: '00017', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' }
  ];
  const DETAIL_STORAGE_KEY = 'hope_erp_sdetails_v2';
  const DEFAULT_SALES_DETAILS = [
    { transNo: 'TR000001', prodCode: 'AK0002', quantity: 10, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000001', prodCode: 'AM0003', quantity: 10, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000001', prodCode: 'MD0001', quantity: 10, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000001', prodCode: 'PC0002', quantity: 10, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000002', prodCode: 'NB0001', quantity: 5, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000002', prodCode: 'PR0001', quantity: 1, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000003', prodCode: 'PF0006', quantity: 1, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000004', prodCode: 'AK0003', quantity: 6, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000004', prodCode: 'AM0004', quantity: 6, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000004', prodCode: 'MD0004', quantity: 6, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000004', prodCode: 'NB0002', quantity: 4, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000004', prodCode: 'PC0003', quantity: 6, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000004', prodCode: 'PR0003', quantity: 2, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000005', prodCode: 'AK0003', quantity: 1, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000005', prodCode: 'MD0005', quantity: 1, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000006', prodCode: 'NB0001', quantity: 5, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000006', prodCode: 'PF0005', quantity: 5, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000007', prodCode: 'PF0003', quantity: 2, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000008', prodCode: 'AP0002', quantity: 3, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000008', prodCode: 'MD0002', quantity: 2, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000008', prodCode: 'NB0004', quantity: 1, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000009', prodCode: 'AM0002', quantity: 1, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000009', prodCode: 'MD0003', quantity: 1, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000010', prodCode: 'AP0001', quantity: 2, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000010', prodCode: 'PA0001', quantity: 5, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000011', prodCode: 'AK0003', quantity: 3, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000011', prodCode: 'AM0004', quantity: 3, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000011', prodCode: 'MD0003', quantity: 3, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000011', prodCode: 'PC0004', quantity: 3, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000011', prodCode: 'PR0002', quantity: 2, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { transNo: 'TR000012', prodCode: 'NB0003', quantity: 7, isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' }
  ];

  let memorySales = null;
  let memorySalesDetails = null;
  let salesSearch = '';
  let salesFilter = 'active';
  let selectedTransNo = null;
  let salesDetailFilter = 'active';

  function getSales() {
    if (memorySales) return memorySales;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const sales = JSON.parse(stored);
        if (!Array.isArray(sales)) throw new Error('Stored sales data must be an array.');
        return sales;
      }

      const sales = DEFAULT_SALES.map(function (sale) {
        return Object.assign({}, sale);
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
      return sales;
    } catch (error) {
      console.error('[Sales storage read error]', error);
      if (!memorySales) {
        memorySales = DEFAULT_SALES.map(function (sale) {
          return Object.assign({}, sale);
        });
      }
      return memorySales;
    }
  }

  function saveSales(sales) {
    memorySales = sales;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
    } catch (error) {
      console.error('[Sales storage write error]', error);
    }
  }

  function getSalesDetails() {
    if (memorySalesDetails) return memorySalesDetails;
    try {
      const stored = localStorage.getItem(DETAIL_STORAGE_KEY);
      if (stored !== null) {
        const details = JSON.parse(stored);
        if (!Array.isArray(details)) throw new Error('Stored sales details must be an array.');
        return details;
      }

      const details = DEFAULT_SALES_DETAILS.map(function (detail) {
        return Object.assign({}, detail);
      });
      localStorage.setItem(DETAIL_STORAGE_KEY, JSON.stringify(details));
      return details;
    } catch (error) {
      console.error('[Sales detail storage read error]', error);
      if (!memorySalesDetails) {
        memorySalesDetails = DEFAULT_SALES_DETAILS.map(function (detail) {
          return Object.assign({}, detail);
        });
      }
      return memorySalesDetails;
    }
  }

  function saveSalesDetails(details) {
    memorySalesDetails = details;
    try {
      localStorage.setItem(DETAIL_STORAGE_KEY, JSON.stringify(details));
    } catch (error) {
      console.error('[Sales detail storage write error]', error);
    }
  }

  function makeStamp(action) {
    const now = new Date();
    const firstName = window.currentUser && window.currentUser.firstName;
    const actor = firstName ? firstName.toLowerCase().replace(/\s+/g, '') : 'user';
    const hours = now.getHours() % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return action + ' ' + actor + ' ' + window.localDateStr(now) + ' ' + hours + ':' + minutes + ' ' + ampm;
  }

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T00:00:00.000Z');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function getCustomerName(customers, custNo) {
    const customer = customers.find(function (item) {
      return item.custNo === custNo;
    });
    return customer ? customer.custName : custNo;
  }

  function getEmployeeName(employees, empNo) {
    const employee = employees.find(function (item) {
      return item.empNo === empNo;
    });
    return employee ? employee.firstName + ' ' + employee.lastName : empNo;
  }

  function getSaleTotal(sale, activeDetails, prices) {
    return activeDetails.reduce(function (total, detail) {
      if (detail.transNo !== sale.transNo) return total;
      const price = prices
        .filter(function (item) {
          return item.prodCode === detail.prodCode && !item.isDeleted && item.effDate <= sale.salesDate;
        })
        .sort(function (left, right) {
          return right.effDate.localeCompare(left.effDate);
        })[0];
      return total + Number(detail.quantity || 0) * (price ? Number(price.unitPrice) || 0 : 0);
    }, 0);
  }

  function renderSales() {
    const area = document.getElementById('contentArea');
    if (!area) return;
    if (!window.currentUser || !window.canModule('sales')) {
      area.innerHTML = '<div class="empty-state">Access denied.</div>';
      return;
    }

    const canSeeDeleted = window.currentUser.role === 'superadmin' || window.currentUser.role === 'admin';
    const allSales = getSales();
    const activeDetails = getSalesDetails().filter(function (detail) {
      return !detail.isDeleted;
    });
    const prices = window.getPrices();
    const customers = window.getCustomers();
    const employees = window.getEmployees();
    let sales = allSales;
    if (!canSeeDeleted) {
      sales = sales.filter(function (sale) {
        return !sale.isDeleted;
      });
    } else if (salesFilter === 'active') {
      sales = sales.filter(function (sale) {
        return !sale.isDeleted;
      });
    } else if (salesFilter === 'deleted') {
      sales = sales.filter(function (sale) {
        return !!sale.isDeleted;
      });
    }

    const query = salesSearch.trim().toLowerCase();
    if (query) {
      sales = sales.filter(function (sale) {
        return [
          sale.transNo,
          sale.custNo,
          getCustomerName(customers, sale.custNo),
          sale.empNo,
          getEmployeeName(employees, sale.empNo)
        ].some(function (value) {
          return String(value == null ? '' : value).toLowerCase().includes(query);
        });
      });
    }

    sales.sort(function (left, right) {
      return right.salesDate.localeCompare(left.salesDate) || right.transNo.localeCompare(left.transNo);
    });
    const activeCount = allSales.filter(function (sale) {
      return !sale.isDeleted;
    }).length;
    const inactiveCount = allSales.length - activeCount;
    const columnCount = canSeeDeleted ? 8 : 6;
    const headings = canSeeDeleted
      ? '<th>Transaction No.</th><th>Sales Date</th><th>Customer</th><th>Employee</th><th>Total</th><th>Status</th><th>Stamp</th><th>Actions</th>'
      : '<th>Transaction No.</th><th>Sales Date</th><th>Customer</th><th>Employee</th><th>Total</th><th>Actions</th>';
    const rows = sales.length
      ? sales.map(function (sale) {
          const isDeleted = !!sale.isDeleted;
          let actions = '—';
          if (isDeleted && canSeeDeleted) {
            actions = '<button type="button" class="btn-restore" onclick="window.restoreSale(&#39;' +
              window.jsArg(sale.transNo) +
              '&#39;)">Restore</button>';
          } else if (!isDeleted) {
            actions = '';
            if (window.can('sales.detailView')) {
              actions += '<button type="button" class="btn-edit" onclick="window.openSalesDetails(&#39;' +
                window.jsArg(sale.transNo) +
                '&#39;)">Details</button>';
            }
            if (window.can('sales.edit')) {
              actions += '<button type="button" class="btn-edit" onclick="window.openEditSale(&#39;' +
                window.jsArg(sale.transNo) +
                '&#39;)">Edit</button>';
            }
            if (window.can('sales.delete')) {
              actions += '<button type="button" class="btn-del" onclick="window.softDeleteSale(&#39;' +
                window.jsArg(sale.transNo) +
                '&#39;)">Delete</button>';
            }
            if (!actions) actions = '—';
          }
          const adminColumns = canSeeDeleted
            ? '<td><span class="badge ' +
              (isDeleted ? 'badge-deleted">Inactive' : 'badge-active">Active') +
              '</span></td><td><div class="sales-stamp">' +
              window.escapeHtml(sale.stamp || '—') +
              '</div></td>'
            : '';
          return '<tr' +
            (isDeleted ? ' class="deleted-row"' : '') +
            '><td><strong>' +
            window.escapeHtml(sale.transNo) +
            '</strong></td><td>' +
            window.escapeHtml(sale.salesDate) +
            '</td><td>' +
            window.escapeHtml(sale.custNo) +
            ' — ' +
            window.escapeHtml(getCustomerName(customers, sale.custNo)) +
            '</td><td>' +
            window.escapeHtml(sale.empNo) +
            ' — ' +
            window.escapeHtml(getEmployeeName(employees, sale.empNo)) +
            '</td><td><strong>$' +
            getSaleTotal(sale, activeDetails, prices).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
            '</strong></td>' +
            adminColumns +
            '<td><div class="action-btns">' +
            actions +
            '</div></td></tr>';
        }).join('')
      : '<tr><td colspan="' +
        columnCount +
        '"><div class="empty-state">No sales found.</div></td></tr>';
    const filterTabs = canSeeDeleted
      ? '<div class="filter-tabs" role="group" aria-label="Filter sales">' +
        '<button type="button" class="filter-tab' +
        (salesFilter === 'active' ? ' active' : '') +
        '" onclick="window.setSalesFilter(&quot;active&quot;)">Active (' +
        activeCount +
        ')</button><button type="button" class="filter-tab' +
        (salesFilter === 'deleted' ? ' active' : '') +
        '" onclick="window.setSalesFilter(&quot;deleted&quot;)">Inactive (' +
        inactiveCount +
        ')</button><button type="button" class="filter-tab' +
        (salesFilter === 'all' ? ' active' : '') +
        '" onclick="window.setSalesFilter(&quot;all&quot;)">All (' +
        allSales.length +
        ')</button></div>'
      : '';

    area.innerHTML =
      '<div class="module-toolbar"><h3>Sales Management</h3>' +
      '<div class="toolbar-right">' +
      filterTabs +
      '<input type="search" class="search-input" data-focus-key="sales" aria-label="Search sales" placeholder="Search sales..." value="' +
      window.escapeHtml(salesSearch) +
      '" oninput="window.setSalesSearch(this.value);window.rerenderKeepFocus(window.renderSales);" />' +
      (window.can('sales.add')
        ? '<button type="button" class="btn btn-primary btn-sm" onclick="window.openAddSale()">+ New Sale</button>'
        : '') +
      '</div></div><div class="data-table-wrap"><table class="data-table">' +
      '<thead><tr>' +
      headings +
      '</tr></thead><tbody>' +
      rows +
      '</tbody></table></div>';
  }

  function fillSalesSelects(currentCustomerNo, currentEmployeeNo) {
    const customerSelect = document.getElementById('salesCustomerNo');
    const employeeSelect = document.getElementById('salesEmployeeNo');
    if (!customerSelect || !employeeSelect) return false;

    const customers = window.getCustomers().filter(function (customer) {
      return !customer.isDeleted || customer.custNo === currentCustomerNo;
    });
    const employees = window.getEmployees().filter(function (employee) {
      return !employee.isDeleted || employee.empNo === currentEmployeeNo;
    });
    customerSelect.innerHTML = customers.map(function (customer) {
      return '<option value="' +
        window.escapeHtml(customer.custNo) +
        '">' +
        window.escapeHtml(customer.custNo) +
        ' — ' +
        window.escapeHtml(customer.custName) +
        (customer.isDeleted ? ' [inactive]' : '') +
        '</option>';
    }).join('');
    employeeSelect.innerHTML = employees.map(function (employee) {
      return '<option value="' +
        window.escapeHtml(employee.empNo) +
        '">' +
        window.escapeHtml(employee.empNo) +
        ' — ' +
        window.escapeHtml(employee.firstName) +
        ' ' +
        window.escapeHtml(employee.lastName) +
        (employee.isDeleted ? ' [inactive]' : '') +
        '</option>';
    }).join('');
    return customers.length > 0 && employees.length > 0;
  }

  function showFormError(message) {
    const error = document.getElementById('salesError');
    if (!error) {
      console.error('[Sales form error] The error message element is missing.');
      return;
    }
    error.textContent = message;
    error.classList.add('show');
  }

  window.getSales = getSales;
  window.saveSales = saveSales;
  window.getSalesDetails = getSalesDetails;
  window.saveSalesDetails = saveSalesDetails;
  window.renderSales = renderSales;
  window.setSalesFilter = function (filter) {
    if (['active', 'deleted', 'all'].indexOf(filter) < 0) {
      console.warn('[Sales filter] Invalid filter:', filter);
      return;
    }
    salesFilter = filter;
    renderSales();
  };
  window.setSalesSearch = function (query) {
    salesSearch = String(query == null ? '' : query);
  };
  window.openAddSale = function () {
    if (!window.can('sales.add')) {
      window.alert('You do not have permission to add sales.');
      return;
    }
    const form = document.getElementById('salesForm');
    const editNo = document.getElementById('salesEditNo');
    const transNo = document.getElementById('salesTransNo');
    const salesDate = document.getElementById('salesDate');
    const title = document.getElementById('salesModalTitle');
    const saveButton = document.getElementById('salesSaveBtn');
    const error = document.getElementById('salesError');
    if (!form || !editNo || !transNo || !salesDate || !title || !saveButton || !error) {
      console.error('[Sales form error] Required form elements are missing.');
      return;
    }
    if (!fillSalesSelects()) {
      showFormError('Add an active customer and employee before creating a sale.');
      window.openModal('sales');
      return;
    }

    form.reset();
    editNo.value = '';
    transNo.readOnly = false;
    salesDate.value = window.todayStr();
    title.textContent = 'New Sale';
    saveButton.textContent = 'Save Sale';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('sales');
  };
  window.openEditSale = function (transNo) {
    if (!window.can('sales.edit')) {
      window.alert('You do not have permission to edit sales.');
      return;
    }
    const sale = getSales().find(function (item) {
      return item.transNo === transNo && !item.isDeleted;
    });
    if (!sale) {
      window.alert('Active sale not found.');
      return;
    }
    if (!fillSalesSelects(sale.custNo, sale.empNo)) {
      window.alert('No active customer or employee is available for this sale.');
      return;
    }

    const editNo = document.getElementById('salesEditNo');
    const transNoInput = document.getElementById('salesTransNo');
    const salesDate = document.getElementById('salesDate');
    const customerSelect = document.getElementById('salesCustomerNo');
    const employeeSelect = document.getElementById('salesEmployeeNo');
    const title = document.getElementById('salesModalTitle');
    const saveButton = document.getElementById('salesSaveBtn');
    const error = document.getElementById('salesError');
    if (!editNo || !transNoInput || !salesDate || !customerSelect || !employeeSelect || !title || !saveButton || !error) {
      console.error('[Sales form error] Required form elements are missing.');
      return;
    }

    editNo.value = sale.transNo;
    transNoInput.value = sale.transNo;
    transNoInput.readOnly = true;
    salesDate.value = sale.salesDate;
    customerSelect.value = sale.custNo;
    employeeSelect.value = sale.empNo;
    title.textContent = 'Edit Sale';
    saveButton.textContent = 'Update Sale';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('sales');
  };
  window.closeSalesModal = function () {
    window.closeModal('sales');
    const transNo = document.getElementById('salesTransNo');
    if (transNo) transNo.readOnly = false;
  };
  window.saveSale = function (event) {
    if (event) event.preventDefault();

    const editNo = document.getElementById('salesEditNo');
    const transNoInput = document.getElementById('salesTransNo');
    const dateInput = document.getElementById('salesDate');
    const customerSelect = document.getElementById('salesCustomerNo');
    const employeeSelect = document.getElementById('salesEmployeeNo');
    const error = document.getElementById('salesError');
    if (!editNo || !transNoInput || !dateInput || !customerSelect || !employeeSelect || !error) {
      console.error('[Sales form error] Required form elements are missing.');
      return;
    }

    const isEditing = !!editNo.value;
    const permission = isEditing ? 'sales.edit' : 'sales.add';
    if (!window.can(permission)) {
      showFormError('You do not have permission to ' + (isEditing ? 'edit' : 'add') + ' sales.');
      return;
    }
    error.textContent = '';
    error.classList.remove('show');

    const transNo = transNoInput.value.trim();
    const salesDate = dateInput.value;
    const customerNo = customerSelect.value;
    const employeeNo = employeeSelect.value;
    if (!transNo || !isValidDate(salesDate) || !customerNo || !employeeNo) {
      showFormError('Enter a valid transaction number, sales date, customer, and employee.');
      return;
    }
    if (!/^[A-Za-z0-9._-]+$/.test(transNo)) {
      showFormError('Transaction No. can contain only letters, numbers, dots, dashes, and underscores.');
      return;
    }

    const customers = window.getCustomers();
    const employees = window.getEmployees();
    const sales = getSales();
    const existingSale = isEditing
      ? sales.find(function (item) {
          return item.transNo === editNo.value && !item.isDeleted;
        })
      : null;
    if (isEditing && !existingSale) {
      showFormError('Active sale not found.');
      return;
    }
    const customer = customers.find(function (item) {
      return item.custNo === customerNo;
    });
    const employee = employees.find(function (item) {
      return item.empNo === employeeNo;
    });
    if (
      !customer ||
      !employee ||
      (customer.isDeleted && (!existingSale || customerNo !== existingSale.custNo)) ||
      (employee.isDeleted && (!existingSale || employeeNo !== existingSale.empNo))
    ) {
      showFormError('Select an active customer and employee, or keep the current inactive assignment.');
      return;
    }

    if (isEditing) {
      existingSale.salesDate = salesDate;
      existingSale.custNo = customerNo;
      existingSale.empNo = employeeNo;
      existingSale.stamp = makeStamp('EDITED');
    } else {
      const duplicate = sales.some(function (item) {
        return String(item.transNo).toLowerCase() === transNo.toLowerCase();
      });
      if (duplicate) {
        showFormError('Transaction No. already exists.');
        return;
      }
      sales.push({
        transNo: transNo,
        salesDate: salesDate,
        custNo: customerNo,
        empNo: employeeNo,
        isDeleted: false,
        stamp: makeStamp('CREATED')
      });
    }

    saveSales(sales);
    window.closeSalesModal();
    renderSales();
  };

  function getUnitPrice(productCode, salesDate, prices) {
    const price = prices
      .filter(function (item) {
        return item.prodCode === productCode && !item.isDeleted && item.effDate <= salesDate;
      })
      .sort(function (left, right) {
        return right.effDate.localeCompare(left.effDate);
      })[0];
    return price ? Number(price.unitPrice) || 0 : null;
  }

  function formatMoney(amount) {
    return '$' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderSalesDetailList() {
    const title = document.getElementById('salesDetailListTitle');
    const subtitle = document.getElementById('salesDetailListSub');
    const toolbar = document.getElementById('salesDetailListToolbar');
    const head = document.getElementById('salesDetailListHead');
    const body = document.getElementById('salesDetailListBody');
    const total = document.getElementById('salesDetailListTotal');
    if (!title || !subtitle || !toolbar || !head || !body || !total) {
      console.error('[Sales detail error] Required detail-list elements are missing.');
      return;
    }

    const sale = getSales().find(function (item) {
      return item.transNo === selectedTransNo;
    });
    if (!sale) {
      window.closeModal('salesDetailList');
      window.alert('Sale not found.');
      return;
    }

    const isAdmin = window.currentUser.role === 'superadmin' || window.currentUser.role === 'admin';
    const customers = window.getCustomers();
    const customer = customers.find(function (item) {
      return item.custNo === sale.custNo;
    });
    const products = window.getProducts();
    const prices = window.getPrices();
    let details = getSalesDetails().filter(function (detail) {
      return detail.transNo === selectedTransNo;
    });
    if (!isAdmin) {
      details = details.filter(function (detail) {
        return !detail.isDeleted;
      });
    } else if (salesDetailFilter === 'active') {
      details = details.filter(function (detail) {
        return !detail.isDeleted;
      });
    } else if (salesDetailFilter === 'deleted') {
      details = details.filter(function (detail) {
        return !!detail.isDeleted;
      });
    }

    title.textContent = 'Sale Details — ' + sale.transNo;
    subtitle.textContent = sale.salesDate + ' · ' + sale.custNo +
      (customer ? ' — ' + customer.custName : '');
    head.innerHTML = isAdmin
      ? '<th>Product</th><th>Quantity</th><th>Unit Price</th><th>Line Total</th><th>Status</th><th>Stamp</th><th>Actions</th>'
      : '<th>Product</th><th>Quantity</th><th>Unit Price</th><th>Line Total</th><th>Actions</th>';

    let activeTotal = 0;
    const rows = details.length
      ? details.map(function (detail) {
          const product = products.find(function (item) {
            return item.prodCode === detail.prodCode;
          });
          const unitPrice = getUnitPrice(detail.prodCode, sale.salesDate, prices);
          const lineTotal = Number(detail.quantity) * (unitPrice === null ? 0 : unitPrice);
          if (!detail.isDeleted) activeTotal += lineTotal;

          let actions = '—';
          if (detail.isDeleted && isAdmin) {
            actions = '<button type="button" class="btn-restore" onclick="window.restoreSalesDetail(&#39;' +
              window.jsArg(detail.transNo) +
              '&#39;,&#39;' +
              window.jsArg(detail.prodCode) +
              '&#39;)">Restore</button>';
          } else if (!detail.isDeleted && !sale.isDeleted) {
            actions = '';
            if (window.can('sales.detailEdit')) {
              actions += '<button type="button" class="btn-edit" onclick="window.openEditSalesDetail(&#39;' +
                window.jsArg(detail.transNo) +
                '&#39;,&#39;' +
                window.jsArg(detail.prodCode) +
                '&#39;)">Edit</button>';
            }
            if (window.can('sales.detailDelete')) {
              actions += '<button type="button" class="btn-del" onclick="window.softDeleteSalesDetail(&#39;' +
                window.jsArg(detail.transNo) +
                '&#39;,&#39;' +
                window.jsArg(detail.prodCode) +
                '&#39;)">Delete</button>';
            }
            if (!actions) actions = '—';
          }

          const adminColumns = isAdmin
            ? '<td><span class="badge ' +
              (detail.isDeleted ? 'badge-deleted">Inactive' : 'badge-active">Active') +
              '</span></td><td><div class="sales-stamp">' +
              window.escapeHtml(detail.stamp || '—') +
              '</div></td>'
            : '';
          return '<tr' +
            (detail.isDeleted ? ' class="deleted-row"' : '') +
            '><td><strong>' +
            window.escapeHtml(detail.prodCode) +
            '</strong> — ' +
            window.escapeHtml(product ? product.description : detail.prodCode) +
            '</td><td>' +
            window.escapeHtml(detail.quantity) +
            '</td><td>' +
            (unitPrice === null ? '<span class="sales-no-price">No price</span>' : formatMoney(unitPrice)) +
            '</td><td><strong>' +
            formatMoney(lineTotal) +
            '</strong></td>' +
            adminColumns +
            '<td><div class="action-btns">' +
            actions +
            '</div></td></tr>';
        }).join('')
      : '<tr><td colspan="' +
        (isAdmin ? 7 : 5) +
        '"><div class="empty-state">No line items found.</div></td></tr>';

    const allDetails = getSalesDetails().filter(function (detail) {
      return detail.transNo === selectedTransNo;
    });
    const activeCount = allDetails.filter(function (detail) {
      return !detail.isDeleted;
    }).length;
    const deletedCount = allDetails.length - activeCount;
    const filters = isAdmin
      ? '<div class="filter-tabs" role="group" aria-label="Filter sale line items">' +
        '<button type="button" class="filter-tab' +
        (salesDetailFilter === 'active' ? ' active' : '') +
        '" onclick="window.setSalesDetailFilter(&quot;active&quot;)">Active (' +
        activeCount +
        ')</button><button type="button" class="filter-tab' +
        (salesDetailFilter === 'deleted' ? ' active' : '') +
        '" onclick="window.setSalesDetailFilter(&quot;deleted&quot;)">Inactive (' +
        deletedCount +
        ')</button><button type="button" class="filter-tab' +
        (salesDetailFilter === 'all' ? ' active' : '') +
        '" onclick="window.setSalesDetailFilter(&quot;all&quot;)">All (' +
        allDetails.length +
        ')</button></div>'
      : '';
    toolbar.innerHTML = filters +
      (!sale.isDeleted && window.can('sales.detailAdd')
        ? '<button type="button" class="btn btn-primary btn-sm" onclick="window.openAddSalesDetail(&#39;' +
          window.jsArg(sale.transNo) +
          '&#39;)">+ Add Line</button>'
        : '');
    body.innerHTML = rows;
    total.textContent = 'Total: ' + formatMoney(activeTotal);
  }

  function fillSalesDetailProductSelect(currentProductCode) {
    const select = document.getElementById('salesDetailProduct');
    if (!select) return false;
    const products = window.getProducts().filter(function (product) {
      return !product.isDeleted || product.prodCode === currentProductCode;
    });
    select.innerHTML = products.map(function (product) {
      return '<option value="' +
        window.escapeHtml(product.prodCode) +
        '">' +
        window.escapeHtml(product.prodCode) +
        ' — ' +
        window.escapeHtml(product.description) +
        ' (' +
        window.escapeHtml(product.unit) +
        ')' +
        (product.isDeleted ? ' [inactive]' : '') +
        '</option>';
    }).join('');
    return products.length > 0;
  }

  function updateSalesDetailPriceHint() {
    const productSelect = document.getElementById('salesDetailProduct');
    const priceHint = document.getElementById('salesDetailPriceHint');
    const sale = getSales().find(function (item) {
      return item.transNo === selectedTransNo && !item.isDeleted;
    });
    if (!productSelect || !priceHint || !sale) return;
    const unitPrice = getUnitPrice(productSelect.value, sale.salesDate, window.getPrices());
    priceHint.textContent = productSelect.value
      ? (unitPrice === null
          ? 'No unit price is set for this product as of the sale date.'
          : 'Unit price as of sale date: ' + formatMoney(unitPrice))
      : '';
  }

  window.updateSalesDetailPriceHint = updateSalesDetailPriceHint;

  function showSalesDetailError(message) {
    const error = document.getElementById('salesDetailError');
    if (!error) {
      console.error('[Sales detail error] The error message element is missing.');
      return;
    }
    error.textContent = message;
    error.classList.add('show');
  }

  window.openSalesDetails = function (transNo) {
    if (!window.can('sales.detailView')) {
      window.alert('You do not have permission to view sale details.');
      return;
    }
    const sale = getSales().find(function (item) {
      return item.transNo === transNo;
    });
    if (!sale) {
      window.alert('Sale not found.');
      return;
    }
    selectedTransNo = transNo;
    salesDetailFilter = 'active';
    renderSalesDetailList();
    window.openModal('salesDetailList');
  };
  window.setSalesDetailFilter = function (filter) {
    if (['active', 'deleted', 'all'].indexOf(filter) < 0) {
      console.warn('[Sales detail filter] Invalid filter:', filter);
      return;
    }
    salesDetailFilter = filter;
    renderSalesDetailList();
  };
  window.openAddSalesDetail = function (transNo) {
    if (!window.can('sales.detailAdd')) {
      window.alert('You do not have permission to add sale line items.');
      return;
    }
    const sale = getSales().find(function (item) {
      return item.transNo === transNo && !item.isDeleted;
    });
    if (!sale) {
      window.alert('Active sale not found.');
      return;
    }
    selectedTransNo = transNo;
    const form = document.getElementById('salesDetailForm');
    const title = document.getElementById('salesDetailFormTitle');
    const saveButton = document.getElementById('salesDetailSaveBtn');
    const editKey = document.getElementById('salesDetailEditKey');
    const productSelect = document.getElementById('salesDetailProduct');
    const quantity = document.getElementById('salesDetailQuantity');
    const error = document.getElementById('salesDetailError');
    const transaction = document.getElementById('salesDetailTransNo');
    if (!form || !title || !saveButton || !editKey || !productSelect || !quantity || !error || !transaction) {
      console.error('[Sales detail error] Required detail-form elements are missing.');
      return;
    }
    if (!fillSalesDetailProductSelect()) {
      showSalesDetailError('Add an active product before creating a line item.');
      window.openModal('salesDetailForm');
      return;
    }
    form.reset();
    selectedTransNo = transNo;
    editKey.value = '';
    transaction.value = transNo;
    productSelect.disabled = false;
    quantity.value = '1';
    title.textContent = 'Add Line Item';
    saveButton.textContent = 'Save Line';
    error.textContent = '';
    error.classList.remove('show');
    updateSalesDetailPriceHint();
    window.openModal('salesDetailForm');
  };
  window.openEditSalesDetail = function (transNo, productCode) {
    if (!window.can('sales.detailEdit')) {
      window.alert('You do not have permission to edit sale line items.');
      return;
    }
    const sale = getSales().find(function (item) {
      return item.transNo === transNo && !item.isDeleted;
    });
    const detail = getSalesDetails().find(function (item) {
      return item.transNo === transNo && item.prodCode === productCode && !item.isDeleted;
    });
    if (!sale || !detail) {
      window.alert('Active sale line item not found.');
      return;
    }
    selectedTransNo = transNo;
    const title = document.getElementById('salesDetailFormTitle');
    const saveButton = document.getElementById('salesDetailSaveBtn');
    const editKey = document.getElementById('salesDetailEditKey');
    const productSelect = document.getElementById('salesDetailProduct');
    const quantity = document.getElementById('salesDetailQuantity');
    const error = document.getElementById('salesDetailError');
    const transaction = document.getElementById('salesDetailTransNo');
    if (!title || !saveButton || !editKey || !productSelect || !quantity || !error || !transaction) {
      console.error('[Sales detail error] Required detail-form elements are missing.');
      return;
    }
    if (!fillSalesDetailProductSelect(detail.prodCode)) {
      window.alert('The product for this line item is unavailable.');
      return;
    }
    editKey.value = transNo + '|' + productCode;
    transaction.value = transNo;
    productSelect.value = detail.prodCode;
    productSelect.disabled = true;
    quantity.value = String(detail.quantity);
    title.textContent = 'Edit Line Item';
    saveButton.textContent = 'Update Line';
    error.textContent = '';
    error.classList.remove('show');
    updateSalesDetailPriceHint();
    window.openModal('salesDetailForm');
  };
  window.closeSalesDetailForm = function () {
    window.closeModal('salesDetailForm');
    const productSelect = document.getElementById('salesDetailProduct');
    if (productSelect) productSelect.disabled = false;
  };
  window.saveSalesDetail = function (event) {
    if (event) event.preventDefault();
    const editKey = document.getElementById('salesDetailEditKey');
    const productSelect = document.getElementById('salesDetailProduct');
    const quantityInput = document.getElementById('salesDetailQuantity');
    const error = document.getElementById('salesDetailError');
    if (!editKey || !productSelect || !quantityInput || !error) {
      console.error('[Sales detail error] Required detail-form elements are missing.');
      return;
    }
    const isEditing = !!editKey.value;
    const permission = isEditing ? 'sales.detailEdit' : 'sales.detailAdd';
    if (!window.can(permission)) {
      showSalesDetailError('You do not have permission to ' + (isEditing ? 'edit' : 'add') + ' sale line items.');
      return;
    }
    error.textContent = '';
    error.classList.remove('show');
    const quantityText = quantityInput.value.trim();
    const quantity = Number(quantityText);
    if (!productSelect.value || !/^[1-9]\d*$/.test(quantityText) || !Number.isSafeInteger(quantity)) {
      showSalesDetailError('Select a product and enter a whole-number quantity of at least 1.');
      return;
    }

    const sale = getSales().find(function (item) {
      return item.transNo === selectedTransNo && !item.isDeleted;
    });
    if (!sale) {
      showSalesDetailError('Active sale not found.');
      return;
    }
    const products = window.getProducts();
    const product = products.find(function (item) {
      return item.prodCode === productSelect.value;
    });
    const currentProductCode = isEditing ? editKey.value.slice(editKey.value.indexOf('|') + 1) : '';
    if (!product || (product.isDeleted && product.prodCode !== currentProductCode)) {
      showSalesDetailError('Select an active product.');
      return;
    }

    const details = getSalesDetails();
    if (isEditing) {
      const detail = details.find(function (item) {
        return item.transNo + '|' + item.prodCode === editKey.value && !item.isDeleted;
      });
      if (!detail) {
        showSalesDetailError('Active sale line item not found.');
        return;
      }
      detail.quantity = quantity;
      detail.stamp = makeStamp('EDITED');
    } else {
      const duplicate = details.some(function (item) {
        return item.transNo === selectedTransNo &&
          item.prodCode === product.prodCode &&
          !item.isDeleted;
      });
      if (duplicate) {
        showSalesDetailError('This product is already on this sale. Edit the existing line.');
        return;
      }
      details.push({
        transNo: selectedTransNo,
        prodCode: product.prodCode,
        quantity: quantity,
        isDeleted: false,
        stamp: makeStamp('CREATED')
      });
    }

    saveSalesDetails(details);
    window.closeSalesDetailForm();
    renderSalesDetailList();
    renderSales();
  };
  window.softDeleteSalesDetail = function (transNo, productCode) {
    if (!window.can('sales.detailDelete')) {
      window.alert('You do not have permission to delete sale line items.');
      return;
    }
    const sale = getSales().find(function (item) {
      return item.transNo === transNo && !item.isDeleted;
    });
    if (!sale) {
      window.alert('Active sale not found.');
      return;
    }
    if (!window.confirm('Mark this line item as inactive?')) return;
    const details = getSalesDetails();
    const detail = details.find(function (item) {
      return item.transNo === transNo && item.prodCode === productCode && !item.isDeleted;
    });
    if (!detail) {
      window.alert('Active sale line item not found.');
      return;
    }
    detail.isDeleted = true;
    detail.stamp = makeStamp('DELETED');
    saveSalesDetails(details);
    renderSalesDetailList();
    renderSales();
  };
  window.restoreSalesDetail = function (transNo, productCode) {
    const role = window.currentUser && window.currentUser.role;
    if (role !== 'superadmin' && role !== 'admin') {
      window.alert('Only Superadmin or Admin can restore sale line items.');
      return;
    }
    const details = getSalesDetails();
    const detail = details.find(function (item) {
      return item.transNo === transNo && item.prodCode === productCode && item.isDeleted;
    });
    if (!detail) {
      window.alert('Inactive sale line item not found.');
      return;
    }
    const duplicate = details.some(function (item) {
      return item.transNo === transNo && item.prodCode === productCode && !item.isDeleted;
    });
    if (duplicate) {
      window.alert('Cannot restore: this product is already on the sale as an active line.');
      return;
    }
    detail.isDeleted = false;
    detail.stamp = makeStamp('RESTORED');
    saveSalesDetails(details);
    renderSalesDetailList();
    renderSales();
  };

  window.softDeleteSale = function (transNo) {
    if (!window.can('sales.delete')) {
      window.alert('You do not have permission to delete sales.');
      return;
    }
    if (!window.confirm('Mark this sale as inactive? Line items remain in history.')) return;

    const sales = getSales();
    const sale = sales.find(function (item) {
      return item.transNo === transNo && !item.isDeleted;
    });
    if (!sale) {
      window.alert('Active sale not found.');
      return;
    }
    sale.isDeleted = true;
    sale.stamp = makeStamp('DELETED');
    saveSales(sales);
    renderSales();
  };
  window.restoreSale = function (transNo) {
    const role = window.currentUser && window.currentUser.role;
    if (role !== 'superadmin' && role !== 'admin') {
      window.alert('Only Superadmin or Admin can restore sales.');
      return;
    }

    const sales = getSales();
    const sale = sales.find(function (item) {
      return item.transNo === transNo && item.isDeleted;
    });
    if (!sale) {
      window.alert('Inactive sale not found.');
      return;
    }
    sale.isDeleted = false;
    sale.stamp = makeStamp('RESTORED');
    saveSales(sales);
    renderSales();
  };

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      const detailForm = document.getElementById('salesDetailFormModal');
      const detailList = document.getElementById('salesDetailListModal');
      const salesModal = document.getElementById('salesModal');
      if (detailForm && detailForm.classList.contains('active')) {
        window.closeSalesDetailForm();
      } else if (detailList && detailList.classList.contains('active')) {
        window.closeModal('salesDetailList');
      } else if (salesModal && salesModal.classList.contains('active')) {
        window.closeSalesModal();
      }
    }
  });

  ['salesDetailListModal', 'salesDetailFormModal'].forEach(function (id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', function (event) {
        if (event.target !== modal) return;
        if (id === 'salesDetailFormModal') window.closeSalesDetailForm();
        else window.closeModal('salesDetailList');
      });
    }
  });
})();
