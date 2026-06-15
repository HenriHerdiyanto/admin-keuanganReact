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

function LaporanItemRow({ item, isExpanded, onToggle }) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div key={item.idItemSubKegiatan}>
      <div
        className="px-3 py-2 d-flex align-items-center justify-content-between"
        style={{
          borderBottom: "1px solid var(--border)",
          cursor: "pointer",
          backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
        }}
        onClick={() => onToggle(item.idItemSubKegiatan)}
      >
        <div className="d-flex align-items-center gap-2">
          <i
            className={`bi ${isExpanded ? "bi-chevron-down" : "bi-chevron-right"} text-muted`}
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
            {formatRupiah(item.total_terpakai)}
          </span>
          <span
            className={`fw-medium ${item.sisa_anggaran <= 0 ? "text-danger" : "text-warning"}`}
          >
            {formatRupiah(item.sisa_anggaran)}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div
          className="px-4 py-2"
          style={{
            background: darkMode ? "#161616" : "#fff",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {item.details && item.details.length > 0 ? (
            <table
              className={`table table-sm mb-0 ${darkMode ? "table-dark" : ""}`}
              style={{ fontSize: "0.8rem" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Keterangan</th>
                  <th className="text-end" style={{ width: "40%" }}>
                    Nilai
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.details.map((d, dIdx) => (
                  <tr key={dIdx}>
                    <td>{d.keterangan}</td>
                    <td className="text-end">{formatRupiah(d.nilai)}</td>
                  </tr>
                ))}
                <tr className="fw-bold">
                  <td>Total</td>
                  <td className="text-end text-primary">
                    {formatRupiah(item.total_terpakai)}
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
}

export default LaporanItemRow;
