// ============================================================
// 1. AUTH CHECK
// ============================================================
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// ============================================================
// 2. DATA DUMMY
// ============================================================
const categories = ['Pendapatan', 'Operasional', 'Gaji', 'Marketing', 'Lainnya'];
const statuses = ['Sukses', 'Pending', 'Gagal'];
const descriptions = [
    'Penjualan Produk A', 'Pembelian Bahan Baku', 'Gaji Karyawan Bulanan',
    'Iklan Google Ads', 'Sewa Kantor Bulanan', 'Biaya Listrik & Air',
    'Penjualan Produk B', 'Biaya Transportasi Logistik', 'Gaji Freelance Designer',
    'Iklan Facebook Ads', 'Biaya Internet & Telepon', 'Penjualan Produk C',
    'Biaya Maintenance Server', 'THR Karyawan', 'Iklan Instagram',
    'Penjualan Produk D', 'Biaya Legal & Perizinan', 'Bonus Karyawan',
    'Email Marketing Campaign', 'Penjualan Produk E', 'Biaya Asuransi',
    'Sponsorship Event', 'Penjualan Produk F', 'Biaya Training Karyawan',
    'Affiliate Marketing', 'Penjualan Produk G', 'Biaya Cloud Server',
    'Refund Customer', 'Penjualan Produk H', 'Biaya Konsultan Pajak'
];

function generateData(count) {
    const data = [];
    for (let i = 1; i <= count; i++) {
        const day = String(Math.floor(Math.random() * 21) + 1).padStart(2, '0');
        const tanggal = '2026-05-' + day;
        const deskripsi = descriptions[Math.floor(Math.random() * descriptions.length)];
        const kategori = categories[Math.floor(Math.random() * categories.length)];
        const jumlah = Math.floor(Math.random() * 50000000) + 10000;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        data.push({ id: i, tanggal, deskripsi, kategori, jumlah, status });
    }
    data.sort((a, b) => b.id - a.id);
    return data;
}

const chartLabels = ['15 Mei', '16 Mei', '17 Mei', '18 Mei', '19 Mei', '20 Mei', '21 Mei'];
const chartPendapatan = [12.5, 18.3, 15.7, 22.1, 19.8, 25.4, 20.2];
const chartPengeluaran = [8.2, 10.5, 7.8, 12.3, 9.5, 11.8, 8.9];

// ============================================================
// 3. DARK MODE
// ============================================================
const body = document.body;
const darkSwitch = document.getElementById('darkModeSwitch');
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    darkSwitch.checked = true;
}
darkSwitch.addEventListener('change', function () {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    if (typeof lineChartInstance !== 'undefined') {
        lineChartInstance.destroy();
        barChartInstance.destroy();
        initCharts();
    }
});

// ============================================================
// 4. SIDEBAR TOGGLE
// ============================================================
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');

function toggleSidebar() {
    if (window.innerWidth < 768) {
        sidebar.classList.toggle('show');
        sidebarBackdrop.classList.toggle('show');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

sidebarToggle.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', toggleSidebar);
sidebarBackdrop.addEventListener('click', toggleSidebar);

window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) {
        sidebar.classList.remove('show');
        sidebarBackdrop.classList.remove('show');
    }
});

// ============================================================
// 5. NOTIF & PROFILE DROPDOWN
// ============================================================
document.getElementById('notifBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('notifMenu').classList.toggle('show');
    document.getElementById('profileMenu').classList.remove('show');
});
document.getElementById('profileBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('profileMenu').classList.toggle('show');
    document.getElementById('notifMenu').classList.remove('show');
});
document.addEventListener('click', function () {
    document.getElementById('notifMenu').classList.remove('show');
    document.getElementById('profileMenu').classList.remove('show');
});
document.getElementById('markAllRead').addEventListener('click', function () {
    document.querySelector('.notif-badge').textContent = '0';
    document.querySelector('.notif-badge').style.display = 'none';
});

// ============================================================
// 6. LOGOUT
// ============================================================
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
});

