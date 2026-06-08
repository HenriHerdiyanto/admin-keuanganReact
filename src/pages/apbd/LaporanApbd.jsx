import React, { useContext, useEffect, useState, useCallback } from "react";
import FilterTable from "../filter/FilterTable";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useSort } from "../../hooks/useSort";
import { useFilteredData } from "../../hooks/useFilteredData";
import { showToast } from "../../utils/toast";

const API_BASE = "http://20.2.2.230/simkeu/public/api";

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function LaporanApbd() {
  const { darkMode } = useContext(ThemeContext);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailProgram, setDetailProgram] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const [loading, setLoading] = useState(true);
  const [dataProgram, setDataProgram] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleResetFilter,
  } = useFilteredData(
    dataProgram,
    ["kodeProgram", "namaProgram"],
    "created_at",
  );

  const { handleSort, sortIndicator, getSortedData } = useSort();
  const sortedData = getSortedData(filteredData);

  const fetchDataLaporan = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/lap_kegiatan_apbd?page=${page}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();
      const paginator = result.data || {};
      setDataProgram(Array.isArray(paginator.data) ? paginator.data : []);
      setLastPage(paginator.last_page || 1);
      setTotalData(paginator.total || 0);
    } catch (error) {
      showToast("Gagal mengambil data laporan", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataLaporan(currentPage);
  }, [currentPage, fetchDataLaporan]);

  const openDetail = async (program) => {
    setDetailProgram(program);
    setDetailData(null);
    setExpandedItems({});
    setDetailLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/lap_kegiatan_apbd/detail/${program.idProgram}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (result.success) {
        setDetailData(result.data);
      } else {
        showToast(result.message || "Gagal memuat detail", "error");
      }
    } catch (error) {
      showToast("Gagal memuat detail laporan", "error");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailProgram(null);
    setDetailData(null);
  };

  const toggleItem = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => window.print();

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
  };

  const handleReset = () => {
    handleResetFilter();
  };

  const computeTotals = (data) => {
    let totalPagu = 0;
    let totalTerpakai = 0;
    data.forEach((keg) => {
      keg.subKegiatan.forEach((sub) => {
        sub.items.forEach((item) => {
          totalPagu += item.anggaran_pagu || 0;
          totalTerpakai += item.total_terpakai || 0;
        });
      });
    });
    return { totalPagu, totalTerpakai, totalSisa: totalPagu - totalTerpakai };
  };

  const detailTotals = detailData ? computeTotals(detailData) : null;

  return (
    <div className="content-card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h5 className="mb-0">
          <i
            className="bi bi-table me-2"
            style={{ color: "var(--primary-light)" }}
          ></i>
          Laporan APBD
        </h5>
      </div>

      <div className="card-body">
        <FilterTable
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          startDate={startDate}
          setStartDate={handleStartDateChange}
          endDate={endDate}
          setEndDate={handleEndDateChange}
          onReset={handleReset}
        />

        <div className="table-responsive" id="print-area">
          <table
            id="DataTransaction"
            className={`table table-hover align-middle ${darkMode ? "table-dark text-light" : "table-light text-dark"}`}
          >
            <thead className={darkMode ? "table-dark" : "table-light"}>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("idProgram")}
                >
                  No{sortIndicator("idProgram")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("namaProgram")}
                >
                  Nama Program{sortIndicator("namaProgram")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("total_harga")}
                >
                  Total Pengeluaran{sortIndicator("total_harga")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("jumlah_transaksi")}
                  className="text-center"
                >
                  Jumlah Transaksi{sortIndicator("jumlah_transaksi")}
                </th>
                <th className="no-print text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((program, index) => (
                  <tr key={program.idProgram}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{program.namaProgram}</td>
                    <td>{formatRupiah(program.total_harga)}</td>
                    <td className="text-center">{program.jumlah_transaksi}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => openDetail(program)}
                      >
                        <i className="bi bi-eye me-1"></i> Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Total Data : <strong>{totalData}</strong>
            </div>
            <div>
              <span className="mx-2">
                Halaman {currentPage} dari {lastPage} |
              </span>
              <button
                className="btn btn-secondary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary ms-2"
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailProgram && (
        <>
          <div className="modal-backdrop fade show" onClick={closeDetail}></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ overflowY: "auto" }}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-xl"
              style={{ maxWidth: "1100px" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i
                      className="bi bi-file-earmark-text me-2"
                      style={{ color: "var(--primary-light)" }}
                    ></i>
                    Detail Laporan - {detailProgram.namaProgram}
                  </h5>
                  <button
                    style={{ backgroundColor: darkMode ? "#fff" : "#333" }}
                    type="button"
                    className="btn-close"
                    onClick={closeDetail}
                  ></button>
                </div>

                <div className="modal-body">
                  {detailLoading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-muted">
                        Memuat detail laporan...
                      </p>
                    </div>
                  ) : detailData && detailData.length > 0 ? (
                    <>
                      {detailTotals && (
                        <div className="row g-3 mb-4">
                          <div className="col-md-4">
                            <div
                              className="card border-0 shadow-sm h-100"
                              style={{
                                background: darkMode ? "#1a3a1a" : "#e8f5e9",
                                borderRadius: "12px",
                              }}
                            >
                              <div className="card-body text-center py-3">
                                <small className="text-muted text-uppercase fw-semibold">
                                  Anggaran Pagu
                                </small>
                                <h4 className="mb-0 mt-1 text-success fw-bold">
                                  {formatRupiah(detailTotals.totalPagu)}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div
                              className="card border-0 shadow-sm h-100"
                              style={{
                                background: darkMode ? "#1a2a3a" : "#e3f2fd",
                                borderRadius: "12px",
                              }}
                            >
                              <div className="card-body text-center py-3">
                                <small className="text-muted text-uppercase fw-semibold">
                                  Total Terpakai
                                </small>
                                <h4 className="mb-0 mt-1 text-primary fw-bold">
                                  {formatRupiah(detailTotals.totalTerpakai)}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div
                              className="card border-0 shadow-sm h-100"
                              style={{
                                background: darkMode ? "#3a2a1a" : "#fff3e0",
                                borderRadius: "12px",
                              }}
                            >
                              <div className="card-body text-center py-3">
                                <small className="text-muted text-uppercase fw-semibold">
                                  Sisa Anggaran
                                </small>
                                <h4 className="mb-0 mt-1 text-warning fw-bold">
                                  {formatRupiah(detailTotals.totalSisa)}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {detailData.map((kegiatan) => {
                        const subTotalPagu = kegiatan.subKegiatan.reduce(
                          (sum, sub) =>
                            sum +
                            sub.items.reduce(
                              (s, item) => s + (item.anggaran_pagu || 0),
                              0,
                            ),
                          0,
                        );
                        const subTotalTerpakai = kegiatan.subKegiatan.reduce(
                          (sum, sub) =>
                            sum +
                            sub.items.reduce(
                              (s, item) => s + (item.total_terpakai || 0),
                              0,
                            ),
                          0,
                        );

                        return (
                          <div
                            key={kegiatan.idKegiatan}
                            className="card mb-3 border-0 shadow-sm"
                            style={{ borderRadius: "10px" }}
                          >
                            <div
                              className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2"
                              style={{
                                background: darkMode ? "#2a2a2a" : "#f8f9fa",
                                borderBottom: "2px solid var(--primary-light)",
                                borderRadius: "10px 10px 0 0",
                              }}
                            >
                              <h6 className="mb-0 fw-bold">
                                <i className="bi bi-folder2-open me-2 text-success"></i>
                                {kegiatan.namaKegiatan}
                              </h6>
                              <div className="d-flex gap-3 small">
                                <span className="text-success fw-semibold">
                                  Pagu: {formatRupiah(subTotalPagu)}
                                </span>
                                <span className="text-primary fw-semibold">
                                  Terpakai: {formatRupiah(subTotalTerpakai)}
                                </span>
                                <span className="text-warning fw-semibold">
                                  Sisa:{" "}
                                  {formatRupiah(
                                    subTotalPagu - subTotalTerpakai,
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="card-body p-0">
                              {kegiatan.subKegiatan.map((sub) => (
                                <div key={sub.idSubKegiatan}>
                                  <div
                                    className="px-3 py-2 fw-semibold small"
                                    style={{
                                      background: darkMode ? "#222" : "#f0f0f0",
                                      borderBottom: "1px solid var(--border)",
                                    }}
                                  >
                                    <i className="bi bi-folder me-2 text-info"></i>
                                    {sub.namaSubKegiatan}
                                  </div>

                                  {sub.items.map((item) => {
                                    const isExpanded =
                                      expandedItems[item.idItemSubKegiatan] ||
                                      false;
                                    return (
                                      <div key={item.idItemSubKegiatan}>
                                        <div
                                          className="px-3 py-2 d-flex align-items-center justify-content-between"
                                          style={{
                                            borderBottom:
                                              "1px solid var(--border)",
                                            cursor: "pointer",
                                            backgroundColor: darkMode
                                              ? "#1e1e1e"
                                              : "#ffffff",
                                            color: darkMode
                                              ? "#ffffff"
                                              : "#000000",
                                          }}
                                          onClick={() =>
                                            toggleItem(item.idItemSubKegiatan)
                                          }
                                        >
                                          <div className="d-flex align-items-center gap-2">
                                            <i
                                              className={`bi ${
                                                isExpanded
                                                  ? "bi-chevron-down"
                                                  : "bi-chevron-right"
                                              } text-muted`}
                                            ></i>
                                            <span
                                              className="small"
                                              style={{
                                                maxWidth: "500px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              {item.namaItemSubKegiatan}
                                            </span>
                                          </div>
                                          <div className="d-flex gap-3 small text-nowrap">
                                            <span className="text-success fw-medium">
                                              {formatRupiah(item.anggaran_pagu)}
                                            </span>
                                            <span className="text-primary fw-medium">
                                              {formatRupiah(
                                                item.total_terpakai,
                                              )}
                                            </span>
                                            <span
                                              className={`fw-medium ${
                                                item.sisa_anggaran <= 0
                                                  ? "text-danger"
                                                  : "text-warning"
                                              }`}
                                            >
                                              {formatRupiah(item.sisa_anggaran)}
                                            </span>
                                          </div>
                                        </div>

                                        {isExpanded && (
                                          <div
                                            className="px-4 py-2"
                                            style={{
                                              background: darkMode
                                                ? "#161616"
                                                : "#fff",
                                              borderBottom:
                                                "1px solid var(--border)",
                                            }}
                                          >
                                            {item.details &&
                                            item.details.length > 0 ? (
                                              <table
                                                className={`table table-sm mb-0 ${
                                                  darkMode ? "table-dark" : ""
                                                }`}
                                                style={{ fontSize: "0.8rem" }}
                                              >
                                                <thead>
                                                  <tr>
                                                    <th
                                                      style={{ width: "60%" }}
                                                    >
                                                      Keterangan
                                                    </th>
                                                    <th
                                                      className="text-end"
                                                      style={{ width: "40%" }}
                                                    >
                                                      Nilai
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {item.details.map(
                                                    (d, dIdx) => (
                                                      <tr key={dIdx}>
                                                        <td>{d.keterangan}</td>
                                                        <td className="text-end">
                                                          {formatRupiah(
                                                            d.nilai,
                                                          )}
                                                        </td>
                                                      </tr>
                                                    ),
                                                  )}
                                                  <tr className="fw-bold">
                                                    <td>Total</td>
                                                    <td className="text-end text-primary">
                                                      {formatRupiah(
                                                        item.total_terpakai,
                                                      )}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            ) : (
                                              <p className="text-muted small mb-0 text-center py-2">
                                                Tidak ada detail pengeluaran
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center py-5">
                      <i
                        className="bi bi-inbox text-muted"
                        style={{ fontSize: "3rem" }}
                      ></i>
                      <p className="mt-2 text-muted">
                        {detailData
                          ? "Tidak ada data detail untuk program ini"
                          : "Gagal memuat data detail"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeDetail}
                  >
                    <i className="bi bi-x-circle me-1"></i> Tutup
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePrint}
                  >
                    <i className="bi bi-printer me-1"></i> Print
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

export default LaporanApbd;
