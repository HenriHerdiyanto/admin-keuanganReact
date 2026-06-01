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
        data.push({
            id: i,
            tanggal: '2026-05-' + day,
            deskripsi: descriptions[Math.floor(Math.random() * descriptions.length)],
            kategori: categories[Math.floor(Math.random() * categories.length)],
            jumlah: Math.floor(Math.random() * 50000000) + 10000,
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
    data.sort((a, b) => b.id - a.id);
    return data;
}

const tableData = generateData(50);

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
// 7. BACK TO TOP
// ============================================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function () {
    backToTop.classList.toggle('show', window.scrollY > 300);
});
backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 8. DATA TABLE INIT
// ============================================================
let table;

function initDataTable() {
    table = $('#transaksiTable').DataTable({
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
                    const map = { Sukses: 'bg-success', Pending: 'bg-warning text-dark', Gagal: 'bg-danger' };
                    return '<span class="badge ' + (map[data] || 'bg-secondary') + ' px-3 py-1">' + data + '</span>';
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return '<div class="btn-group btn-group-sm">' +
                        '<button class="btn btn-outline-primary edit-btn" data-id="' + row.id + '" title="Edit"><i class="bi bi-pencil"></i></button>' +
                        '<button class="btn btn-outline-danger delete-btn" data-id="' + row.id + '" title="Hapus"><i class="bi bi-trash"></i></button>' +
                        '</div>';
                }
            }
        ],
        order: [[0, 'desc']],
        pageLength: 10,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/id.json'
        },
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columnDefs: [
            { targets: [0, 6], orderable: false }
        ]
    });

    // Export Buttons
    new $.fn.dataTable.Buttons(table, {
        buttons: [
            { extend: 'excel', text: '<i class="bi bi-file-earmark-excel"></i> Excel', className: 'btn btn-success btn-sm' },
            { extend: 'pdf', text: '<i class="bi bi-file-earmark-pdf"></i> PDF', className: 'btn btn-danger btn-sm' },
            { extend: 'print', text: '<i class="bi bi-printer"></i> Print', className: 'btn btn-secondary btn-sm' }
        ]
    });
    table.buttons().container().appendTo('#exportButtonContainer');

    // Global search
    document.getElementById('globalSearch').addEventListener('input', function () {
        table.search(this.value).draw();
    });

    // Column filters
    document.getElementById('filterKategori').addEventListener('change', function () {
        table.column(3).search(this.value).draw();
    });
    document.getElementById('filterStatus').addEventListener('change', function () {
        table.column(5).search(this.value).draw();
    });

    // Date range filter
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

    // Edit button → SweetAlert
    $('#transaksiTable tbody').on('click', '.edit-btn', function () {
        const row = table.row($(this).closest('tr'));
        const data = row.data();
        showEditForm(data, row);
    });

    // Delete button → SweetAlert
    $('#transaksiTable tbody').on('click', '.delete-btn', function () {
        const row = table.row($(this).closest('tr'));
        const data = row.data();
        confirmDelete(data, row);
    });
}

// ============================================================
// 9. SWEETALERT — TAMBAH TRANSAKSI
// ============================================================
document.getElementById('tambahBtn').addEventListener('click', showAddForm);

