import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import LaporanSubKegiatanSection from "./LaporanSubKegiatanSection";

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function LaporanKegiatanCard({ kegiatan, expandedItems, onToggle }) {
  const { darkMode } = useContext(ThemeContext);

  const subTotalPagu = kegiatan.subKegiatan.reduce(
    (sum, sub) =>
      sum +
      sub.items.reduce((s, item) => s + (item.anggaran_pagu || 0), 0),
    0,
  );
  const subTotalTerpakai = kegiatan.subKegiatan.reduce(
    (sum, sub) =>
      sum +
      sub.items.reduce((s, item) => s + (item.total_terpakai || 0), 0),
    0,
  );

  return (
    <div
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
            Sisa: {formatRupiah(subTotalPagu - subTotalTerpakai)}
          </span>
        </div>
      </div>
      <div className="card-body p-0">
        {kegiatan.subKegiatan.map((sub) => (
          <LaporanSubKegiatanSection
            key={sub.idSubKegiatan}
            sub={sub}
            expandedItems={expandedItems}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default LaporanKegiatanCard;
