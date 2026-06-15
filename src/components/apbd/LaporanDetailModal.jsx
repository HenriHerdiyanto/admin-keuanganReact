import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import LaporanSummaryCards from "./LaporanSummaryCards";
import LaporanKegiatanCard from "./LaporanKegiatanCard";

function LaporanDetailModal({
  detailProgram,
  detailData,
  detailLoading,
  expandedItems,
  onClose,
  onToggle,
  onPrint,
}) {
  const { darkMode } = useContext(ThemeContext);

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
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
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
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              {detailLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Memuat detail laporan...</p>
                </div>
              ) : detailData && detailData.length > 0 ? (
                <>
                  {detailTotals && (
                    <LaporanSummaryCards
                      totalPagu={detailTotals.totalPagu}
                      totalTerpakai={detailTotals.totalTerpakai}
                      totalSisa={detailTotals.totalSisa}
                    />
                  )}

                  {detailData.map((kegiatan) => (
                    <LaporanKegiatanCard
                      key={kegiatan.idKegiatan}
                      kegiatan={kegiatan}
                      expandedItems={expandedItems}
                      onToggle={onToggle}
                    />
                  ))}
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
                onClick={onClose}
              >
                <i className="bi bi-x-circle me-1"></i> Tutup
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onPrint}
              >
                <i className="bi bi-printer me-1"></i> Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LaporanDetailModal;