function showAddForm() {
    const today = new Date().toISOString().split('T')[0];

    Swal.fire({
        title: '<i class="bi bi-plus-circle me-2" style="color:#28a745;"></i>Tambah Transaksi Baru',
        html: `
            <div class="swal-field-group">
                <label class="swal-form-label">Tanggal</label>
                <input type="date" class="swal-input" id="swalTanggal" value="${today}">
            </div>
            <div class="swal-field-group">
                <label class="swal-form-label">Deskripsi</label>
                <input type="text" class="swal-input" id="swalDeskripsi" placeholder="Masukkan deskripsi transaksi">
            </div>
            <div class="swal-field-group">
                <label class="swal-form-label">Kategori</label>
                <select class="swal-select" id="swalKategori">
                    <option>Pendapatan</option>
                    <option>Operasional</option>
                    <option>Gaji</option>
                    <option>Marketing</option>
                    <option>Lainnya</option>
                </select>
            </div>
            <div class="swal-field-group">
                <label class="swal-form-label">Jumlah (Rp)</label>
                <input type="number" class="swal-input" id="swalJumlah" min="0" placeholder="0">
            </div>
            <div class="swal-field-group">
                <label class="swal-form-label">Status</label>
                <select class="swal-select" id="swalStatus">
                    <option>Sukses</option>
                    <option>Pending</option>
                    <option>Gagal</option>
                </select>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: '<i class="bi bi-check-lg me-1"></i> Simpan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#28a745',
        customClass: {
            popup: 'animate__animated animate__fadeInUp'
        },
        preConfirm: () => {
            const tanggal = document.getElementById('swalTanggal').value;
            const deskripsi = document.getElementById('swalDeskripsi').value.trim();
            const kategori = document.getElementById('swalKategori').value;
            const jumlah = parseInt(document.getElementById('swalJumlah').value);
            const status = document.getElementById('swalStatus').value;

            if (!tanggal || !deskripsi || !jumlah) {
                Swal.showValidationMessage('Harap isi semua field dengan benar!');
                return false;
            }

            return { tanggal, deskripsi, kategori, jumlah, status };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newData = result.value;
            newData.id = tableData.length > 0 ? Math.max(...tableData.map(d => d.id)) + 1 : 1;
            tableData.unshift(newData);
            table.row.add(newData).draw();

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Transaksi baru berhasil ditambahkan.',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                background: body.classList.contains('dark-mode') ? '#1e1e1e' : '#fff',
                color: body.classList.contains('dark-mode') ? '#e0e0e0' : '#333'
            });
        }
    });
}

// ============================================================
// 10. SWEETALERT — EDIT TRANSAKSI
// ============================================================
function showEditForm(data, row) {
    Swal.fire({
        title: '<i class="bi bi-pencil me-2" style="color:#0d6e2d;"></i>Edit Transaksi',
        html: `
            <div class="swal-field-group">
                <label class="swal-form-label">Tanggal</label>
                <input type="date" class="swal-input" id="swalTanggal" value="${data.tanggal}">
            </div>
            <div class="swal-field-group">
                <label class="swal-form-label">Deskripsi</label>
                <input type="text" class="swal-input" id="swalDeskripsi" value="${data.deskripsi}">
            </div>
            <div class="swal-field-group">
                <label class="swal-form-label">Kategori</label>
                <select class="swal-select" id="swalKategori">
                    <option ${data.kategori === 'Pendapatan' ? 'selected' : ''}>Pendapatan</option>
                    <option ${data.kategori === 'Operasional' ? 'selected' : ''}>Operasional</option>
                    <option ${data.kategori === 'Gaji' ? 'selected' : ''}>Gaji</option>
                    <option ${data.kategori === 'Marketing' ? 'selected' : ''}>Marketing</option>
                    <option ${data.kategori === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
                </select>
            </div>
            <div class="swal-field-group">
                <label class="swal-form-label">Jumlah (Rp)</label>
                <input type="number" class="swal-input" id="swalJumlah" min="0" value="${data.jumlah}">
            </div>
            <div class="swal-field-group">
                <label class="swal-form-label">Status</label>
                <select class="swal-select" id="swalStatus">
                    <option ${data.status === 'Sukses' ? 'selected' : ''}>Sukses</option>
                    <option ${data.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option ${data.status === 'Gagal' ? 'selected' : ''}>Gagal</option>
                </select>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: '<i class="bi bi-check-lg me-1"></i> Simpan Perubahan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#0d6e2d',
        customClass: {
            popup: 'animate__animated animate__fadeInUp'
        },
        preConfirm: () => {
            const tanggal = document.getElementById('swalTanggal').value;
            const deskripsi = document.getElementById('swalDeskripsi').value.trim();
            const kategori = document.getElementById('swalKategori').value;
            const jumlah = parseInt(document.getElementById('swalJumlah').value);
            const status = document.getElementById('swalStatus').value;

            if (!tanggal || !deskripsi || !jumlah) {
                Swal.showValidationMessage('Harap isi semua field dengan benar!');
                return false;
            }

            return { tanggal, deskripsi, kategori, jumlah, status };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const updated = result.value;
            data.tanggal = updated.tanggal;
            data.deskripsi = updated.deskripsi;
            data.kategori = updated.kategori;
            data.jumlah = updated.jumlah;
            data.status = updated.status;
            row.data(data).draw();

            const idx = tableData.findIndex(d => d.id === data.id);
            if (idx !== -1) tableData[idx] = data;

            Swal.fire({
                icon: 'success',
                title: 'Diperbarui!',
                text: 'Transaksi berhasil diperbarui.',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                background: body.classList.contains('dark-mode') ? '#1e1e1e' : '#fff',
                color: body.classList.contains('dark-mode') ? '#e0e0e0' : '#333'
            });
        }
    });
}

// ============================================================
// 11. SWEETALERT — HAPUS TRANSAKSI
// ============================================================
function confirmDelete(data, row) {
    Swal.fire({
        title: 'Hapus Transaksi?',
        text: `Yakin ingin menghapus "${data.deskripsi}"? Data tidak dapat dikembalikan!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="bi bi-trash me-1"></i> Ya, hapus!',
        cancelButtonText: 'Batal',
        customClass: {
            popup: 'animate__animated animate__fadeInUp'
        },
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            row.remove().draw();
            const idx = tableData.findIndex(d => d.id === data.id);
            if (idx !== -1) tableData.splice(idx, 1);

            Swal.fire({
                icon: 'success',
                title: 'Terhapus!',
                text: 'Transaksi berhasil dihapus.',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                background: body.classList.contains('dark-mode') ? '#1e1e1e' : '#fff',
                color: body.classList.contains('dark-mode') ? '#e0e0e0' : '#333'
            });
        }
    });
}

// ============================================================
// 12. INIT — Loading Skeleton → Content
// ============================================================
setTimeout(function () {
    const skeleton = document.getElementById('loadingSkeleton');
    skeleton.style.transition = 'opacity 0.5s ease';
    skeleton.style.opacity = '0';
    setTimeout(function () {
        skeleton.style.display = 'none';
        document.getElementById('mainContent').style.display = 'flex';
        initDataTable();
    }, 500);
}, 1500);
