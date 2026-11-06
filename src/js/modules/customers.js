(function () {
  'use strict';

  const STORAGE_KEY = 'hope_erp_customers_v3';
  const DEFAULT_CUSTOMERS = [
    { custNo: 'C0001', custName: 'Globus Medical, Inc', address: '2560 Gen Armistead Ave Audubon CA 94031', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0002', custName: 'RF Industries, Inc', address: '7610 Miramar Rd San Diego, CA 92602', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0003', custName: 'Trisha Macdowell', address: '7642 Clairemont Mesa Blvd San Diego CA 90321', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0004', custName: 'HMS Holdings, Inc', address: '1000 So Fremont Ave, Suite 225 Alhambra CA 91303', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0005', custName: 'Christian Andersen', address: '1120 Lincoln St Suite 809 Sacramento CA 95815', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0006', custName: 'Astronics, Inc', address: '2 Orion Aliso Viejo, CA 92656', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0007', custName: 'Morgan Alegore', address: '2 Goodyear Irvine, CA 92618', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0008', custName: 'Abaxis, Inc', address: '3240 Whipple Rd, Union City, CA 94587', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0009', custName: 'Landec Corp.', address: '3603 Haven Avenue Menlo Park, CA 94025', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0010', custName: 'SMP Corp.', address: '3718 Northern Long Island NY 12528', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0011', custName: 'B&G Foods', address: '4 Gatehall Dr., Ste. 110 Parsippany, NJ 07054', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0012', custName: 'Dexter Santos', address: '2739 Rebeiro Ave, Santa Clara, CA 95051', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0013', custName: 'Health Stream', address: '209 10th Ave, South Suite 450 Nashville Tennessee', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0014', custName: 'InSync Training LLC', address: 'P.O. Box 3122 Roanoke, VA 24015', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0015', custName: 'Bespoke Education', address: '8205 Santa Monica Blvd, Suite 365 W HWood CA 90046', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0016', custName: 'Peri Solutions', address: '2880 Zanker Road San Jose CA 95101', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0017', custName: 'Janet Lim', address: '800 N. State College Blvd. Fullerton, CA 92831', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0018', custName: 'Nicole Hutchison', address: '200 Lincoln Ave, Salinas, CA 93901', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0019', custName: 'Brandon Drucker', address: '65 West Alisal St., # 101, Salinas, CA 93901', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0020', custName: 'Eugene Whitaker', address: '45 Fremont Street, Suite 2000 San Frans, CA 9410', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0021', custName: 'Touch Suite', address: '1081 Holland Dr. Boca Raton, FL 33487', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0022', custName: 'CallFire', address: '1410 2nd St., Suite 200 Santa Monica, CA 90401', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0023', custName: 'ISBX Corp', address: '3415 S. Sepulveda Blvd. 1250 Los Angeles, CA 90034', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0024', custName: 'Factual', address: '1999 Avenue of the Stars Los Angeles, CA 90067', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0025', custName: 'Predixion', address: '31910 Del Obispo San Juan Capistrano, CA 92675', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0026', custName: 'Datapop', address: '5762 W Jefferson Blvd, Los Angeles, CA 90016', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0027', custName: 'SA Photonics, Inc', address: '130 Knowles Dr, Los Gatos, CA 95032', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0028', custName: 'Acumen Bldg Entp', address: '7770 Pardee Lane, Ste. 200 Oakland, CA 94621', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0029', custName: 'IMCorp', address: '50 Utopia Road Manchester, CT 06042', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0030', custName: 'Brady and Assoc.', address: '3710 Ruffin Rd, San Diego, CA 90401', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0031', custName: 'Yello Hammer LLC', address: '111 W 28th St, New York, NY 10001', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0032', custName: 'Conductor', address: '2 Park Ave, New York, NY 10016', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0033', custName: 'Quantum Networks', address: '323 West 39th Street 11th Flr NY 10018', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0034', custName: 'Refinery29', address: '225 Broadway NY 10007', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0035', custName: 'Gravity Media', address: '104 W 27th St #11d NY 10001', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0036', custName: 'Regal wings', address: '244 Fifth Avenue, Suite 200 New York, NY 10001', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0037', custName: '33Across', address: '229 W 28th St, New York, NY 10001', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0038', custName: 'RCS Capital', address: '405 Park Avenue New York, NY 1002', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0039', custName: 'OnDeck', address: '1400 Broadway, 25th Floor, New York, NY 10001', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0040', custName: 'Optimatic Media, Inc', address: '54 West 40th St., 7th Floor, New York, NY 10018', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0041', custName: 'James Underwood', address: '450 West 33rd Street New York, NY 10018', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0042', custName: 'Charles Silverstone', address: '1335 Ave of the Americas, New York, NY 10019', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0043', custName: 'Nea Sanchez', address: '371 7th Ave, New York, NY 10001', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0044', custName: 'Tracy Lambert', address: '234 W 42nd St, New York, NY 10036', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0045', custName: 'Peter Charlestone', address: '342 W 40th St, New York, NY 10018', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0046', custName: 'Oxford Academy', address: '5172 Orange Ave, Cypress, CA 90630', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0047', custName: 'Whitney High Sch', address: '16800 Shoemaker Ave, Cerritos, CA 90703', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0048', custName: 'Pacfic Collegiate', address: '255 Swift St, Santa Cruz, CA 95060', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0049', custName: 'KIPP San Jose', address: '1790 Educational Park Dr, San Jose, CA 95133', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0050', custName: 'The Preuss School', address: '9500 Gilman Dr Mc 0536, La Jolla, CA 92093', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0051', custName: 'American Indian Sch', address: '3637 Magee Ave, Oakland, CA 94619', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0052', custName: 'Lowell High School', address: '1101 Eucalyptus Dr, San Francisco, CA 94132', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0053', custName: 'University HSchool', address: '2611 East Matoian M/S Uh134, Fresno, CA 93740', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0054', custName: 'Hawthorne Academy', address: '4467 West Broadway, Hawthorne, CA 90250', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0055', custName: 'Lennox Academy', address: '11036 Hawthorne Blvd, Lennox, CA 90304', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0056', custName: 'Manhasset School', address: '200 Memorial Place Manhasset, NY 11030', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0057', custName: 'Pittsford High Sch', address: '55 Sutherland St Pittsford, NY 14534', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0058', custName: 'Jericho High School', address: '99 Cedar Swamp Rd, Jericho, NY 11753', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0059', custName: 'Stuyvesant High', address: '345 Chambers St, New York, NY 10282', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0060', custName: 'Rye High School', address: 'Parsons St, Rye, NY 10580', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0061', custName: 'Brooklyn High', address: '29 Ft Greene Place, Brooklyn, NY 11217', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0062', custName: 'Brooklyn Latin Sch', address: '325 Bushwick Ave, Brooklyn, NY 11206', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0063', custName: 'Bronx Science High', address: '75 West 205Th St Bronx, NY 10468', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0064', custName: 'Staten Island High', address: '485 Clawson St, Staten Island, NY 10306', payterms: 'Net 30', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0065', custName: 'Yonkers Middle High', address: '150 Rockland Ave, Yonkers, NY 10705', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0066', custName: 'Helen Strong', address: '800 S Main St Tulelake, CA 96134', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0067', custName: 'Gay Rose Silva', address: '575 3rd St Napa, CA 94559', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0068', custName: 'William Pichler', address: '1121 L St #407 Sacramento, CA 95814', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0069', custName: 'Terrance Nitz', address: '23200 Pacific Coast Hwy Malibu, CA 90265', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0070', custName: 'Errol Atanacio', address: '300 Capitol Mall #555 Sacramento, CA 95814', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0071', custName: 'Chuck Jones', address: '163 W 125th St New York, NY 10027', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0072', custName: 'Menchu Palmores', address: '600 College Ave Montour Falls, NY 14865', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0073', custName: 'Princess Ann White', address: '109 S Union St #411 Rochester, NY 14607', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0074', custName: 'Florence Black', address: '450 S Salina St Syracuse, NY 13202', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0075', custName: 'Jeremy Irons', address: '3357 US Highway 9w Highland, NY 12528', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0076', custName: 'Braddy Banks', address: '1424 Fulton St Brooklyn, NY 11216', payterms: 'COD', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0077', custName: 'Office NY Tech Serv', address: 'State Capitol Empire State Plaza NY 10027', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0078', custName: 'FDA New York', address: '158-15 Liberty Ave., Jamaica, NY 12528', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0079', custName: 'Social Sec Admn NY', address: '123 William St, New York, NY 10038', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0080', custName: 'Social Sec Admn CA', address: '3836 Wilshire Blvd, Los Angeles, CA 90010', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0081', custName: 'Dept Food and Agri', address: '220 N Street Sacramento, CA 95814', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' },
    { custNo: 'C0082', custName: 'California Dept Tech', address: '1325 J St Suite 1600 Sacramento CA 95814', payterms: 'Net 45', isDeleted: false, stamp: 'CREATED system 2026-11-01 9:00 AM' }
  ];

  let memoryCustomers = null;
  let customerFilter = 'active';

  function cloneDefaultCustomers() {
    return DEFAULT_CUSTOMERS.map(function (customer) {
      return Object.assign({}, customer);
    });
  }

  function getCustomers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const customers = JSON.parse(stored);
        if (!Array.isArray(customers)) {
          throw new Error('Stored customer data must be an array.');
        }
        return customers;
      }

      const customers = cloneDefaultCustomers();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      return customers;
    } catch (error) {
      console.error('[Customer storage read error]', error);
      if (!memoryCustomers) memoryCustomers = cloneDefaultCustomers();
      return memoryCustomers;
    }
  }

  function saveCustomers(customers) {
    memoryCustomers = customers;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (error) {
      console.error('[Customer storage write error]', error);
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

  function text(value) {
    return String(value == null ? '' : value);
  }

  function renderCustomers() {
    const area = document.getElementById('contentArea');
    if (!area) return;

    if (!window.currentUser || !window.canModule('customers')) {
      area.innerHTML = '<div class="empty-state">Access denied.</div>';
      return;
    }

    const role = window.currentUser.role;
    const canRestore = role === 'superadmin' || role === 'admin';
    const allCustomers = getCustomers();
    let customers = allCustomers;

    if (!canRestore) {
      customers = customers.filter(function (customer) {
        return !customer.isDeleted;
      });
    } else if (customerFilter === 'active') {
      customers = customers.filter(function (customer) {
        return !customer.isDeleted;
      });
    } else if (customerFilter === 'deleted') {
      customers = customers.filter(function (customer) {
        return customer.isDeleted;
      });
    }

    const query = window.customerSearch.trim().toLowerCase();
    if (query) {
      customers = customers.filter(function (customer) {
        return ['custNo', 'custName', 'address', 'payterms'].some(function (key) {
          return text(customer[key]).toLowerCase().includes(query);
        });
      });
    }

    const activeCount = allCustomers.filter(function (customer) {
      return !customer.isDeleted;
    }).length;
    const deletedCount = allCustomers.length - activeCount;
    const columnCount = canRestore ? 7 : 5;
    const rows = customers.length
      ? customers.map(function (customer) {
          const isDeleted = !!customer.isDeleted;
          let actions = '—';

          if (isDeleted && canRestore) {
            actions =
              `<button type="button" class="btn-restore" onclick="window.restoreCustomer('${window.jsArg(customer.custNo)}')">Restore</button>`;
          } else if (!isDeleted && window.can('customers.delete')) {
            actions =
              `<button type="button" class="btn-del" onclick="window.softDeleteCustomer('${window.jsArg(customer.custNo)}')">Delete</button>`;
          }

          const adminColumns = canRestore
            ? '<td><span class="badge ' +
              (isDeleted ? 'badge-deleted">Inactive' : 'badge-active">Active') +
              '</span></td><td><div class="stamp-text">' +
              window.escapeHtml(customer.stamp || '—') +
              '</div></td>'
            : '';

          return (
            '<tr' +
            (isDeleted ? ' class="deleted-row"' : '') +
            '><td><strong>' +
            window.escapeHtml(customer.custNo) +
            '</strong></td><td>' +
            window.escapeHtml(customer.custName) +
            '</td><td>' +
            window.escapeHtml(customer.address) +
            '</td><td>' +
            window.escapeHtml(customer.payterms) +
            '</td>' +
            adminColumns +
            '<td><div class="action-btns">' +
            actions +
            '</div></td></tr>'
          );
        }).join('')
      : '<tr><td colspan="' +
        columnCount +
        '"><div class="empty-state">No customers found.</div></td></tr>';

    const filterTabs = canRestore
      ? `<div class="filter-tabs" role="group" aria-label="Filter customers">
          <button type="button" class="filter-tab${customerFilter === 'active' ? ' active' : ''}" onclick="window.setCustomerFilter('active')">Active (${activeCount})</button>
          <button type="button" class="filter-tab${customerFilter === 'deleted' ? ' active' : ''}" onclick="window.setCustomerFilter('deleted')">Inactive (${deletedCount})</button>
          <button type="button" class="filter-tab${customerFilter === 'all' ? ' active' : ''}" onclick="window.setCustomerFilter('all')">All (${allCustomers.length})</button>
        </div>`
      : '';
    const headings = canRestore
      ? '<th>Cust No</th><th>Customer Name</th><th>Address</th><th>Pay Terms</th><th>Status</th><th>Stamp</th><th>Actions</th>'
      : '<th>Cust No</th><th>Customer Name</th><th>Address</th><th>Pay Terms</th><th>Actions</th>';

    area.innerHTML =
      '<div class="module-toolbar"><h3>Customer Management</h3>' +
      '<div class="toolbar-right">' +
      filterTabs +
      '<input type="search" class="search-input" data-focus-key="customers" aria-label="Search customers" placeholder="Search customers..." value="' +
      window.escapeHtml(window.customerSearch) +
      '" oninput="window.customerSearch=this.value;window.rerenderKeepFocus(window.renderCustomers);" />' +
      '</div></div><div class="data-table-wrap"><table class="data-table">' +
      '<thead><tr>' +
      headings +
      '</tr></thead><tbody>' +
      rows +
      '</tbody></table></div>';
  }

  window.customerSearch = '';
  window.getCustomers = getCustomers;
  window.saveCustomers = saveCustomers;
  window.renderCustomers = renderCustomers;
  window.setCustomerFilter = function (filter) {
    if (['active', 'deleted', 'all'].indexOf(filter) < 0) {
      console.warn('[Customer filter] Invalid filter:', filter);
      return;
    }
    customerFilter = filter;
    renderCustomers();
  };
  window.softDeleteCustomer = function (custNo) {
    if (!window.currentUser || !window.can('customers.delete')) {
      window.alert('You do not have permission to delete customers.');
      return;
    }
    if (!window.confirm('Mark this customer as inactive? It can be restored later by an Admin.')) return;

    const customers = getCustomers();
    const customer = customers.find(function (item) {
      return item.custNo === custNo;
    });
    if (!customer) {
      window.alert('Customer not found.');
      return;
    }

    customer.isDeleted = true;
    customer.stamp = makeStamp('DELETED');
    saveCustomers(customers);
    renderCustomers();
  };
  window.restoreCustomer = function (custNo) {
    const role = window.currentUser && window.currentUser.role;
    if (role !== 'superadmin' && role !== 'admin') {
      window.alert('Only Superadmin or Admin can restore customers.');
      return;
    }

    const customers = getCustomers();
    const customer = customers.find(function (item) {
      return item.custNo === custNo;
    });
    if (!customer) {
      window.alert('Customer not found.');
      return;
    }

    customer.isDeleted = false;
    customer.stamp = makeStamp('RESTORED');
    saveCustomers(customers);
    renderCustomers();
  };
})();