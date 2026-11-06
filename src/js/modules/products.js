(function () {
  'use strict';

  const STORAGE_KEY = 'hope_erp_products_v2';
  const DEFAULT_PRODUCTS = [
    { prodCode: 'AD0001', description: 'Toshiba Canvio 1 TB', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AD0002', description: 'WD Ultra 1TB', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AD0003', description: 'Seagate Bracuda 1TB', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AD0004', description: 'Transcend 1 TB', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AK0001', description: 'HP Pavilion DV6000', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AK0002', description: 'Micro Innovations Kb', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AK0003', description: 'Steel APEX GAMING KB', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AM0001', description: 'MS Wireless Mouse', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AM0002', description: 'LOGITECH 910-002696', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AM0003', description: 'IMICRO KB-IM8911U', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AM0004', description: 'STEEL Rival Mouse', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AM0005', description: 'Logitech M500 USB', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AP0001', description: 'HDMI Pocket Proj', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AP0002', description: 'InFocus IN112 Proj', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'AP0003', description: 'ViewSonic Projector', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MD0001', description: 'ASUS VS228H-P 22-In', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MD0002', description: 'ViewSonic VA2446M', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MD0003', description: 'Dell UltrShrp U2412M', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MD0004', description: 'Acer S231HL BBID 23', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MD0005', description: 'Apple Dsplay MC914', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MD0006', description: 'Asus VE228H 21.5', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MP0001', description: 'Apple iPhone 4 16GB', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MP0002', description: 'Apple iPhone 3G', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MP0003', description: 'SAMSUNG GALAXY S4', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'MP0004', description: 'SAMSUNG GALAXY S3', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NB0001', description: 'Dell Inspiron Laptop', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NB0002', description: 'ASUS Tformer Book', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NB0003', description: 'Acer C720 Chrome', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NB0004', description: 'HP Chromebook 11', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NB0005', description: 'Apple Mac Pro Laptop', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NH0001', description: 'NETGEAR ProSAFE 5-Port', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NH0002', description: 'TP-LINK  1000Mbps', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NH0003', description: 'Cisco 24-P G Switch', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NT0001', description: 'Apple iPad Retna 16G', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NT0002', description: 'Apple iPad 2 MC769LL', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NT0003', description: 'Apple iPad Mini', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NT0004', description: 'Samsung Galaxy Tab3', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NT0005', description: 'Samsung Glaxy Tab32G', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'NT0006', description: 'DrgonTouch 7B 2Core', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PA0001', description: 'MS Ofc Business 2013', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PA0002', description: 'Office Mac Home 2011', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PC0001', description: 'CyberpowerPC Gamer', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PC0002', description: 'Dell 745 Opti Desk', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PC0003', description: 'Dell Inspiron Desk', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PC0004', description: 'Dell Inspiron 660', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PF0001', description: 'Win7 Pro SP1 64bit', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PF0002', description: 'Win7 Home Pre SP1 64', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PF0003', description: 'Mac OS X ver 10.6.3', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PF0004', description: 'Windows 8.1 64-Bit', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PF0005', description: 'Windows 8 Pro', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PF0006', description: 'RED HAT Prof Edition', unit: 'ea', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PR0001', description: 'Epson Expression', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PR0002', description: 'Canon PIXMA MX922', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PR0003', description: 'HP Envy 4500 Wireles', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PS0001', description: 'VirServ 12Core 128GB', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PS0002', description: 'Ms WinServer 2012', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { prodCode: 'PS0003', description: 'Cisco Virt Hardware', unit: 'pc', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' }
  ];

  let memoryProducts = null;
  let productFilter = 'active';

  function cloneDefaultProducts() {
    return DEFAULT_PRODUCTS.map(function (product) {
      return Object.assign({}, product);
    });
  }

  function getProducts() {
    if (memoryProducts) return memoryProducts;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const products = JSON.parse(stored);
        if (!Array.isArray(products)) {
          throw new Error('Stored product data must be an array.');
        }
        return products;
      }

      const products = cloneDefaultProducts();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return products;
    } catch (error) {
      console.error('[Product storage read error]', error);
      if (!memoryProducts) memoryProducts = cloneDefaultProducts();
      return memoryProducts;
    }
  }

  function saveProducts(products) {
    memoryProducts = products;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('[Product storage write error]', error);
    }
  }

  function valueOf(value) {
    return String(value == null ? '' : value);
  }

  function renderProducts() {
    const area = document.getElementById('contentArea');
    if (!area) return;

    if (!window.currentUser || !window.canModule('products')) {
      area.innerHTML = '<div class="empty-state">Access denied.</div>';
      return;
    }

    const canSeeDeleted =
      window.currentUser.role === 'superadmin' || window.currentUser.role === 'admin';
    const allProducts = getProducts();
    let products = allProducts;

    if (!canSeeDeleted) {
      products = products.filter(function (product) {
        return !product.isDeleted;
      });
    } else if (productFilter === 'active') {
      products = products.filter(function (product) {
        return !product.isDeleted;
      });
    } else if (productFilter === 'deleted') {
      products = products.filter(function (product) {
        return product.isDeleted;
      });
    }

    const query = window.productSearch.trim().toLowerCase();
    if (query) {
      products = products.filter(function (product) {
        return ['prodCode', 'description', 'unit'].some(function (key) {
          return valueOf(product[key]).toLowerCase().includes(query);
        });
      });
    }

    const activeCount = allProducts.filter(function (product) {
      return !product.isDeleted;
    }).length;
    const inactiveCount = allProducts.length - activeCount;
    const columnCount = canSeeDeleted ? 5 : 3;
    const rows = products.length
      ? products.map(function (product) {
          const isDeleted = !!product.isDeleted;
          const adminColumns = canSeeDeleted
            ? '<td><span class="badge ' +
              (isDeleted ? 'badge-deleted">Inactive' : 'badge-active">Active') +
              '</span></td><td><div class="product-stamp">' +
              window.escapeHtml(product.stamp || '—') +
              '</div></td>'
            : '';

          return (
            '<tr' +
            (isDeleted ? ' class="deleted-row"' : '') +
            '><td><strong>' +
            window.escapeHtml(product.prodCode) +
            '</strong></td><td>' +
            window.escapeHtml(product.description) +
            '</td><td>' +
            window.escapeHtml(product.unit) +
            '</td>' +
            adminColumns +
            '</tr>'
          );
        }).join('')
      : '<tr><td colspan="' +
        columnCount +
        '"><div class="empty-state">No products found.</div></td></tr>';

    const filterTabs = canSeeDeleted
      ? '<div class="filter-tabs" role="group" aria-label="Filter products">' +
        '<button type="button" class="filter-tab' +
        (productFilter === 'active' ? ' active' : '') +
        '" onclick="window.setProductFilter(\'active\')">Active (' +
        activeCount +
        ')</button><button type="button" class="filter-tab' +
        (productFilter === 'deleted' ? ' active' : '') +
        '" onclick="window.setProductFilter(\'deleted\')">Inactive (' +
        inactiveCount +
        ')</button><button type="button" class="filter-tab' +
        (productFilter === 'all' ? ' active' : '') +
        '" onclick="window.setProductFilter(\'all\')">All (' +
        allProducts.length +
        ')</button></div>'
      : '';
    const headings = canSeeDeleted
      ? '<th>Prod Code</th><th>Description</th><th>Unit</th><th>Status</th><th>Stamp</th>'
      : '<th>Prod Code</th><th>Description</th><th>Unit</th>';

    area.innerHTML =
      '<div class="module-toolbar"><h3>Product Management</h3>' +
      '<div class="toolbar-right">' +
      filterTabs +
      '<input type="search" class="search-input" data-focus-key="products" aria-label="Search products" placeholder="Search products..." value="' +
      window.escapeHtml(window.productSearch) +
      '" oninput="window.productSearch=this.value;window.rerenderKeepFocus(window.renderProducts);" />' +
      '</div></div><div class="data-table-wrap"><table class="data-table">' +
      '<thead><tr>' +
      headings +
      '</tr></thead><tbody>' +
      rows +
      '</tbody></table></div>';
  }

  window.productSearch = '';
  window.getProducts = getProducts;
  window.saveProducts = saveProducts;
  window.renderProducts = renderProducts;
  window.setProductFilter = function (filter) {
    if (['active', 'deleted', 'all'].indexOf(filter) < 0) {
      console.warn('[Product filter] Invalid filter:', filter);
      return;
    }
    productFilter = filter;
    renderProducts();
  };
})();
