import { useState, useMemo, useCallback, useContext } from "react";
import Swal from "sweetalert2";
import { ThemeContext } from "../../contexts/ThemeContext";

const categories = [
  "Pendapatan",
  "Operasional",
  "Gaji",
  "Marketing",
  "Lainnya",
];
const statuses = ["Sukses", "Pending", "Gagal"];
const descriptions = [
  "Penjualan Produk A",
  "Pembelian Bahan Baku",
  "Gaji Karyawan Bulanan",
  "Iklan Google Ads",
  "Sewa Kantor Bulanan",
  "Biaya Listrik & Air",
  "Penjualan Produk B",
  "Biaya Transportasi Logistik",
  "Gaji Freelance Designer",
  "Iklan Facebook Ads",
  "Biaya Internet & Telepon",
  "Penjualan Produk C",
  "Biaya Maintenance Server",
  "THR Karyawan",
  "Iklan Instagram",
  "Penjualan Produk D",
  "Biaya Legal & Perizinan",
  "Bonus Karyawan",
  "Email Marketing Campaign",
  "Penjualan Produk E",
  "Biaya Asuransi",
  "Sponsorship Event",
  "Penjualan Produk F",
  "Biaya Training Karyawan",
  "Affiliate Marketing",
  "Penjualan Produk G",
  "Biaya Cloud Server",
  "Refund Customer",
  "Penjualan Produk H",
  "Biaya Konsultan Pajak",
];