// ============================================================
// 7. COUNTER ANIMATION
// ============================================================
function animateValue(el, start, end, duration, prefix = 'Rp ', suffix = '') {
    let startTime = null;
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        el.textContent = prefix + current.toLocaleString('id-ID') + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ============================================================
// 8. CHARTS
// ============================================================
let lineChartInstance, barChartInstance;

function getChartColors() {
    const isDark = body.classList.contains('dark-mode');
    return {
        grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        tick: isDark ? '#9a9a9a' : '#888',
        border: isDark ? '#333' : '#ddd'
    };
}

function initCharts() {
    const colors = getChartColors();

    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const greenGrad = lineCtx.createLinearGradient(0, 0, 0, 250);
    greenGrad.addColorStop(0, 'rgba(40, 167, 69, 0.4)');
    greenGrad.addColorStop(1, 'rgba(40, 167, 69, 0.01)');
    const redGrad = lineCtx.createLinearGradient(0, 0, 0, 250);
    redGrad.addColorStop(0, 'rgba(220, 53, 69, 0.4)');
    redGrad.addColorStop(1, 'rgba(220, 53, 69, 0.01)');

    lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Pendapatan',
                    data: chartPendapatan,
                    borderColor: '#28a745',
                    backgroundColor: greenGrad,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#28a745',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 7
                },
                {
                    label: 'Pengeluaran',
                    data: chartPengeluaran,
                    borderColor: '#dc3545',
                    backgroundColor: redGrad,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#dc3545',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: colors.tick, usePointStyle: true, padding: 16 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (ctx) {
                            return ctx.dataset.label + ': Rp' + ctx.parsed.y + 'jt';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: colors.grid },
                    ticks: { color: colors.tick }
                },
                y: {
                    grid: { color: colors.grid },
                    ticks: { color: colors.tick, callback: function (v) { return 'Rp' + v + 'jt'; } }
                }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });

    const barCtx = document.getElementById('barChart').getContext('2d');
    barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Pendapatan',
                    data: chartPendapatan,
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: '#28a745',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Pengeluaran',
                    data: chartPengeluaran,
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: '#dc3545',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: colors.tick, usePointStyle: true, padding: 16 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (ctx) {
                            return ctx.dataset.label + ': Rp' + ctx.parsed.y + 'jt';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: colors.grid },
                    ticks: { color: colors.tick }
                },
                y: {
                    grid: { color: colors.grid },
                    ticks: { color: colors.tick, callback: function (v) { return 'Rp' + v + 'jt'; } }
                }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

// ============================================================
// 9. DATA TABLES
// ============================================================
const tableData = generateData(50);
let editRowIndex = null;

function initDataTable() {
    const table = $('#transaksiTable').DataTable({
        data: tableData,
        columns: [
            { data: 'id' },
            {
                data: 'tanggal',
                render: function (data) {
                    const p = data.split('-');
                    return p[2] + '/' + p[1] + '/' + p[0];
                }
            },
            { data: 'deskripsi' },
            { data: 'kategori' },
            {
                data: 'jumlah',
                render: function (data) {
                    return 'Rp ' + data.toLocaleString('id-ID');
                }
            },
            {
                data: 'status',
                render: function (data) {
                    const map = {
                        Sukses: 'bg-success',
                        Pending: 'bg-warning text-dark',
                        Gagal: 'bg-danger'
                    };

                    return '<span class="badge ' + (map[data] || 'bg-secondary') + ' px-3 py-1">' + data + '</span>';
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary edit-btn" data-id="${row.id}">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button class="btn btn-outline-danger delete-btn" data-id="${row.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                }
            }
        ],

        order: [[0, 'desc']],
        pageLength: 10,
        pagingType: "simple_numbers",

        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/id.json'
        },

        dom:
            "<'row mb-3'<'col-md-6'l><'col-md-6'f>>" +
            "<'row'<'col-12'tr>>" +
            "<'row mt-3 align-items-center'<'col-md-5'i><'col-md-7'p>>",

        columnDefs: [
            { targets: [0, 6], orderable: false }
        ]
    });

    new $.fn.dataTable.Buttons(table, {
        buttons: [
            {
                extend: 'excel',
                text: '<i class="bi bi-file-earmark-excel"></i> Excel',
                className: 'btn btn-success btn-sm me-2'
            },
            {
                extend: 'pdf',
                text: '<i class="bi bi-file-earmark-pdf"></i> PDF',
                className: 'btn btn-danger btn-sm me-2'
            },
            {
                extend: 'print',
                text: '<i class="bi bi-printer"></i> Print',
                className: 'btn btn-secondary btn-sm'
            }
        ]
    });
    table.buttons().container().appendTo('#exportButtonContainer');

    document.getElementById('globalSearch').addEventListener('input', function () {
        table.search(this.value).draw();
    });

    document.getElementById('filterKategori').addEventListener('change', function () {
        table.column(3).search(this.value).draw();
    });
    document.getElementById('filterStatus').addEventListener('change', function () {
        table.column(5).search(this.value).draw();
    });

    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        const min = document.getElementById('minDate').value;
        const max = document.getElementById('maxDate').value;
        if (!min && !max) return true;
        const rowData = settings.aoData[dataIndex]._aData;
        const date = rowData.tanggal;
        if (min && date < min) return false;
        if (max && date > max) return false;
        return true;
    });

    document.getElementById('filterBtn').addEventListener('click', function () {
        table.draw();
    });
    document.getElementById('resetBtn').addEventListener('click', function () {
        document.getElementById('filterKategori').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('minDate').value = '';
        document.getElementById('maxDate').value = '';
        table.column(3).search('').draw();
        table.column(5).search('').draw();
        $.fn.dataTable.ext.search.pop();
        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
            const min = document.getElementById('minDate').value;
            const max = document.getElementById('maxDate').value;
            if (!min && !max) return true;
            const rowData = settings.aoData[dataIndex]._aData;
            const date = rowData.tanggal;
            if (min && date < min) return false;
            if (max && date > max) return false;
            return true;
        });
        table.draw();
    });

    $('#transaksiTable tbody').on('click', '.edit-btn', function () {
        const row = table.row($(this).closest('tr'));
        const data = row.data();
        editRowIndex = row.index();
        document.getElementById('editId').value = data.id;
        document.getElementById('formTanggal').value = data.tanggal;
        document.getElementById('formDeskripsi').value = data.deskripsi;
        document.getElementById('formKategori').value = data.kategori;
        document.getElementById('formJumlah').value = data.jumlah;
        document.getElementById('formStatus').value = data.status;
        document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2" style="color:var(--primary-light);"></i>Edit Transaksi';
        new bootstrap.Modal(document.getElementById('transaksiModal')).show();
    });

    $('#transaksiTable tbody').on('click', '.delete-btn', function () {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            const row = table.row($(this).closest('tr'));
            const data = row.data();
            row.remove().draw();
            const idx = tableData.findIndex(d => d.id === data.id);
            if (idx !== -1) tableData.splice(idx, 1);
            showToast('Transaksi berhasil dihapus!', 'success');
        }
    });

    return table;
}

