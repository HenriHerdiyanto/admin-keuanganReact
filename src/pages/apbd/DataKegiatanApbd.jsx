import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import FormKegiatanApbd from "./FormKegiatanApbd";
import FilterTable from "../filter/FilterTable";
import ActionButtons from "../filter/ActionButtons";
import { confirmDelete } from "../../hooks/deleteHandler";
import { useFilteredData } from "../../hooks/useFilteredData";
import { useSort } from "../../hooks/useSort";
import { exportToExcel } from "../../utils/exportExcel";
import { showToast } from "../../utils/toast";
import "../../index.css";

function DataKegiatanApbd() {
  const { darkMode } = useContext(ThemeContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dataProgram, setDataProgram] = useState([]);
  const [dataKegiatan, setDataKegiatan] = useState([]);

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
    dataKegiatan,
    ["kodeKegiatan", "namaKegiatan"],
    "created_at",
  );

  const { handleSort, sortIndicator, getSortedData } = useSort();

  const sortedData = getSortedData(filteredData);

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://20.2.2.230/simkeu/public/api/data_apbd",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Gagal mengambil data program");

      const data = await response.json();
      setDataProgram(data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchKegiatan = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://20.2.2.230/simkeu/public/api/data_kegiatan_apbd",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Gagal mengambil data kegiatan");

      const data = await response.json();
      setDataKegiatan(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchKegiatan();
  }, []);

  const handleExportExcel = () => {
    exportToExcel({
      data: dataKegiatan,
      columns: [
        { header: "Nama Program", accessor: "nama_program" },
        { header: "Kode Kegiatan", accessor: "kodeKegiatan" },
        { header: "Nama Kegiatan", accessor: "namaKegiatan" },
      ],
      sheetName: "Kegiatan APBD",
      fileName: `Data_Kegiatan_APBD_${new Date().toISOString().split("T")[0]}`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  function openAddModal() {
    setEditData(null);
    setModalOpen(true);
  }

  function openEditModal(kegiatan) {
    setEditData(kegiatan);
    setModalOpen(true);
  }

  function handleDelete(id, namaKegiatan) {
    confirmDelete({
      url: "http://20.2.2.230/simkeu/public/api/data_kegiatan_apbd",
      id,
      itemName: namaKegiatan,
      onSuccess: () => {
        setDataKegiatan((prev) => prev.filter((keg) => keg.id !== id));
      },
    });
  }

  const handleSaveSuccess = (kegiatanData, editId) => {
    if (editId) {
      setDataKegiatan((prev) =>
        prev.map((keg) => (keg.id === editId ? kegiatanData : keg)),
      );
      showToast("Data berhasil diperbarui!", "success");
    } else {
      setDataKegiatan((prev) => [...prev, kegiatanData]);
      showToast("Data berhasil ditambahkan!", "success");
    }
  };

  return (
    <div className="content-card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h5 className="mb-0">
          <i
            className="bi bi-table me-2"
            style={{ color: "var(--primary-light)" }}
          ></i>
          Kegiatan APBD
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
          setSearchTerm={setSearchTerm}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onReset={handleResetFilter}
        />

        <div className="table-responsive" id="print-area">
          <table
            id="DataTransaction"
            className={`table table-hover align-middle ${
              darkMode ? "table-dark text-light" : "table-light text-dark"
            }`}
          >
            <thead className={darkMode ? "table-dark" : "table-light"}>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("id")}
                >
                  No{sortIndicator("id")}
                </th>
                <th
                  style={{ width: "30%", cursor: "pointer" }}
                  onClick={() => handleSort("nama_program")}
                >
                  Nama Program{sortIndicator("nama_program")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("kodeKegiatan")}
                >
                  Kode Kegiatan{sortIndicator("kodeKegiatan")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("namaKegiatan")}
                >
                  Nama Kegiatan{sortIndicator("namaKegiatan")}
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
                sortedData.map((kegiatan) => (
                  <tr key={kegiatan.id}>
                    <td>{kegiatan.id}</td>
                    <td>{kegiatan.nama_program}</td>
                    <td>{kegiatan.kodeKegiatan}</td>
                    <td>{kegiatan.namaKegiatan}</td>
                    <td className="no-print">
                      <button
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => openEditModal(kegiatan)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleDelete(kegiatan.id, kegiatan.namaKegiatan)
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
        </div>

        <FormKegiatanApbd
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          editData={editData}
          onSaveSuccess={handleSaveSuccess}
          showToast={showToast}
          dataProgram={dataProgram}
        />
      </div>
    </div>
  );
}

export default DataKegiatanApbd;
