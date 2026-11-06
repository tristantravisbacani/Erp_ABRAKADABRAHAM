(function () {
  'use strict';

  const DATASETS = {
    customers: {
      table: 'erp_customers',
      select: 'access_scope, cust_no, cust_name, address, payterms, is_deleted, stamp, updated_at',
      key: [{ column: 'cust_no', field: 'custNo' }],
      fromDatabase: function (row) {
        return {
          custNo: row.cust_no,
          custName: row.cust_name,
          address: row.address,
          payterms: row.payterms,
          isDeleted: row.is_deleted,
          stamp: row.stamp,
          updatedAt: row.updated_at
        };
      },
      toDatabase: function (record, scope) {
        return {
          access_scope: scope,
          cust_no: record.custNo,
          cust_name: record.custName,
          address: record.address,
          payterms: record.payterms,
          is_deleted: !!record.isDeleted,
          stamp: record.stamp || ''
        };
      }
    },
    products: {
      table: 'erp_products',
      select: 'access_scope, prod_code, description, unit, is_deleted, stamp, updated_at',
      key: [{ column: 'prod_code', field: 'prodCode' }],
      fromDatabase: function (row) {
        return {
          prodCode: row.prod_code,
          description: row.description,
          unit: row.unit,
          isDeleted: row.is_deleted,
          stamp: row.stamp,
          updatedAt: row.updated_at
        };
      },
      toDatabase: function (record, scope) {
        return {
          access_scope: scope,
          prod_code: record.prodCode,
          description: record.description,
          unit: record.unit,
          is_deleted: !!record.isDeleted,
          stamp: record.stamp || ''
        };
      }
    },
    prices: {
      table: 'erp_product_prices',
      select: 'access_scope, prod_code, eff_date, unit_price, is_deleted, stamp, updated_at',
      key: [
        { column: 'prod_code', field: 'prodCode' },
        { column: 'eff_date', field: 'effDate' }
      ],
      fromDatabase: function (row) {
        return {
          prodCode: row.prod_code,
          effDate: row.eff_date,
          unitPrice: Number(row.unit_price),
          isDeleted: row.is_deleted,
          stamp: row.stamp,
          updatedAt: row.updated_at
        };
      },
      toDatabase: function (record, scope) {
        return {
          access_scope: scope,
          prod_code: record.prodCode,
          eff_date: record.effDate,
          unit_price: Number(record.unitPrice),
          is_deleted: !!record.isDeleted,
          stamp: record.stamp || ''
        };
      }
    },
    employees: {
      table: 'erp_employees',
      select: 'access_scope, emp_no, last_name, first_name, gender, birth_date, hire_date, sep_date, is_deleted, stamp, updated_at',
      key: [{ column: 'emp_no', field: 'empNo' }],
      fromDatabase: function (row) {
        return {
          empNo: row.emp_no,
          lastName: row.last_name,
          firstName: row.first_name,
          gender: row.gender,
          birthDate: row.birth_date,
          hireDate: row.hire_date,
          sepDate: row.sep_date || '',
          isDeleted: row.is_deleted,
          stamp: row.stamp,
          updatedAt: row.updated_at
        };
      },
      toDatabase: function (record, scope) {
        return {
          access_scope: scope,
          emp_no: record.empNo,
          last_name: record.lastName,
          first_name: record.firstName,
          gender: record.gender,
          birth_date: record.birthDate,
          hire_date: record.hireDate,
          sep_date: record.sepDate || null,
          is_deleted: !!record.isDeleted,
          stamp: record.stamp || ''
        };
      }
    },
    jobs: {
      table: 'erp_jobs',
      select: 'access_scope, job_code, job_desc, is_deleted, stamp, updated_at',
      key: [{ column: 'job_code', field: 'jobCode' }],
      fromDatabase: function (row) {
        return {
          jobCode: row.job_code,
          jobDesc: row.job_desc,
          isDeleted: row.is_deleted,
          stamp: row.stamp,
          updatedAt: row.updated_at
        };
      },
      toDatabase: function (record, scope) {
        return {
          access_scope: scope,
          job_code: record.jobCode,
          job_desc: record.jobDesc,
          is_deleted: !!record.isDeleted,
          stamp: record.stamp || ''
        };
      }
    },
    departments: {
      table: 'erp_departments',
      select: 'access_scope, dept_code, dept_name, is_deleted, stamp, updated_at',
      key: [{ column: 'dept_code', field: 'deptCode' }],
      fromDatabase: function (row) {
        return {
          deptCode: row.dept_code,
          deptName: row.dept_name,
          isDeleted: row.is_deleted,
          stamp: row.stamp,
          updatedAt: row.updated_at
        };
      },
      toDatabase: function (record, scope) {
        return {
          access_scope: scope,
          dept_code: record.deptCode,
          dept_name: record.deptName,
          is_deleted: !!record.isDeleted,
          stamp: record.stamp || ''
        };
      }
    },
    jobHistories: {
      table: 'erp_job_histories',
      select: 'access_scope, id, emp_no, job_code, eff_date, salary, dept_code, is_deleted, stamp, updated_at',
      key: [{ column: 'id', field: 'id' }],
      fromDatabase: function (row) {
        return {
          id: row.id,
          empNo: row.emp_no,
          jobCode: row.job_code,
          effDate: row.eff_date,
          salary: Number(row.salary),
          deptCode: row.dept_code,
          isDeleted: row.is_deleted,
          stamp: row.stamp,
          updatedAt: row.updated_at
        };
      },
      toDatabase: function (record, scope) {
        const row = {
          access_scope: scope,
          emp_no: record.empNo,
          job_code: record.jobCode,
          eff_date: record.effDate,
          salary: Number(record.salary),
          dept_code: record.deptCode,
          is_deleted: !!record.isDeleted,
          stamp: record.stamp || ''
        };
        if (record.id) row.id = record.id;
        return row;
      }
    },
    sales: {
      table: 'erp_sales',
      select: 'access_scope, trans_no, sales_date, cust_no, emp_no, is_deleted, stamp, updated_at',
      key: [{ column: 'trans_no', field: 'transNo' }],
      fromDatabase: function (row) {
        return {
          transNo: row.trans_no,
          salesDate: row.sales_date,
          custNo: row.cust_no,
          empNo: row.emp_no,
          isDeleted: row.is_deleted,
          stamp: row.stamp,
          updatedAt: row.updated_at
        };
      },
      toDatabase: function (record, scope) {
        return {
          access_scope: scope,
          trans_no: record.transNo,
          sales_date: record.salesDate,
          cust_no: record.custNo,
          emp_no: record.empNo,
          is_deleted: !!record.isDeleted,
          stamp: record.stamp || ''
        };
      }
    },
    salesDetails: {
      table: 'erp_sales_details',
      select: 'access_scope, id, trans_no, prod_code, quantity, is_deleted, stamp, updated_at',
      key: [{ column: 'id', field: 'id' }],
      fromDatabase: function (row) {
        return {
          id: row.id,
          transNo: row.trans_no,
          prodCode: row.prod_code,
          quantity: row.quantity,
          isDeleted: row.is_deleted,
          stamp: row.stamp,
          updatedAt: row.updated_at
        };
      },
      toDatabase: function (record, scope) {
        const row = {
          access_scope: scope,
          trans_no: record.transNo,
          prod_code: record.prodCode,
          quantity: record.quantity,
          is_deleted: !!record.isDeleted,
          stamp: record.stamp || ''
        };
        if (record.id) row.id = record.id;
        return row;
      }
    }
  };

  let cloudData = null;
  let snapshots = null;
  let dataScope = null;
  let dataOwner = null;
  const pendingWrites = Object.create(null);

  function clone(records) {
    return records.map(function (record) {
      return Object.assign({}, record);
    });
  }

  function getCurrentScope() {
    const user = window.currentUser;
    if (!user || user.authProvider !== 'supabase' || !['sandbox', 'production'].includes(user.accessScope)) {
      throw new Error('An active Supabase profile with a valid data scope is required.');
    }
    return user.accessScope;
  }

  function getClient() {
    if (!window.supabaseClient) {
      throw new Error('Supabase is unavailable. Check your connection and reload the page.');
    }
    return window.supabaseClient;
  }

  function canReadDataset(name) {
    const reportAccess = function (permissions) {
      return window.can('reports.view') && permissions.some(window.can);
    };
    const permissions = {
      customers: function () {
        return ['customers.view', 'sales.view'].some(window.can) ||
          reportAccess(['reports.topCustomers', 'reports.topSales']);
      },
      products: function () {
        return ['products.view', 'sales.view'].some(window.can) ||
          reportAccess(['reports.productMaster', 'reports.topProducts', 'reports.topSales']);
      },
      prices: function () {
        return ['products.view', 'sales.view'].some(window.can) ||
          reportAccess(['reports.topCustomers', 'reports.topProducts', 'reports.topSales']);
      },
      employees: function () {
        return ['hr.view', 'hr.jhView', 'sales.view'].some(window.can) ||
          reportAccess([
            'reports.activeEmployees',
            'reports.allEmployees',
            'reports.empJobHistory',
            'reports.topSales'
          ]);
      },
      jobs: function () {
        return ['hr.view', 'hr.jhView'].some(window.can) ||
          reportAccess(['reports.activeEmployees', 'reports.allEmployees', 'reports.empJobHistory']);
      },
      departments: function () {
        return ['hr.view', 'hr.jhView'].some(window.can) ||
          reportAccess(['reports.activeEmployees', 'reports.allEmployees', 'reports.empJobHistory']);
      },
      jobHistories: function () {
        return ['hr.view', 'hr.jhView'].some(window.can) ||
          reportAccess(['reports.empJobHistory']);
      },
      sales: function () {
        return ['sales.view', 'sales.detailView'].some(window.can) ||
          reportAccess(['reports.topCustomers', 'reports.topProducts', 'reports.topSales']);
      },
      salesDetails: function () {
        return ['sales.view', 'sales.detailView'].some(window.can) ||
          reportAccess(['reports.topCustomers', 'reports.topProducts', 'reports.topSales']);
      }
    };
    return !!(permissions[name] && permissions[name]());
  }

  window.getSupabaseERPRecords = function (name) {
    if (
      !cloudData ||
      dataScope !== getCurrentScope() ||
      dataOwner !== window.currentUser.id ||
      !Object.prototype.hasOwnProperty.call(cloudData, name)
    ) {
      throw new Error('Supabase ERP records have not been loaded. Please reload and sign in again.');
    }
    return cloudData[name];
  };

  async function fetchDataset(client, name, scope) {
    const config = DATASETS[name];
    if (!canReadDataset(name)) return [];
    const { data, error } = await client
      .from(config.table)
      .select(config.select)
      .eq('access_scope', scope);
    if (error) throw error;
    return data.map(config.fromDatabase);
  }

  async function loadAllDatasets(client, scope) {
    const names = Object.keys(DATASETS);
    const results = await Promise.all(names.map(function (name) {
      return fetchDataset(client, name, scope);
    }));
    return names.reduce(function (records, name, index) {
      records[name] = results[index];
      return records;
    }, {});
  }

  window.initializeSupabaseERPData = async function () {
    const scope = getCurrentScope();
    const owner = window.currentUser.id;
    const client = getClient();
    let records = await loadAllDatasets(client, scope);

    if (
      scope === 'sandbox' &&
      window.currentUser.role !== 'user' &&
      records.customers.length === 0 &&
      records.products.length === 0 &&
      records.prices.length === 0
    ) {
      const localFixtures = {
        customers: window.getDemoCustomerFixtures(),
        products: window.getDemoProductFixtures(),
        prices: window.getDemoPriceFixtures()
      };
      const { error } = await client.rpc('seed_sandbox_catalog', {
        p_customers: localFixtures.customers.map(function (record) {
          return DATASETS.customers.toDatabase(record, scope);
        }),
        p_products: localFixtures.products.map(function (record) {
          return DATASETS.products.toDatabase(record, scope);
        }),
        p_prices: localFixtures.prices.map(function (record) {
          return DATASETS.prices.toDatabase(record, scope);
        })
      });
      if (error) throw error;
      records = await loadAllDatasets(client, scope);
    }

    if (
      scope === 'sandbox' &&
      window.currentUser.role !== 'user' &&
      records.employees.length === 0 &&
      records.jobs.length === 0 &&
      records.departments.length === 0 &&
      records.jobHistories.length === 0 &&
      records.sales.length === 0 &&
      records.salesDetails.length === 0
    ) {
      const localFixtures = {
        employees: window.getDemoEmployeeFixtures(),
        jobs: window.getDemoJobFixtures(),
        departments: window.getDemoDepartmentFixtures(),
        jobHistories: window.getDemoJobHistoryFixtures(),
        sales: window.getDemoSalesFixtures(),
        salesDetails: window.getDemoSalesDetailFixtures()
      };
      const { error } = await client.rpc('seed_sandbox_hr_sales', {
        p_employees: localFixtures.employees.map(function (record) {
          return DATASETS.employees.toDatabase(record, scope);
        }),
        p_jobs: localFixtures.jobs.map(function (record) {
          return DATASETS.jobs.toDatabase(record, scope);
        }),
        p_departments: localFixtures.departments.map(function (record) {
          return DATASETS.departments.toDatabase(record, scope);
        }),
        p_job_histories: localFixtures.jobHistories.map(function (record) {
          return DATASETS.jobHistories.toDatabase(record, scope);
        }),
        p_sales: localFixtures.sales.map(function (record) {
          return DATASETS.sales.toDatabase(record, scope);
        }),
        p_sales_details: localFixtures.salesDetails.map(function (record) {
          return DATASETS.salesDetails.toDatabase(record, scope);
        })
      });
      if (error) throw error;
      records = await loadAllDatasets(client, scope);
    }

    if (getCurrentScope() !== scope || window.currentUser.id !== owner) {
      throw new Error('The active account changed while ERP data was loading. Please reload and sign in again.');
    }

    cloudData = records;
    snapshots = Object.keys(records).reduce(function (result, name) {
      result[name] = clone(records[name]);
      return result;
    }, {});
    dataScope = scope;
    dataOwner = owner;
  };

  window.clearSupabaseERPData = function () {
    cloudData = null;
    snapshots = null;
    dataScope = null;
    dataOwner = null;
  };

  async function persistSupabaseERPRecords(name, records, scope, owner) {
    if (!cloudData || !snapshots || scope !== dataScope || owner !== dataOwner) {
      throw new Error('Supabase ERP records are not ready for this account. Reload and sign in again.');
    }
    const config = DATASETS[name];
    if (!config) throw new Error('Unknown Supabase ERP dataset.');

    const previous = snapshots[name];
    const previousByKey = new Map();
    previous.forEach(function (record) {
      previousByKey.set(config.key.map(function (key) { return record[key.field]; }).join('|'), record);
    });

    try {
      for (const record of records) {
        const key = config.key.map(function (item) { return record[item.field]; }).join('|');
        const previousRecord = previousByKey.get(key);
        const payload = config.toDatabase(record, scope);
        const previousPayload = previousRecord && config.toDatabase(previousRecord, scope);
        if (previousPayload && JSON.stringify(payload) === JSON.stringify(previousPayload)) continue;

        let query = getClient().from(config.table);
        if (previousRecord) {
          query = query.update(payload);
        } else {
          query = query.insert(payload);
        }
        if (previousRecord) {
          query = query.eq('access_scope', scope);
          config.key.forEach(function (item) {
            query = query.eq(item.column, previousRecord[item.field]);
          });
          query = query.eq('updated_at', previousRecord.updatedAt);
        }
        const result = await query.select(config.select);
        if (result.error) throw result.error;
        if (!result.data || result.data.length !== 1) {
          throw new Error('The record was not saved. It may have changed or your permissions may have been updated.');
        }
        config.key.forEach(function (item) {
          if (result.data[0][item.column] !== undefined) record[item.field] = result.data[0][item.column];
        });
        record.updatedAt = result.data[0].updated_at;
      }
    } catch (error) {
      if (cloudData && snapshots && dataScope === scope && dataOwner === owner) {
        cloudData[name] = clone(snapshots[name]);
      }
      throw error;
    }

    if (!cloudData || !snapshots || dataScope !== scope || dataOwner !== owner) {
      throw new Error('The active account changed while the record was saving. Reload and sign in again.');
    }
    cloudData[name] = clone(records);
    snapshots[name] = clone(records);
  }

  window.saveSupabaseERPRecords = function (name, records) {
    const scope = getCurrentScope();
    const owner = window.currentUser.id;
    if (!DATASETS[name]) throw new Error('Unknown Supabase ERP dataset.');
    if (!Array.isArray(records)) throw new Error('Supabase ERP records must be an array.');

    const requestedRecords = clone(records);
    const previousWrite = pendingWrites[name] || Promise.resolve();
    const currentWrite = previousWrite.catch(function () {}).then(function () {
      if (getCurrentScope() !== scope || window.currentUser.id !== owner) {
        throw new Error('The active account changed before the record could be saved.');
      }
      return persistSupabaseERPRecords(name, requestedRecords, scope, owner);
    });
    pendingWrites[name] = currentWrite;
    return currentWrite.finally(function () {
      if (pendingWrites[name] === currentWrite) delete pendingWrites[name];
    });
  };
})();
