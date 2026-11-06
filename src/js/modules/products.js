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
  const PRICE_STORAGE_KEY = 'hope_erp_prices_v2';
  const PRICE_FIXTURES = [
    ['2010-05-15', 'AK0001', 12], ['2010-05-15', 'AK0002', 8.37], ['2010-05-15', 'AK0003', 99.99],
    ['2010-05-15', 'AM0001', 36.45], ['2010-05-15', 'AM0002', 69.26], ['2010-05-15', 'AM0003', 20.43],
    ['2010-05-15', 'AM0004', 88.14], ['2010-05-15', 'AM0005', 49.27], ['2010-05-15', 'AP0001', 299.99],
    ['2010-05-15', 'AP0002', 304.48], ['2010-05-15', 'AP0003', 349.99], ['2010-05-15', 'MD0001', 119.68],
    ['2010-05-15', 'MD0002', 149.99], ['2010-05-15', 'MD0003', 239.96], ['2010-05-15', 'MD0004', 132.21],
    ['2010-05-15', 'MD0005', 825], ['2010-05-15', 'MD0006', 124.29], ['2010-05-15', 'NB0001', 300],
    ['2010-05-15', 'NB0002', 298], ['2010-05-15', 'NB0003', 199], ['2010-05-15', 'NB0004', 279],
    ['2010-05-15', 'PA0001', 219], ['2010-05-15', 'PA0002', 102.99], ['2010-07-12', 'PC0001', 454.54],
    ['2010-05-15', 'PC0001', 499.99], ['2010-07-12', 'PC0002', 197.99], ['2010-05-15', 'PC0002', 179.99],
    ['2010-05-15', 'PC0003', 390], ['2010-05-15', 'PC0004', 538], ['2010-05-15', 'PF0001', 123.75],
    ['2010-05-15', 'PF0002', 64.25], ['2010-05-15', 'PF0003', 28.87], ['2010-05-15', 'PF0004', 92.85],
    ['2010-05-15', 'PF0005', 119], ['2010-05-15', 'PF0006', 7.5], ['2010-05-15', 'PR0001', 81.72],
    ['2010-05-15', 'PR0002', 99.99], ['2010-05-15', 'PR0003', 123], ['2010-08-01', 'MD0001', 131.65],
    ['2010-08-01', 'MD0002', 164.99], ['2010-08-01', 'MD0003', 263.96], ['2010-08-01', 'MD0004', 145.43],
    ['2010-08-01', 'MD0005', 907.5], ['2010-08-01', 'MD0006', 136.72], ['2010-08-16', 'PF0001', 112.5],
    ['2010-08-16', 'PF0002', 58.41], ['2010-08-16', 'PF0003', 26.25], ['2010-08-16', 'PF0004', 84.41],
    ['2010-08-16', 'PF0005', 108.18], ['2010-08-16', 'PF0006', 6.82], ['2010-08-16', 'AM0001', 38.27],
    ['2010-08-16', 'AM0002', 72.72], ['2010-08-16', 'AM0003', 21.45], ['2010-08-16', 'AM0004', 92.55],
    ['2010-08-16', 'AM0005', 51.73], ['2010-08-16', 'AP0001', 314.99], ['2010-08-16', 'AP0002', 319.7],
    ['2010-08-16', 'AP0003', 367.49], ['2010-08-16', 'AD0001', 58], ['2010-08-16', 'AD0002', 69.99],
    ['2010-08-16', 'AD0003', 54.44], ['2010-08-16', 'AD0004', 71.99], ['2010-08-16', 'NH0001', 21.99],
    ['2010-08-16', 'NH0002', 24.99], ['2010-08-16', 'NH0003', 171.69], ['2010-12-01', 'NT0001', 412.49],
    ['2010-12-01', 'NT0002', 324.99], ['2010-12-01', 'NT0003', 287], ['2010-12-01', 'NT0004', 219.89],
    ['2010-12-01', 'NT0005', 499.99], ['2010-12-01', 'NT0006', 57.99], ['2010-12-01', 'PS0001', 3200],
    ['2010-12-01', 'PS0002', 699.99], ['2010-12-01', 'PS0003', 599.99], ['2010-12-01', 'MP0001', 199.95],
    ['2010-12-01', 'MP0002', 126.72], ['2010-12-01', 'MP0003', 425], ['2010-12-01', 'MP0004', 302],
    ['2011-02-01', 'NB0005', 1184.72]
  ];

  let memoryProducts = null;
  let memoryPrices = null;
  let productFilter = 'active';
  let priceFilter = 'active';
  let selectedProductCode = null;

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

  function getPrices() {
    if (memoryPrices) return memoryPrices;
    try {
      const stored = localStorage.getItem(PRICE_STORAGE_KEY);
      if (stored !== null) {
        const prices = JSON.parse(stored);
        if (!Array.isArray(prices)) throw new Error('Stored price history must be an array.');
        return prices;
      }

      const prices = PRICE_FIXTURES.map(function (fixture) {
        return {
          effDate: fixture[0],
          prodCode: fixture[1],
          unitPrice: fixture[2],
          isDeleted: false,
          stamp: 'CREATED system 2026-11-01 9:00 AM'
        };
      });
      localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(prices));
      return prices;
    } catch (error) {
      console.error('[Price history storage read error]', error);
      if (!memoryPrices) {
        memoryPrices = PRICE_FIXTURES.map(function (fixture) {
          return {
            effDate: fixture[0],
            prodCode: fixture[1],
            unitPrice: fixture[2],
            isDeleted: false,
            stamp: 'CREATED system 2026-11-01 9:00 AM'
          };
        });
      }
      return memoryPrices;
    }
  }

  function savePrices(prices) {
    memoryPrices = prices;
    try {
      localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(prices));
    } catch (error) {
      console.error('[Price history storage write error]', error);
    }
  }

  function priceKey(price) {
    return price.prodCode + '|' + price.effDate;
  }

  function latestPrice(productCode) {
    const today = window.todayStr();
    const price = getPrices()
      .filter(function (item) {
        return item.prodCode === productCode && !item.isDeleted && item.effDate <= today;
      })
      .sort(function (a, b) {
        return b.effDate.localeCompare(a.effDate);
      })[0];
    return price ? '$' + Number(price.unitPrice).toFixed(2) : '—';
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
    const columnCount = canSeeDeleted ? 7 : 5;
    const rows = products.length
      ? products.map(function (product) {
          const isDeleted = !!product.isDeleted;
          let actions = '—';
          if (isDeleted && canSeeDeleted) {
            actions =
              `<button type="button" class="btn-edit" onclick="window.openPriceHistory('${window.jsArg(product.prodCode)}')">Prices</button>` +
              `<button type="button" class="btn-restore" onclick="window.restoreProduct('${window.jsArg(product.prodCode)}')">Restore</button>`;
          } else if (!isDeleted) {
            actions =
              `<button type="button" class="btn-edit" onclick="window.openPriceHistory('${window.jsArg(product.prodCode)}')">Prices</button>`;
            if (window.can('products.edit')) {
              actions +=
                `<button type="button" class="btn-edit" onclick="window.openEditProduct('${window.jsArg(product.prodCode)}')">Edit</button>`;
            }
            if (window.can('products.delete')) {
              actions +=
                `<button type="button" class="btn-del" onclick="window.softDeleteProduct('${window.jsArg(product.prodCode)}')">Delete</button>`;
            }
            if (!actions) actions = '—';
          }

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
            '</td><td><strong>' +
            latestPrice(product.prodCode) +
            '</strong></td>' +
            adminColumns +
            '<td><div class="action-btns">' +
            actions +
            '</div></td>' +
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
      ? '<th>Prod Code</th><th>Description</th><th>Unit</th><th>Current Price</th><th>Status</th><th>Stamp</th><th>Actions</th>'
      : '<th>Prod Code</th><th>Description</th><th>Unit</th><th>Current Price</th><th>Actions</th>';

    area.innerHTML =
      '<div class="module-toolbar"><h3>Product Management</h3>' +
      '<div class="toolbar-right">' +
      filterTabs +
      '<input type="search" class="search-input" data-focus-key="products" aria-label="Search products" placeholder="Search products..." value="' +
      window.escapeHtml(window.productSearch) +
      '" oninput="window.productSearch=this.value;window.rerenderKeepFocus(window.renderProducts);" />' +
      (window.can('products.add')
        ? '<button type="button" class="btn btn-primary btn-sm" onclick="window.openAddProduct()">+ Add Product</button>'
        : '') +
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
  window.getPrices = getPrices;
  window.savePrices = savePrices;
  window.renderProducts = renderProducts;
  window.openAddProduct = function () {
    if (!window.can('products.add')) {
      window.alert('You do not have permission to add products.');
      return;
    }

    const form = document.getElementById('productForm');
    if (form) form.reset();
    const editCode = document.getElementById('prodEditCode');
    if (editCode) editCode.value = '';
    const productCode = document.getElementById('prodCode');
    if (productCode) productCode.readOnly = false;
    const title = document.getElementById('productModalTitle');
    if (title) title.textContent = 'Add Product';
    const subtitle = document.getElementById('productModalSub');
    if (subtitle) subtitle.textContent = 'Enter new product details';
    const saveButton = document.getElementById('productSaveBtn');
    if (saveButton) saveButton.textContent = 'Save Product';
    const error = document.getElementById('productError');
    if (error) {
      error.textContent = '';
      error.classList.remove('show');
    }
    window.openModal('product');
  };
  window.openEditProduct = function (prodCode) {
    if (!window.can('products.edit')) {
      window.alert('You do not have permission to edit products.');
      return;
    }

    const product = getProducts().find(function (item) {
      return item.prodCode === prodCode && !item.isDeleted;
    });
    if (!product) {
      window.alert('Active product not found.');
      return;
    }

    const editCode = document.getElementById('prodEditCode');
    if (editCode) editCode.value = product.prodCode;
    const productCode = document.getElementById('prodCode');
    if (productCode) {
      productCode.value = product.prodCode;
      productCode.readOnly = true;
    }
    const description = document.getElementById('prodDesc');
    if (description) description.value = product.description;
    const unit = document.getElementById('prodUnit');
    if (unit) unit.value = product.unit;
    const title = document.getElementById('productModalTitle');
    if (title) title.textContent = 'Edit Product';
    const subtitle = document.getElementById('productModalSub');
    if (subtitle) subtitle.textContent = 'Update product details';
    const saveButton = document.getElementById('productSaveBtn');
    if (saveButton) saveButton.textContent = 'Update Product';
    const error = document.getElementById('productError');
    if (error) {
      error.textContent = '';
      error.classList.remove('show');
    }
    window.openModal('product');
  };
  window.closeProductModal = function () {
    window.closeModal('product');
    const productCode = document.getElementById('prodCode');
    if (productCode) productCode.readOnly = false;
  };
  window.saveProduct = function (event) {
    if (event) event.preventDefault();

    const editCode = document.getElementById('prodEditCode');
    const productCode = document.getElementById('prodCode');
    const description = document.getElementById('prodDesc');
    const unit = document.getElementById('prodUnit');
    const error = document.getElementById('productError');
    if (!productCode || !description || !unit || !error) {
      console.error('[Product form error] Required form elements are missing.');
      return;
    }

    const isEditing = !!(editCode && editCode.value);
    const permission = isEditing ? 'products.edit' : 'products.add';
    if (!window.can(permission)) {
      error.textContent = 'You do not have permission to ' + (isEditing ? 'edit' : 'add') + ' products.';
      error.classList.add('show');
      return;
    }

    error.textContent = '';
    error.classList.remove('show');
    const prodCode = productCode.value.trim();
    const productDescription = description.value.trim();
    const productUnit = unit.value.trim();
    if (!prodCode || !productDescription || !productUnit) {
      error.textContent = 'All fields are required.';
      error.classList.add('show');
      return;
    }
    if (!/^[A-Za-z0-9._-]+$/.test(prodCode)) {
      error.textContent = 'Product Code can contain only letters, numbers, dots, dashes, and underscores.';
      error.classList.add('show');
      return;
    }

    const products = getProducts();
    if (isEditing) {
      const product = products.find(function (item) {
        return item.prodCode === editCode.value && !item.isDeleted;
      });
      if (!product) {
        error.textContent = 'Active product not found.';
        error.classList.add('show');
        return;
      }

      product.description = productDescription;
      product.unit = productUnit;
      product.stamp = makeStamp('EDITED');
    } else {
      const duplicate = products.some(function (item) {
        return valueOf(item.prodCode).toLowerCase() === prodCode.toLowerCase();
      });
      if (duplicate) {
        error.textContent = 'Product Code already exists.';
        error.classList.add('show');
        return;
      }

      products.push({
        prodCode: prodCode,
        description: productDescription,
        unit: productUnit,
        isDeleted: false,
        stamp: makeStamp('CREATED')
      });
    }

    saveProducts(products);
    window.closeProductModal();
    renderProducts();
  };
  window.softDeleteProduct = function (prodCode) {
    if (!window.can('products.delete')) {
      window.alert('You do not have permission to delete products.');
      return;
    }
    if (!window.confirm('Mark this product as inactive? Related prices stay in history.')) return;

    const products = getProducts();
    const product = products.find(function (item) {
      return item.prodCode === prodCode && !item.isDeleted;
    });
    if (!product) {
      window.alert('Active product not found.');
      return;
    }

    product.isDeleted = true;
    product.stamp = makeStamp('DELETED');
    saveProducts(products);
    renderProducts();
  };
  window.restoreProduct = function (prodCode) {
    const role = window.currentUser && window.currentUser.role;
    if (role !== 'superadmin' && role !== 'admin') {
      window.alert('Only Superadmin or Admin can restore products.');
      return;
    }

    const products = getProducts();
    const product = products.find(function (item) {
      return item.prodCode === prodCode && item.isDeleted;
    });
    if (!product) {
      window.alert('Inactive product not found.');
      return;
    }

    product.isDeleted = false;
    product.stamp = makeStamp('RESTORED');
    saveProducts(products);
    renderProducts();
  };
  window.setProductFilter = function (filter) {
    if (['active', 'deleted', 'all'].indexOf(filter) < 0) {
      console.warn('[Product filter] Invalid filter:', filter);
      return;
    }
    productFilter = filter;
    renderProducts();
  };
  window.openPriceHistory = function (prodCode) {
    const product = getProducts().find(function (item) {
      return item.prodCode === prodCode;
    });
    if (!product) {
      window.alert('Product not found.');
      return;
    }

    selectedProductCode = prodCode;
    priceFilter = 'active';
    const title = document.getElementById('priceHistoryTitle');
    const subtitle = document.getElementById('priceHistorySubtitle');
    if (title) title.textContent = 'Price History — ' + product.prodCode;
    if (subtitle) {
      subtitle.textContent = product.description + ' · Unit: ' + product.unit;
    }
    renderPriceHistory();
    window.openModal('priceHistory');
  };
  window.closePriceHistory = function () {
    selectedProductCode = null;
    window.closeModal('priceHistory');
  };
  window.setPriceFilter = function (filter) {
    if (['active', 'deleted', 'all'].indexOf(filter) < 0) {
      console.warn('[Price history filter] Invalid filter:', filter);
      return;
    }
    const role = window.currentUser && window.currentUser.role;
    if (filter !== 'active' && role !== 'superadmin' && role !== 'admin') {
      console.warn('[Price history filter] Insufficient permissions for filter:', filter);
      return;
    }
    priceFilter = filter;
    renderPriceHistory();
  };

  window.openAddPrice = function (prodCode) {
    if (!window.can('products.priceAdd')) {
      window.alert('You do not have permission to add prices.');
      return;
    }
    const product = getProducts().find(function (item) {
      return item.prodCode === prodCode && !item.isDeleted;
    });
    if (!product) {
      window.alert('Active product not found.');
      return;
    }

    const form = document.getElementById('priceForm');
    const editKey = document.getElementById('priceEditKey');
    const productCode = document.getElementById('priceProdCode');
    const effectiveDate = document.getElementById('priceEffDate');
    const unitPrice = document.getElementById('priceUnitPrice');
    const title = document.getElementById('priceModalTitle');
    const subtitle = document.getElementById('priceModalSubtitle');
    const saveButton = document.getElementById('priceSaveBtn');
    const error = document.getElementById('priceError');
    if (!form || !editKey || !productCode || !effectiveDate || !unitPrice || !title || !subtitle || !saveButton || !error) {
      console.error('[Price form error] Required form elements are missing.');
      return;
    }

    form.reset();
    editKey.value = '';
    productCode.value = prodCode;
    effectiveDate.readOnly = false;
    title.textContent = 'Add Price';
    subtitle.textContent = 'Set a new effective unit price';
    saveButton.textContent = 'Save Price';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('price');
  };

  window.openEditPrice = function (prodCode, effDate) {
    if (!window.can('products.priceEdit')) {
      window.alert('You do not have permission to edit prices.');
      return;
    }
    const price = getPrices().find(function (item) {
      return item.prodCode === prodCode && item.effDate === effDate && !item.isDeleted;
    });
    if (!price) {
      window.alert('Active price entry not found.');
      return;
    }

    const editKey = document.getElementById('priceEditKey');
    const productCode = document.getElementById('priceProdCode');
    const effectiveDate = document.getElementById('priceEffDate');
    const unitPrice = document.getElementById('priceUnitPrice');
    const title = document.getElementById('priceModalTitle');
    const subtitle = document.getElementById('priceModalSubtitle');
    const saveButton = document.getElementById('priceSaveBtn');
    const error = document.getElementById('priceError');
    if (!editKey || !productCode || !effectiveDate || !unitPrice || !title || !subtitle || !saveButton || !error) {
      console.error('[Price form error] Required form elements are missing.');
      return;
    }

    editKey.value = priceKey(price);
    productCode.value = price.prodCode;
    effectiveDate.value = price.effDate;
    effectiveDate.readOnly = true;
    unitPrice.value = price.unitPrice;
    title.textContent = 'Edit Price';
    subtitle.textContent = 'Update unit price';
    saveButton.textContent = 'Update Price';
    error.textContent = '';
    error.classList.remove('show');
    window.openModal('price');
  };

  window.closePriceModal = function () {
    window.closeModal('price');
  };

  window.savePrice = function (event) {
    if (event) event.preventDefault();

    const editKey = document.getElementById('priceEditKey');
    const productCode = document.getElementById('priceProdCode');
    const effectiveDate = document.getElementById('priceEffDate');
    const unitPriceInput = document.getElementById('priceUnitPrice');
    const error = document.getElementById('priceError');
    if (!editKey || !productCode || !effectiveDate || !unitPriceInput || !error) {
      console.error('[Price form error] Required form elements are missing.');
      return;
    }

    const isEditing = !!editKey.value;
    const permission = isEditing ? 'products.priceEdit' : 'products.priceAdd';
    if (!window.can(permission)) {
      error.textContent = 'You do not have permission to ' + (isEditing ? 'edit' : 'add') + ' prices.';
      error.classList.add('show');
      return;
    }

    error.textContent = '';
    error.classList.remove('show');
    const prodCode = productCode.value.trim();
    const effDate = effectiveDate.value;
    const unitPrice = Number(unitPriceInput.value);
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(effDate)
      ? new Date(effDate + 'T00:00:00.000Z')
      : null;
    const validDate = parsedDate !== null &&
      !Number.isNaN(parsedDate.getTime()) &&
      parsedDate.toISOString().slice(0, 10) === effDate;
    const product = getProducts().find(function (item) {
      return item.prodCode === prodCode && (isEditing || !item.isDeleted);
    });
    if (!product || !validDate || unitPriceInput.value === '' || !Number.isFinite(unitPrice) || unitPrice < 0) {
      error.textContent = 'All fields are required. Price must be 0 or greater.';
      error.classList.add('show');
      return;
    }

    const prices = getPrices();
    if (isEditing) {
      const price = prices.find(function (item) {
        return priceKey(item) === editKey.value && !item.isDeleted;
      });
      if (!price) {
        error.textContent = 'Active price entry not found.';
        error.classList.add('show');
        return;
      }
      price.unitPrice = unitPrice;
      price.stamp = makeStamp('EDITED');
    } else {
      const duplicate = prices.some(function (item) {
        return item.prodCode === prodCode && item.effDate === effDate && !item.isDeleted;
      });
      if (duplicate) {
        error.textContent = 'A price for this product and effective date already exists.';
        error.classList.add('show');
        return;
      }
      prices.push({
        effDate: effDate,
        prodCode: prodCode,
        unitPrice: unitPrice,
        isDeleted: false,
        stamp: makeStamp('CREATED')
      });
    }

    savePrices(prices);
    window.closePriceModal();
    selectedProductCode = prodCode;
    renderPriceHistory();
    renderProducts();
  };

  window.softDeletePrice = function (prodCode, effDate) {
    if (!window.can('products.priceDelete')) {
      window.alert('You do not have permission to delete prices.');
      return;
    }
    if (!window.confirm('Mark this price entry as inactive?')) return;

    const price = getPrices().find(function (item) {
      return item.prodCode === prodCode && item.effDate === effDate && !item.isDeleted;
    });
    if (!price) {
      window.alert('Active price entry not found.');
      return;
    }
    price.isDeleted = true;
    price.stamp = makeStamp('DELETED');
    savePrices(getPrices());
    renderPriceHistory();
    renderProducts();
  };

  window.restorePrice = function (prodCode, effDate) {
    const role = window.currentUser && window.currentUser.role;
    if (role !== 'superadmin' && role !== 'admin') {
      window.alert('Only Superadmin or Admin can restore prices.');
      return;
    }

    const prices = getPrices();
    const price = prices.find(function (item) {
      return item.prodCode === prodCode && item.effDate === effDate && item.isDeleted;
    });
    if (!price) {
      window.alert('Inactive price entry not found.');
      return;
    }
    const duplicate = prices.some(function (item) {
      return item.prodCode === prodCode && item.effDate === effDate && !item.isDeleted;
    });
    if (duplicate) {
      window.alert('Cannot restore: an active price for this product and date already exists.');
      return;
    }

    price.isDeleted = false;
    price.stamp = makeStamp('RESTORED');
    savePrices(prices);
    renderPriceHistory();
    renderProducts();
  };

  function renderPriceHistory() {
    if (!selectedProductCode) return;
    const role = window.currentUser && window.currentUser.role;
    const canSeeDeleted = role === 'superadmin' || role === 'admin';
    let prices = getPrices().filter(function (price) {
      return price.prodCode === selectedProductCode;
    });
    if (!canSeeDeleted) {
      prices = prices.filter(function (price) {
        return !price.isDeleted;
      });
    } else if (priceFilter === 'active') {
      prices = prices.filter(function (price) {
        return !price.isDeleted;
      });
    } else if (priceFilter === 'deleted') {
      prices = prices.filter(function (price) {
        return price.isDeleted;
      });
    }
    prices.sort(function (a, b) {
      return b.effDate.localeCompare(a.effDate);
    });

    const tableHead = document.getElementById('priceHistoryHead');
    const tableBody = document.getElementById('priceHistoryBody');
    const toolbar = document.getElementById('priceHistoryToolbar');
    if (!tableHead || !tableBody || !toolbar) {
      console.error('[Price history render error] Required modal elements are missing.');
      return;
    }

    const canEdit = window.can('products.priceEdit');
    const canDelete = window.can('products.priceDelete');
    const canRestore = canSeeDeleted;
    const columnCount = canSeeDeleted ? 5 : 3;
    tableHead.innerHTML = canSeeDeleted
      ? '<th>Effective Date</th><th>Unit Price</th><th>Status</th><th>Stamp</th><th>Actions</th>'
      : '<th>Effective Date</th><th>Unit Price</th><th>Actions</th>';
    toolbar.innerHTML = canSeeDeleted
      ? '<div class="filter-tabs" role="group" aria-label="Filter price history">' +
        '<button type="button" class="filter-tab' +
        (priceFilter === 'active' ? ' active' : '') +
        '" onclick="window.setPriceFilter(&quot;active&quot;)">Active</button>' +
        '<button type="button" class="filter-tab' +
        (priceFilter === 'deleted' ? ' active' : '') +
        '" onclick="window.setPriceFilter(&quot;deleted&quot;)">Inactive</button>' +
        '<button type="button" class="filter-tab' +
        (priceFilter === 'all' ? ' active' : '') +
        '" onclick="window.setPriceFilter(&quot;all&quot;)">All</button></div>'
      : '';
    const product = getProducts().find(function (item) {
      return item.prodCode === selectedProductCode;
    });
    if (product && !product.isDeleted && window.can('products.priceAdd')) {
      toolbar.innerHTML += '<button type="button" class="btn btn-primary btn-sm" onclick="window.openAddPrice(&#39;' +
        window.jsArg(selectedProductCode) +
        '&#39;)">+ Add Price</button>';
    }
    tableBody.innerHTML = prices.length
      ? prices.map(function (price) {
          let actions = '—';
          if (price.isDeleted) {
            if (canRestore) {
              actions = '<button type="button" class="btn-restore" onclick="window.restorePrice(&#39;' +
                window.jsArg(price.prodCode) +
                '&#39;,&#39;' +
                window.jsArg(price.effDate) +
                '&#39;)">Restore</button>';
            }
          } else {
            actions = '';
            if (canEdit) {
              actions += '<button type="button" class="btn-edit" onclick="window.openEditPrice(&#39;' +
                window.jsArg(price.prodCode) +
                '&#39;,&#39;' +
                window.jsArg(price.effDate) +
                '&#39;)">Edit</button>';
            }
            if (canDelete) {
              actions += '<button type="button" class="btn-del" onclick="window.softDeletePrice(&#39;' +
                window.jsArg(price.prodCode) +
                '&#39;,&#39;' +
                window.jsArg(price.effDate) +
                '&#39;)">Delete</button>';
            }
            if (!actions) actions = '—';
          }
          return '<tr' +
            (price.isDeleted ? ' class="deleted-row"' : '') +
            '><td>' +
            window.escapeHtml(price.effDate) +
            '</td><td><strong>$' +
            Number(price.unitPrice).toFixed(2) +
            '</strong></td>' +
            (canSeeDeleted
              ? '<td><span class="badge ' +
                (price.isDeleted ? 'badge-deleted">Inactive' : 'badge-active">Active') +
                '</span></td><td><div class="product-stamp">' +
                window.escapeHtml(price.stamp || '—') +
                '</div></td>'
              : '') +
            '<td><div class="action-btns">' +
            actions +
            '</div></td>' +
            '</tr>';
        }).join('')
      : '<tr><td colspan="' +
        columnCount +
        '"><div class="empty-state">No price history for this product.</div></td></tr>';
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (document.getElementById('priceModal').classList.contains('active')) {
      window.closePriceModal();
    } else if (document.getElementById('priceHistoryModal').classList.contains('active')) {
      window.closePriceHistory();
    }
  });
})();