// ============================================================
// 10. MODAL SAVE
// ============================================================
document.getElementById('saveBtn').addEventListener('click', function () {
    const id = document.getElementById('editId').value;
    const tanggal = document.getElementById('formTanggal').value;
    const deskripsi = document.getElementById('formDeskripsi').value.trim();
    const kategori = document.getElementById('formKategori').value;
    const jumlah = parseInt(document.getElementById('formJumlah').value);
    const status = document.getElementById('formStatus').value;

    if (!tanggal || !deskripsi || !kategori || !jumlah || !status) {
        showToast('Harap isi semua field!', 'error');
        return;
    }

    const table = $('#transaksiTable').DataTable();

    if (editRowIndex !== null) {
        const rowData = table.row(editRowIndex).data();
        rowData.tanggal = tanggal;
        rowData.deskripsi = deskripsi;
        rowData.kategori = kategori;
        rowData.jumlah = jumlah;
        rowData.status = status;
        table.row(editRowIndex).data(rowData).draw();
        const idx = tableData.findIndex(d => d.id === rowData.id);
        if (idx !== -1) tableData[idx] = rowData;
        showToast('Transaksi berhasil diperbarui!', 'success');
    } else {
        const newId = tableData.length > 0 ? Math.max(...tableData.map(d => d.id)) + 1 : 1;
        const newData = { id: newId, tanggal, deskripsi, kategori, jumlah, status };
        table.row.add(newData).draw();
        tableData.unshift(newData);
        showToast('Transaksi berhasil ditambahkan!', 'success');
    }

    bootstrap.Modal.getInstance(document.getElementById('transaksiModal')).hide();
    document.getElementById('transaksiForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle me-2" style="color:var(--primary-light);"></i>Tambah Transaksi';
    editRowIndex = null;
});

document.getElementById('transaksiModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('transaksiForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle me-2" style="color:var(--primary-light);"></i>Tambah Transaksi';
    editRowIndex = null;
});

// ============================================================
// 11. TOAST
// ============================================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const icons = { success: 'bi-check-circle-fill', error: 'bi-exclamation-circle-fill' };
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML =
        '<div class="custom-toast-icon ' + type + '"><i class="bi ' + (icons[type] || icons.success) + '"></i></div>' +
        '<div class="custom-toast-content"><p>' + message + '</p><small>' + new Date().toLocaleTimeString('id-ID') + '</small></div>' +
        '<button class="custom-toast-close"><i class="bi bi-x"></i></button>';
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    toast.querySelector('.custom-toast-close').addEventListener('click', function () {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    });
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }
    }, 4000);
}

// ============================================================
// 12. BACK TO TOP
// ============================================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function () {
    backToTop.classList.toggle('show', window.scrollY > 300);
});
backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 13. INIT — Loading Skeleton → Content
// ============================================================
setTimeout(function () {
    const skeleton = document.getElementById('loadingSkeleton');
    skeleton.style.transition = 'opacity 0.5s ease';
    skeleton.style.opacity = '0';
    setTimeout(function () {
        skeleton.style.display = 'none';
        document.getElementById('mainContent').style.display = 'flex';

        animateValue(document.getElementById('pendapatanCount'), 0, 12500000, 1500);
        animateValue(document.getElementById('pengeluaranCount'), 0, 8200000, 1500);
        animateValue(document.getElementById('labaCount'), 0, 4300000, 1500);
        animateValue(document.getElementById('transaksiCount'), 0, 1247, 1500);

        initCharts();
        initDataTable();
    }, 500);
}, 1500);
