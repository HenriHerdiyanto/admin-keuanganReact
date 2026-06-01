function FilterTable({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset,
}) {
  return (
    <div className="row g-2 mb-3 align-items-end">
      <div className="col-md-5">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Cari transaksi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <input
          type="date"
          className="form-control form-control-sm"
          title="Tanggal awal"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <input
          type="date"
          className="form-control form-control-sm"
          title="Tanggal akhir"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="col-md-1">
        <button
          className="btn btn-outline-secondary btn-sm w-100"
          onClick={onReset}
          title="Reset Filter"
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
    </div>
  );
}

export default FilterTable;
