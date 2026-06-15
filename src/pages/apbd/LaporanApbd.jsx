import React, { useContext, useEffect, useState, useCallback } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useSort } from "../../hooks/useSort";
import { useFilteredData } from "../../hooks/useFilteredData";
import { showToast } from "../../utils/toast";
import LaporanProgramTable from "../../components/apbd/LaporanProgramTable";
import LaporanDetailModal from "../../components/apbd/LaporanDetailModal";

const API_BASE = "http://20.2.2.230/simkeu/public/api";

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
        <LaporanProgramTable
          data={sortedData}
          loading={loading}
          currentPage={currentPage}
          lastPage={lastPage}
          totalData={totalData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onReset={handleResetFilter}
          handleSort={handleSort}
          sortIndicator={sortIndicator}
          onPageChange={setCurrentPage}
          onDetail={openDetail}
        />
      </div>

      {detailProgram && (
        <LaporanDetailModal
          detailProgram={detailProgram}
          detailData={detailData}
          detailLoading={detailLoading}
          expandedItems={expandedItems}
          onClose={closeDetail}
          onToggle={toggleItem}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}

export default LaporanApbd;