function generateData(count) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const day = String(Math.floor(Math.random() * 21) + 1).padStart(2, "0");
    data.push({
      id: i,
      tanggal: "2026-05-" + day,
      deskripsi: descriptions[Math.floor(Math.random() * descriptions.length)],
      kategori: categories[Math.floor(Math.random() * categories.length)],
      jumlah: Math.floor(Math.random() * 50000000) + 10000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  data.sort((a, b) => b.id - a.id);
  return data;
}

const statusBadge = {
  Sukses: "bg-success",
  Pending: "bg-warning text-dark",
  Gagal: "bg-danger",
};

function TransactionsTable() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState(() => generateData(50));
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    tanggal: "",
    deskripsi: "",
    kategori: "",
    jumlah: "",
    status: "",
  });

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.deskripsi.toLowerCase().includes(q) ||
          r.kategori.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.tanggal.includes(q),
      );
    }
    if (filterCategory)
      result = result.filter((r) => r.kategori === filterCategory);
    if (filterStatus) result = result.filter((r) => r.status === filterStatus);
    if (minDate) result = result.filter((r) => r.tanggal >= minDate);
    if (maxDate) result = result.filter((r) => r.tanggal <= maxDate);
    result.sort((a, b) => {
      let va = a[sortField];
      let vb = b[sortField];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [
    data,
    search,
    filterCategory,
    filterStatus,
    minDate,
    maxDate,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
    },
    [sortField],
  );

  function openAddModal() {
    setEditId(null);
    setForm({
      tanggal: "",
      deskripsi: "",
      kategori: "",
      jumlah: "",
      status: "",
    });
    setModalOpen(true);
  }

  function openEditModal(row) {
    setEditId(row.id);
    setForm({
      tanggal: row.tanggal,
      deskripsi: row.deskripsi,
      kategori: row.kategori,
      jumlah: row.jumlah,
      status: row.status,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (
      !form.tanggal ||
      !form.deskripsi ||
      !form.kategori ||
      !form.jumlah ||
      !form.status
    ) {
      showToast("Harap isi semua field!", "error");
      return;
    }
    const jumlah = parseInt(form.jumlah);
    if (editId !== null) {
      setData((prev) =>
        prev.map((r) => (r.id === editId ? { ...r, ...form, jumlah } : r)),
      );
      showToast("Transaksi berhasil diperbarui!", "success");
    } else {
      const newId =
        data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData((prev) => [{ id: newId, ...form, jumlah }, ...prev]);
      showToast("Transaksi berhasil ditambahkan!", "success");
    }
    setModalOpen(false);
  }

  function handleDelete(id) {
    Swal.fire({
      title: "Hapus Transaksi?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prev) => prev.filter((r) => r.id !== id));
        Swal.fire("Terhapus!", "Transaksi berhasil dihapus.", "success");
      }
    });
  }

  function showToast(message, type) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const icons = {
      success: "bi-check-circle-fill",
      error: "bi-exclamation-circle-fill",
    };
    const toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.innerHTML =
      '<div class="custom-toast-icon ' +
      type +
      '"><i class="bi ' +
      (icons[type] || icons.success) +
      '"></i></div>' +
      '<div class="custom-toast-content"><p>' +
      message +
      "</p><small>" +
      new Date().toLocaleTimeString("id-ID") +
      "</small></div>" +
      '<button class="custom-toast-close"><i class="bi bi-x"></i></button>';
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    toast.querySelector(".custom-toast-close").onclick = function () {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    };
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
      }
    }, 4000);
  }

  function exportCSV() {
    const headers = [
      "ID",
      "Tanggal",
      "Deskripsi",
      "Kategori",
      "Jumlah",
      "Status",
    ];
    const rows = filtered.map((r) => [
      r.id,
      r.tanggal,
      r.deskripsi,
      r.kategori,
      r.jumlah,
      r.status,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => '"' + cell + '"').join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaksi.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data berhasil di-export ke CSV", "success");
  }

  function handlePrint() {
    window.print();
  }

  function resetFilters() {
    setSearch("");
    setFilterCategory("");
    setFilterStatus("");
    setMinDate("");
    setMaxDate("");
    setPage(1);
  }

  function formatDate(tanggal) {
    const p = tanggal.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function formatRupiah(n) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  const sortIcon = (field) => {
    if (sortField !== field)
      return <i className="bi bi-arrow-down-up text-muted opacity-50 ms-1"></i>;
    return (
      <i
        className={
          "bi bi-caret-" +
          (sortDir === "asc" ? "up-fill" : "down-fill") +
          " ms-1"
        }
      ></i>
    );
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    pages.push(
      <li
        key="prev"
        className={"page-item" + (safePage <= 1 ? " disabled" : "")}
      >
        <button
          className="page-link"
          onClick={() => setPage(page - 1)}
          disabled={safePage <= 1}
        >
          &laquo;
        </button>
      </li>,
    );
    for (let i = start; i <= end; i++) {
      pages.push(
        <li key={i} className={"page-item" + (i === safePage ? " active" : "")}>
          <button className="page-link" onClick={() => setPage(i)}>
            {i}
          </button>
        </li>,
      );
    }
    pages.push(
      <li
        key="next"
        className={"page-item" + (safePage >= totalPages ? " disabled" : "")}
      >
        <button
          className="page-link"
          onClick={() => setPage(page + 1)}
          disabled={safePage >= totalPages}
        >
          &raquo;
        </button>
      </li>,
    );
    return pages;
  };

  return (
    <div className="content-card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h5 className="mb-0">
          <i
            className="bi bi-table me-2"
            style={{ color: "var(--primary-light)" }}
          ></i>
          Data Transaksi
        </h5>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={exportCSV}>
            <i className="bi bi-file-earmark-excel me-1"></i> CSV
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <i className="bi bi-printer me-1"></i> Print
          </button>
          <button className="btn btn-primary btn-sm" onClick={openAddModal}>
            <i className="bi bi-plus-circle me-1"></i> Tambah
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row g-2 mb-3 align-items-end">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select form-select-sm"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select form-select-sm"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control form-control-sm"
              value={minDate}
              onChange={(e) => {
                setMinDate(e.target.value);
                setPage(1);
              }}
              title="Tanggal awal"
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control form-control-sm"
              value={maxDate}
              onChange={(e) => {
                setMaxDate(e.target.value);
                setPage(1);
              }}
              title="Tanggal akhir"
            />
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={resetFilters}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table
            id="transaksiTable"
            className="table table-hover align-middle table-themed"
          >
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th
                  onClick={() => handleSort("tanggal")}
                  style={{ cursor: "pointer" }}
                >
                  Tanggal {sortIcon("tanggal")}
                </th>
                <th
                  onClick={() => handleSort("deskripsi")}
                  style={{ cursor: "pointer" }}
                >
                  Deskripsi {sortIcon("deskripsi")}
                </th>
                <th
                  onClick={() => handleSort("kategori")}
                  style={{ cursor: "pointer" }}
                >
                  Kategori {sortIcon("kategori")}
                </th>
                <th
                  onClick={() => handleSort("jumlah")}
                  style={{ cursor: "pointer" }}
                >
                  Jumlah {sortIcon("jumlah")}
                </th>
                <th
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer" }}
                >
                  Status {sortIcon("status")}
                </th>
                <th style={{ width: "100px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Tidak ada data transaksi
                  </td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{formatDate(row.tanggal)}</td>
                    <td>{row.deskripsi}</td>
                    <td>{row.kategori}</td>
                    <td>{formatRupiah(row.jumlah)}</td>
                    <td>
                      <span
                        className={
                          "badge " +
                          (statusBadge[row.status] || "bg-secondary") +
                          " px-3 py-1"
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => openEditModal(row)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(row.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Menampilkan{" "}
            {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}-
            {Math.min(safePage * pageSize, filtered.length)} dari{" "}
            {filtered.length} data
          </small>
          {totalPages > 1 && (
            <nav>
              <ul className="pagination pagination-sm mb-0">
                {renderPagination()}
              </ul>
            </nav>
          )}
        </div>
      </div>

      {modalOpen && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setModalOpen(false)}
          ></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title" id="modalTitle">
                    <i
                      className={
                        "bi " +
                        (editId ? "bi-pencil" : "bi-plus-circle") +
                        " me-2"
                      }
                      style={{ color: "var(--primary-light)" }}
                    ></i>
                    {editId ? "Edit Transaksi" : "Tambah Transaksi"}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form id="transaksiForm" onSubmit={(e) => e.preventDefault()}>
                    <input type="hidden" id="editId" value={editId || ""} />
                    <div className="mb-3">
                      <label className="form-label">Tanggal</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.tanggal}
                        onChange={(e) =>
                          setForm({ ...form, tanggal: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Deskripsi</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Masukkan deskripsi"
                        value={form.deskripsi}
                        onChange={(e) =>
                          setForm({ ...form, deskripsi: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Kategori</label>
                      <select
                        className="form-select"
                        value={form.kategori}
                        onChange={(e) =>
                          setForm({ ...form, kategori: e.target.value })
                        }
                      >
                        <option value="">Pilih kategori</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Jumlah (Rp)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Masukkan jumlah"
                        value={form.jumlah}
                        onChange={(e) =>
                          setForm({ ...form, jumlah: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option value="">Pilih status</option>
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    id="saveBtn"
                  >
                    <i className="bi bi-check-lg me-1"></i> Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TransactionsTable;
