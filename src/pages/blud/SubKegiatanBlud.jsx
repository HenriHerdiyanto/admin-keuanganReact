import React, { useEffect, useState } from "react";
import { useSort } from "../../hooks/useSort";
import { useFilteredData } from "../../hooks/useFilteredData";
import FilterTable from "../filter/FilterTable";
import ActionButtons from "../filter/ActionButtons";
import { showToast } from "../../utils/toast";
import { exportToExcel } from "../../utils/exportExcel";
import FormSubKegiatanBlud from "../../components/blud/FormSubKegiatanBlud";
import { confirmDelete } from "../../hooks/deleteHandler";

function SubKegiatanBlud() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [subKegiatan, setSubKegiatan] = useState([]);
  const [dataKegiatan, setDataKegiatan] = useState([]);

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
    subKegiatan,
    ["kodeSubKegiatan", "namaSubKegiatan"],
    "created_at",
  );
  const { handleSort, sortIndicator, getSortedData } = useSort();
  const sortedData = getSortedData(filteredData);

  const fetchSubKegiatan = async (page = 1) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://20.2.2.230/simkeu/public/api/data_sub_kegiatan_blud?page=${page}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(token);
      if (!response.ok) throw new Error("Gagal mengambil data kegiatan");

      const result = await response.json();

      const paginator = result.data || {};
      setSubKegiatan(Array.isArray(paginator.data) ? paginator.data : []);
      setCurrentPage(paginator.current_page || 1);
      setLastPage(paginator.last_page || 1);
      setTotalData(paginator.total || 0);

      const kegiatanPaginator = result.dataKegiatan || {};
      setDataKegiatan(
        Array.isArray(kegiatanPaginator.data) ? kegiatanPaginator.data : [],
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubKegiatan(currentPage);
  }, [currentPage]);

  const handleExportExcel = () => {
    exportToExcel({
      data: subKegiatan,
      columns: [
        { header: "Nama Kegiatan", accessor: "namaKegiatan" },
        { header: "Kode Sub Kegiatan", accessor: "kodeSubKegiatan" },
        { header: "Nama Sub Kegiatan", accessor: "namaSubKegiatan" },
      ],
      sheetName: "Sub Kegiatan BLUD",
      fileName: `Data_Sub_Kegiatan_BLUD_${new Date().toISOString().split("T")[0]}`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  function openAddModal() {
    setEditData(null);
    setModalOpen(true);
  }

  function openEditModal(subkegiatan) {
    setEditData(subkegiatan);
    setModalOpen(true);
  }

  function handleDelete(id, namaSubKegiatan) {
    confirmDelete({
      url: "http://20.2.2.230/simkeu/public/api/data_sub_kegiatan_blud",
      id,
      itemName: namaSubKegiatan,
      onSuccess: () => {
        setSubKegiatan((prev) => prev.filter((subkeg) => subkeg.id !== id));
      },
    });
  }

  const handleSaveSuccess = (subkegiatanData, editId) => {
    if (editId) {
      setSubKegiatan((prev) =>
        prev.map((subkeg) => (subkeg.id === editId ? subkegiatanData : subkeg)),
      );
      showToast("Data berhasil diperbarui!", "success");
    } else {
      fetchSubKegiatan(currentPage);
      showToast("Data berhasil ditambahkan!", "success");
    }
  };

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

  return (
    <div className="content-card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h5 className="mb-0">
          <i
            className="bi bi-table me-2"
            style={{ color: "var(--primary-light)" }}
          ></i>
          Sub Kegiatan BLUD
        </h5>

        <ActionButtons
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          onAdd={openAddModal}
        />
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
            className="table table-hover align-middle table-themed"
          >
            <thead>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("id")}
                >
                  No{sortIndicator("id")}
                </th>
                <th
                  style={{ width: "30%", cursor: "pointer" }}
                  onClick={() => handleSort("namaKegiatan")}
                >
                  Nama Kegiatan{sortIndicator("namaKegiatan")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("kodeSubKegiatan")}
                >
                  Kode Sub Kegiatan{sortIndicator("kodeSubKegiatan")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("namaSubKegiatan")}
                >
                  Nama Sub Kegiatan{sortIndicator("namaSubKegiatan")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("created_at")}
                >
                  Tanggal Input{sortIndicator("created_at")}
                </th>
                <th className="no-print" style={{ width: "100px" }}>
                  Aksi
                </th>
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
                sortedData.map((subkegiatan, index) => (
                  <tr key={subkegiatan.id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{subkegiatan.namaKegiatan}</td>
                    <td>{subkegiatan.kodeSubKegiatan}</td>
                    <td>{subkegiatan.namaSubKegiatan}</td>
                    <td>{subkegiatan.created_at}</td>
                    <td className="no-print">
                      <button
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => openEditModal(subkegiatan)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleDelete(
                            subkegiatan.id,
                            subkegiatan.namaSubKegiatan,
                          )
                        }
                      >
                        <i className="bi bi-trash"></i>
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

        <FormSubKegiatanBlud
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          editData={editData}
          onSaveSuccess={handleSaveSuccess}
          showToast={showToast}
          dataKegiatan={dataKegiatan}
        />
      </div>
    </div>
  );
}

export default SubKegiatanBlud;
