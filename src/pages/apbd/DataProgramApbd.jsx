import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import FormProgramApbd from "./FormProgramApbd";
import FilterTable from "../filter/FilterTable";
import ActionButtons from "../filter/ActionButtons";
import { confirmDelete } from "../../hooks/deleteHandler";
import { useFilteredData } from "../../hooks/useFilteredData";
import { useSort } from "../../hooks/useSort";
import { exportToExcel } from "../../utils/exportExcel";
import { showToast } from "../../utils/toast";
import "../../index.css";

function DataApbd() {
  const { darkMode } = useContext(ThemeContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataProgram, setDataProgram] = useState([]);

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

  useEffect(() => {
    const getDataProgram = async () => {
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

        const data = await response.json();
        setDataProgram(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getDataProgram();
  }, []);

  const handleExportExcel = () => {
    exportToExcel({
      data: dataProgram,
      columns: [
        { header: "Kode Program", accessor: "kodeProgram" },
        { header: "Nama Program", accessor: "namaProgram" },
      ],
      sheetName: "Program APBD",
      fileName: `Data_Program_APBD_${new Date().toISOString().split("T")[0]}`,
    });
  };

  const handlePrint = () => window.print();

  function openAddModal() {
    setSelectedProgram(null);
    setModalOpen(true);
  }

  function openEditModal(program) {
    setSelectedProgram(program);
    setModalOpen(true);
  }

  const handleSaveSuccess = (programData, editId) => {
    if (editId) {
      setDataProgram((prev) =>
        prev.map((prog) => (prog.idProgram === editId ? programData : prog)),
      );
      showToast("Data berhasil diperbarui!", "success");
    } else {
      setDataProgram((prev) => [...prev, programData]);
      showToast("Data berhasil ditambahkan!", "success");
    }
  };

  function handleDelete(id) {
    confirmDelete({
      url: "http://20.2.2.230/simkeu/public/api/data_apbd",
      id,
      onSuccess: () => {
        setDataProgram((prev) => prev.filter((prog) => prog.idProgram !== id));
      },
    });
  }

  return (
    <div className="content-card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h5 className="mb-0">
          <i
            className="bi bi-table me-2"
            style={{ color: "var(--primary-light)" }}
          ></i>
          Program APBD
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
                  onClick={() => handleSort("kodeProgram")}
                >
                  Kode Program{sortIndicator("kodeProgram")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("namaProgram")}
                >
                  Nama Program{sortIndicator("namaProgram")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("created_at")}
                >
                  Tanggal Input{sortIndicator("created_at")}
                </th>
                <th className="no-print">Aksi</th>
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
                sortedData.map((program) => (
                  <tr key={program.idProgram}>
                    <td>{program.idProgram}</td>
                    <td>{program.kodeProgram}</td>
                    <td>{program.namaProgram}</td>
                    <td>{program.created_at}</td>
                    <td className="no-print">
                      <button
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => openEditModal(program)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(program.idProgram)}
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

        <FormProgramApbd
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          editData={selectedProgram}
          onSaveSuccess={handleSaveSuccess}
          showToast={showToast}
        />
      </div>
    </div>
  );
}

export default DataApbd;
