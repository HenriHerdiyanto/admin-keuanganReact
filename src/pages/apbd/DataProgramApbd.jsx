import { useEffect, useState } from "react";
import FormProgramApbd from "../../components/apbd/FormProgramApbd";
import FilterTable from "../filter/FilterTable";
import ActionButtons from "../filter/ActionButtons";
import { confirmDelete } from "../../hooks/deleteHandler";
import { useFilteredData } from "../../hooks/useFilteredData";
import { useSort } from "../../hooks/useSort";
import { exportToExcel } from "../../utils/exportExcel";
import { showToast } from "../../utils/toast";
import "../../index.css";

function DataApbd() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
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

  const fetchDataProgram = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://20.2.2.230/simkeu/public/api/data_apbd?page=${page}`,
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataProgram(currentPage);
  }, [currentPage]);

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
      fetchDataProgram(currentPage);
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
                sortedData.map((program, index) => (
                  <tr key={program.idProgram}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
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
