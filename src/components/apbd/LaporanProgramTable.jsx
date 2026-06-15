import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import FilterTable from "../../pages/filter/FilterTable";

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function LaporanProgramTable({
  data,
  loading,
  currentPage,
  lastPage,
  totalData,
  searchTerm,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
  handleSort,
  sortIndicator,
  onPageChange,
  onDetail,
}) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <>
      <FilterTable
        searchTerm={searchTerm}
        setSearchTerm={onSearchChange}
        startDate={startDate}
        setStartDate={onStartDateChange}
        endDate={endDate}
        setEndDate={onEndDateChange}
        onReset={onReset}
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
              data.map((program, index) => (
                <tr key={program.idProgram}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{program.namaProgram}</td>
                  <td>{formatRupiah(program.total_harga)}</td>
                  <td className="text-center">{program.jumlah_transaksi}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => onDetail(program)}
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
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-secondary ms-2"
              disabled={currentPage === lastPage}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LaporanProgramTable;
