function ActionButtons({
  onExportExcel,
  onPrint,
  onAdd,
  addLabel = "Tambah",
}) {
  return (
    <div className="d-flex gap-2">
      <button className="btn btn-success btn-sm" onClick={onExportExcel}>
        <i className="bi bi-file-earmark-excel me-1"></i> Excel
      </button>

      <button className="btn btn-secondary btn-sm" onClick={onPrint}>
        <i className="bi bi-printer me-1"></i> Print
      </button>

      <button className="btn btn-primary btn-sm" onClick={onAdd}>
        <i className="bi bi-plus-circle me-1"></i> {addLabel}
      </button>
    </div>
  );
}

export default ActionButtons;
