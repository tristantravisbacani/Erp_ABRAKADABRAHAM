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
    const { data, error } = await client
      .from(config.table)
      .select(config.select)
      .eq('access_scope', scope);
    if (error) throw error;
    return data.map(config.fromDatabase);
  }

  async function loadAllDatasets(client, scope) {
    const results = await Promise.all([
      fetchDataset(client, 'customers', scope),
      fetchDataset(client, 'products', scope),
      fetchDataset(client, 'prices', scope)
    ]);
    return { customers: results[0], products: results[1], prices: results[2] };
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

    if (getCurrentScope() !== scope || window.currentUser.id !== owner) {
      throw new Error('The active account changed while ERP data was loading. Please reload and sign in again.');
    }

    cloudData = records;
    snapshots = {
      customers: clone(records.customers),
      products: clone(records.products),
      prices: clone(records.prices)
    };
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
