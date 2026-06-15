import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function LaporanSummaryCards({ totalPagu, totalTerpakai, totalSisa }) {
  const { darkMode } = useContext(ThemeContext);

  return (
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
              {formatRupiah(totalPagu)}
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
              {formatRupiah(totalTerpakai)}
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
              {formatRupiah(totalSisa)}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaporanSummaryCards;
