import { useState, useEffect, useContext, useMemo } from "react";
import Swal from "sweetalert2";
import { ThemeContext } from "../../contexts/ThemeContext";

function DataTransactions() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const getCharacters = async () => {
      try {
        const response = await fetch(
          "https://dragonball-api.com/api/characters",
        );

        const data = await response.json();

        setCharacters(data.items);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getCharacters();
  }, []);

  const filtered = useMemo(() => {
    let result = [...characters];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.race && r.race.toLowerCase().includes(q)) ||
          (r.affiliation && r.affiliation.toLowerCase().includes(q)),
      );
    }
    if (minDate) result = result.filter((r) => r.createdAt >= minDate);
    if (maxDate) result = result.filter((r) => r.createdAt <= maxDate);
    return result;
  }, [characters, search, minDate, maxDate]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Affiliation,Max Ki,Race,Gender"]
        .concat(
          characters.map(
            (char) =>
              `${char.name},${char.affiliation},${char.maxKi},${char.race},${char.gender}`,
          ),
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_transaksi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("DataTransaction").outerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Transaksi</title>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="content-card">
      <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h5 className="mb-0">
          <i
            className="bi bi-table me-2"
            style={{ color: "var(--primary-light)" }}
          ></i>
          Data Transaksi
        </h5>
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={exportCSV}>
            <i className="bi bi-file-earmark-excel me-1"></i> CSV
          </button>

          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <i className="bi bi-printer me-1"></i> Print
          </button>
          {/*
          <button className="btn btn-primary btn-sm" onClick={openAddModal}>
            <i className="bi bi-plus-circle me-1"></i> Tambah
          </button> */}
        </div>
      </div>
      <div className="card-body">
        <div className="row g-2 mb-3 align-items-end">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Cari nama, race, atau afiliasi..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control form-control-sm"
              title="Tanggal awal"
              value={minDate}
              onChange={(e) => { setMinDate(e.target.value); setPage(1); }}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control form-control-sm"
              title="Tanggal akhir"
              value={maxDate}
              onChange={(e) => { setMaxDate(e.target.value); setPage(1); }}
            />
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={() => { setSearch(""); setMinDate(""); setMaxDate(""); setPage(1); }}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table
            id="DataTransaction"
            className="table table-hover align-middle table-themed"
          >
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Max Ki</th>
                <th>Race</th>
                <th>Gender</th>
                <th style={{ width: "100px" }}>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                paged.map((char, index) => (
                  <tr key={char.id}>
                    <td>{(safePage - 1) * pageSize + index + 1}</td>

                    <td>
                      <img
                        src={char.image}
                        alt={char.name}
                        style={{
                          maxWidth: "50px",
                        }}
                      />
                    </td>

                    <td>
                      ({char.name})
                      <br />
                      {char.affiliation}
                    </td>

                    <td>{char.maxKi}</td>

                    <td>{char.race}</td>

                    <td>{char.gender}</td>

                    <td>
                      <button
                        className="btn btn-info btn-sm me-1"
                        onClick={() =>
                          Swal.fire(
                            "Detail",
                            JSON.stringify(char, null, 2),
                            "info",
                          )
                        }
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      <button className="btn btn-warning btn-sm me-1">
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button className="btn btn-danger btn-sm">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Menampilkan{" "}
            {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}-
            {Math.min(safePage * pageSize, filtered.length)} dari{" "}
            {filtered.length} data
          </small>
          {totalPages > 1 && (
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={"page-item" + (safePage <= 1 ? " disabled" : "")}>
                  <button className="page-link" onClick={() => setPage(page - 1)} disabled={safePage <= 1}>&laquo;</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <li key={num} className={"page-item" + (num === safePage ? " active" : "")}>
                    <button className="page-link" onClick={() => setPage(num)}>{num}</button>
                  </li>
                ))}
                <li className={"page-item" + (safePage >= totalPages ? " disabled" : "")}>
                  <button className="page-link" onClick={() => setPage(page + 1)} disabled={safePage >= totalPages}>&raquo;</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataTransactions;
