(function () {
  'use strict';

  const REPORTS = [
    { id: 'topCustomers', label: 'Top Customers', permission: 'reports.topCustomers' },
    { id: 'productMaster', label: 'Product Master List', permission: 'reports.productMaster' },
    { id: 'topProducts', label: 'Top Products', permission: 'reports.topProducts' },
    { id: 'activeEmployees', label: 'Active Employees', permission: 'reports.activeEmployees' },
    { id: 'allEmployees', label: 'All Employees', permission: 'reports.allEmployees' },
    { id: 'empJobHistory', label: 'Employee Job History', permission: 'reports.empJobHistory' },
    { id: 'topSales', label: 'Top Sales', permission: 'reports.topSales' }
  ];

  let selectedReport = 'topCustomers';
  let dateFrom = '';
  let dateTo = '';
  let topCount = 10;
  let employeeNo = '';

  function escape(value) {
    return window.escapeHtml(value);
  }

  function money(value) {
    return '$' + Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(value + 'T00:00:00.000Z');
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }

  function getAllowedReports() {
    return REPORTS.filter(function (report) {
      return window.can(report.permission);
    });
  }

  function getActiveSalesInRange() {
    return window.getSales().filter(function (sale) {
      if (sale.isDeleted) return false;
      if (dateFrom && sale.salesDate < dateFrom) return false;
      if (dateTo && sale.salesDate > dateTo) return false;
      return true;
    });
  }

  function getSalesLineAmount(sale, detail, prices) {
    const price = prices
      .filter(function (item) {
        return item.prodCode === detail.prodCode && !item.isDeleted && item.effDate <= sale.salesDate;
      })
      .sort(function (left, right) {
        return right.effDate.localeCompare(left.effDate);
      })[0];
    return Number(detail.quantity || 0) * (price ? Number(price.unitPrice) || 0 : 0);
  }

  function getReportData() {
    const sales = getActiveSalesInRange();
    const details = window.getSalesDetails().filter(function (detail) {
      return !detail.isDeleted;
    });
    const prices = window.getPrices();
    const byTransaction = new Map();
    details.forEach(function (detail) {
      const current = byTransaction.get(detail.transNo) || [];
      current.push(detail);
      byTransaction.set(detail.transNo, current);
    });
    return { sales: sales, details: details, prices: prices, byTransaction: byTransaction };
  }

  function reportActions() {
    return '<div class="report-actions">' +
      '<button type="button" class="btn btn-secondary btn-sm" onclick="window.printReport()">Print</button>' +
      '<button type="button" class="btn btn-primary btn-sm" onclick="window.saveReportPdf()">Save as PDF</button>' +
      '</div>';
  }

  function dateFilters(showTopCount) {
    return '<div class="report-filter-bar">' +
      '<label>From <input type="date" class="search-input" aria-label="Report start date" value="' +
      escape(dateFrom) +
      '" onchange="window.setReportDateFilter(&quot;from&quot;, this.value)" /></label>' +
      '<label>To <input type="date" class="search-input" aria-label="Report end date" value="' +
      escape(dateTo) +
      '" onchange="window.setReportDateFilter(&quot;to&quot;, this.value)" /></label>' +
      (showTopCount
        ? '<label>Top N <input type="number" class="search-input report-top-count" aria-label="Top N" min="1" max="100" step="1" value="' +
          topCount +
          '" onchange="window.setReportTopCount(this.value)" /></label>'
        : '') +
      reportActions() +
      '</div>';
  }

  function table(headers, rows, emptyMessage) {
    const body = rows.length
      ? rows.join('')
      : '<tr><td colspan="' + headers.length + '"><div class="empty-state">' +
        escape(emptyMessage) +
        '</div></td></tr>';
    return '<div class="data-table-wrap"><table class="data-table"><thead><tr>' +
      headers.map(function (heading) {
        return '<th>' + escape(heading) + '</th>';
      }).join('') +
      '</tr></thead><tbody>' +
      body +
      '</tbody></table></div>';
  }

  function topCustomersReport() {
    const data = getReportData();
    const totals = new Map();
    data.sales.forEach(function (sale) {
      (data.byTransaction.get(sale.transNo) || []).forEach(function (detail) {
        totals.set(
          sale.custNo,
          (totals.get(sale.custNo) || 0) + getSalesLineAmount(sale, detail, data.prices)
        );
      });
    });
    const customers = window.getCustomers();
    const rows = Array.from(totals.entries())
      .map(function (entry) {
        const customer = customers.find(function (item) {
          return item.custNo === entry[0];
        });
        return {
          custNo: entry[0],
          name: customer ? customer.custName : entry[0],
          total: entry[1]
        };
      })
      .sort(function (left, right) {
        return right.total - left.total;
      })
      .slice(0, topCount)
      .map(function (item, index) {
        return '<tr><td>' +
          (index + 1) +
          '</td><td><strong>' +
          escape(item.custNo) +
          '</strong></td><td>' +
          escape(item.name) +
          '</td><td><strong>' +
          money(item.total) +
          '</strong></td></tr>';
      });

    return '<h3>Top Customers by Sales</h3>' +
      dateFilters(true) +
      table(['Rank', 'Customer No.', 'Customer Name', 'Total Sales'], rows, 'No sales data for this period.');
  }

  function productMasterReport() {
    const products = window.getProducts().filter(function (product) {
      return !product.isDeleted;
    });
    const prices = window.getPrices();
    const rows = products.map(function (product) {
      const price = prices
        .filter(function (item) {
          return item.prodCode === product.prodCode && !item.isDeleted && item.effDate <= window.todayStr();
        })
        .sort(function (left, right) {
          return right.effDate.localeCompare(left.effDate);
        })[0];
      return '<tr><td><strong>' +
        escape(product.prodCode) +
        '</strong></td><td>' +
        escape(product.description) +
        '</td><td>' +
        escape(product.unit) +
        '</td><td><strong>' +
        (price ? money(price.unitPrice) : '—') +
        '</strong></td></tr>';
    });
    return '<h3>Product Master List (Current Price)</h3>' +
      reportActions() +
      table(['Product Code', 'Description', 'Unit', 'Current Price'], rows, 'No active products.');
  }

  function topProductsReport() {
    const data = getReportData();
    const totals = new Map();
    data.sales.forEach(function (sale) {
      (data.byTransaction.get(sale.transNo) || []).forEach(function (detail) {
        const current = totals.get(detail.prodCode) || { quantity: 0, amount: 0 };
        current.quantity += Number(detail.quantity) || 0;
        current.amount += getSalesLineAmount(sale, detail, data.prices);
        totals.set(detail.prodCode, current);
      });
    });
    const products = window.getProducts();
    const rows = Array.from(totals.entries())
      .map(function (entry) {
        const product = products.find(function (item) {
          return item.prodCode === entry[0];
        });
        return {
          prodCode: entry[0],
          description: product ? product.description : entry[0],
          quantity: entry[1].quantity,
          amount: entry[1].amount
        };
      })
      .sort(function (left, right) {
        return right.amount - left.amount;
      })
      .slice(0, topCount)
      .map(function (item, index) {
        return '<tr><td>' +
          (index + 1) +
          '</td><td><strong>' +
          escape(item.prodCode) +
          '</strong></td><td>' +
          escape(item.description) +
          '</td><td>' +
          item.quantity +
          '</td><td><strong>' +
          money(item.amount) +
          '</strong></td></tr>';
      });
    return '<h3>Top Products by Sales Amount</h3>' +
      dateFilters(true) +
      table(['Rank', 'Product Code', 'Description', 'Quantity Sold', 'Sales Amount'], rows, 'No sales data for this period.');
  }

  function activeEmployeesReport() {
    const employees = window.getEmployees().filter(function (employee) {
      return !employee.isDeleted && !employee.sepDate;
    });
    const rows = employees.map(function (employee) {
      return '<tr><td><strong>' +
        escape(employee.empNo) +
        '</strong></td><td>' +
        escape(employee.lastName) +
        '</td><td>' +
        escape(employee.firstName) +
        '</td><td>' +
        escape(employee.gender) +
        '</td><td>' +
        escape(employee.birthDate) +
        '</td><td>' +
        escape(employee.hireDate) +
        '</td></tr>';
    });
    return '<h3>Active Employees (Not Separated)</h3>' +
      '<p class="report-note">Employees with no separation date.</p>' +
      reportActions() +
      table(['Employee No.', 'Last Name', 'First Name', 'Gender', 'Birth Date', 'Hire Date'], rows, 'No active employees.');
  }

  function allEmployeesReport() {
    const employees = window.getEmployees().filter(function (employee) {
      return !employee.isDeleted;
    });
    const rows = employees.map(function (employee) {
      return '<tr><td><strong>' +
        escape(employee.empNo) +
        '</strong></td><td>' +
        escape(employee.lastName) +
        '</td><td>' +
        escape(employee.firstName) +
        '</td><td>' +
        escape(employee.gender) +
        '</td><td>' +
        escape(employee.birthDate) +
        '</td><td>' +
        escape(employee.hireDate) +
        '</td><td>' +
        escape(employee.sepDate || '—') +
        '</td><td>' +
        (employee.sepDate
          ? '<span class="badge badge-deleted">Separated</span>'
          : '<span class="badge badge-active">Active</span>') +
        '</td></tr>';
    });
    return '<h3>All Employees (Including Separated)</h3>' +
      reportActions() +
      table(['Employee No.', 'Last Name', 'First Name', 'Gender', 'Birth Date', 'Hire Date', 'Separation Date', 'Status'], rows, 'No employees.');
  }

  function employeeJobHistoryReport() {
    const employees = window.getEmployees().filter(function (employee) {
      return !employee.isDeleted;
    });
    if (employeeNo && !employees.some(function (employee) {
      return employee.empNo === employeeNo;
    })) {
      employeeNo = '';
    }

    const employeeOptions = employees.map(function (employee) {
      return '<option value="' +
        escape(employee.empNo) +
        '"' +
        (employeeNo === employee.empNo ? ' selected' : '') +
        '>' +
        escape(employee.empNo) +
        ' — ' +
        escape(employee.firstName) +
        ' ' +
        escape(employee.lastName) +
        '</option>';
    }).join('');
    let historyTable = '<div class="empty-state">Select an employee to view job history.</div>';
    if (employeeNo) {
      const jobs = window.getJobs();
      const departments = window.getDepartments();
      const histories = window.getJobHistories()
        .filter(function (history) {
          return history.empNo === employeeNo && !history.isDeleted;
        })
        .sort(function (left, right) {
          return right.effDate.localeCompare(left.effDate);
        });
      const rows = histories.map(function (history) {
        const job = jobs.find(function (item) {
          return item.jobCode === history.jobCode;
        });
        const department = departments.find(function (item) {
          return item.deptCode === history.deptCode;
        });
        return '<tr><td>' +
          escape(history.effDate) +
          '</td><td>' +
          escape(history.jobCode) +
          ' — ' +
          escape(job ? job.jobDesc : history.jobCode) +
          '</td><td>' +
          escape(history.deptCode) +
          ' — ' +
          escape(department ? department.deptName : history.deptCode) +
          '</td><td><strong>' +
          money(history.salary) +
          '</strong></td></tr>';
      });
      historyTable = table(['Effective Date', 'Job', 'Department', 'Salary'], rows, 'No job history for this employee.');
    }
    return '<h3>Employee Job History</h3>' +
      reportActions() +
      '<div class="report-employee-filter"><label for="reportEmployee">Employee</label>' +
      '<select id="reportEmployee" class="search-input" onchange="window.setReportEmployee(this.value)">' +
      '<option value="">— Select —</option>' +
      employeeOptions +
      '</select></div>' +
      historyTable;
  }

  function topSalesReport() {
    const data = getReportData();
    const customers = window.getCustomers();
    const employees = window.getEmployees();
    const rows = data.sales.map(function (sale) {
      const total = (data.byTransaction.get(sale.transNo) || []).reduce(function (sum, detail) {
        return sum + getSalesLineAmount(sale, detail, data.prices);
      }, 0);
      const customer = customers.find(function (item) {
        return item.custNo === sale.custNo;
      });
      const employee = employees.find(function (item) {
        return item.empNo === sale.empNo;
      });
      return {
        transNo: sale.transNo,
        date: sale.salesDate,
        customer: customer ? customer.custName : sale.custNo,
        employee: employee ? employee.firstName + ' ' + employee.lastName : sale.empNo,
        total: total
      };
    }).sort(function (left, right) {
      return right.total - left.total;
    }).slice(0, topCount).map(function (sale, index) {
      return '<tr><td>' +
        (index + 1) +
        '</td><td><strong>' +
        escape(sale.transNo) +
        '</strong></td><td>' +
        escape(sale.date) +
        '</td><td>' +
        escape(sale.customer) +
        '</td><td>' +
        escape(sale.employee) +
        '</td><td><strong>' +
        money(sale.total) +
        '</strong></td></tr>';
    });
    return '<h3>Top Sales</h3>' +
      dateFilters(true) +
      table(['Rank', 'Transaction No.', 'Date', 'Customer', 'Employee', 'Total'], rows, 'No sales in this period.');
  }

  function renderSelectedReport() {
    switch (selectedReport) {
      case 'topCustomers':
        return topCustomersReport();
      case 'productMaster':
        return productMasterReport();
      case 'topProducts':
        return topProductsReport();
      case 'activeEmployees':
        return activeEmployeesReport();
      case 'allEmployees':
        return allEmployeesReport();
      case 'empJobHistory':
        return employeeJobHistoryReport();
      case 'topSales':
        return topSalesReport();
      default:
        return '<div class="empty-state">Select a report.</div>';
    }
  }

  function renderReports() {
    const area = document.getElementById('contentArea');
    if (!area) return;
    if (!window.currentUser || !window.canModule('reports')) {
      area.innerHTML = '<div class="empty-state">Access denied.</div>';
      return;
    }

    const allowedReports = getAllowedReports();
    if (!allowedReports.length) {
      area.innerHTML = '<div class="empty-state">No reports assigned to your account.</div>';
      return;
    }
    if (!allowedReports.some(function (report) {
      return report.id === selectedReport;
    })) {
      selectedReport = allowedReports[0].id;
    }

    const tabs = '<div class="filter-tabs report-tabs" role="tablist" aria-label="Reports">' +
      allowedReports.map(function (report) {
        const isSelected = selectedReport === report.id;
        return '<button type="button" class="filter-tab' +
          (isSelected ? ' active' : '') +
          '" role="tab" aria-selected="' +
          isSelected +
          '" onclick="window.setSelectedReport(&quot;' +
          report.id +
          '&quot;)">' +
          escape(report.label) +
          '</button>';
      }).join('') +
      '</div>';
    area.innerHTML = tabs + '<section class="report-print-area" id="reportPrintArea">' +
      renderSelectedReport() +
      '</section>';
  }

  window.renderReports = renderReports;
  window.setSelectedReport = function (reportId) {
    if (!getAllowedReports().some(function (report) {
      return report.id === reportId;
    })) {
      window.alert('You do not have permission to view this report.');
      return;
    }
    selectedReport = reportId;
    renderReports();
  };
  window.setReportDateFilter = function (field, value) {
    if ((field !== 'from' && field !== 'to') || (value && !isValidDate(value))) {
      window.alert('Enter a valid report date.');
      renderReports();
      return;
    }
    if (field === 'from') {
      if (value && dateTo && value > dateTo) {
        window.alert('The start date must be on or before the end date.');
        renderReports();
        return;
      }
      dateFrom = value;
    } else {
      if (value && dateFrom && value < dateFrom) {
        window.alert('The end date must be on or after the start date.');
        renderReports();
        return;
      }
      dateTo = value;
    }
    renderReports();
  };
  window.setReportTopCount = function (value) {
    const count = Number(value);
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      window.alert('Top N must be a whole number between 1 and 100.');
      renderReports();
      return;
    }
    topCount = count;
    renderReports();
  };
  window.setReportEmployee = function (value) {
    employeeNo = String(value == null ? '' : value);
    renderReports();
  };
  window.printReport = function () {
    if (!window.canModule('reports') || !getAllowedReports().some(function (report) {
      return report.id === selectedReport;
    })) {
      window.alert('You do not have permission to print this report.');
      return;
    }
    window.print();
  };
  window.saveReportPdf = function () {
    if (!window.canModule('reports') || !getAllowedReports().some(function (report) {
      return report.id === selectedReport;
    })) {
      window.alert('You do not have permission to save this report.');
      return;
    }
    window.alert('In the print dialog, choose Save as PDF as the destination.');
    window.setTimeout(function () {
      window.print();
    }, 100);
  };
})();
