import React, { useState, useEffect } from "react";

function FormProgramBlud({
  modalOpen,
  setModalOpen,
  editData,
  onSaveSuccess,
  showToast,
}) {
  const [form, setForm] = useState({
    kodeProgram: "",
    namaProgram: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        kodeProgram: editData.kodeProgram || "",
        namaProgram: editData.namaProgram || "",
      });
    } else {
      setForm({
        kodeProgram: "",
        namaProgram: "",
      });
    }
  }, [editData, modalOpen]);

  if (!modalOpen) return null;

  const handleSave = async () => {
    if (!form.kodeProgram || !form.namaProgram) {
      showToast("Harap isi semua field!", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const editId = editData?.idProgram;

      const url = editId
        ? `http://20.2.2.230/simkeu/public/api/data_blud/${editId}`
        : "http://20.2.2.230/simkeu/public/api/data_blud";

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.message || "Gagal menyimpan data");
      }

      const programData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      onSaveSuccess(programData, editId);

      setModalOpen(false);
    } catch (error) {
      console.error(error);
      showToast(error.message || "Gagal menyimpan data!", "error");
    }
  };

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={() => setModalOpen(false)}
      ></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="modalTitle">
                <i
                  className={`bi ${editData ? "bi-pencil" : "bi-plus-circle"} me-2`}
                  style={{ color: "var(--primary-light)" }}
                ></i>
                {editData ? "Edit Program" : "Tambah Program"}
              </h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalOpen(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form id="transaksiForm" onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label className="form-label">Kode Program</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan kode program"
                    value={form.kodeProgram}
                    onChange={(e) =>
                      setForm({ ...form, kodeProgram: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nama Program</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nama program"
                    value={form.namaProgram}
                    onChange={(e) =>
                      setForm({ ...form, namaProgram: e.target.value })
                    }
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                id="saveBtn"
              >
                <i className="bi bi-check-lg me-1"></i> Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormProgramBlud;
