import React, { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

function FormSubKegiatanBlud({
  modalOpen,
  setModalOpen,
  editData,
  onSaveSuccess,
  showToast,
  dataKegiatan,
}) {
  const [form, setForm] = useState({
    idKegiatan: "",
    kodeSubKegiatan: "",
    namaSubKegiatan: "",
  });

  const options = Array.isArray(dataKegiatan)
    ? dataKegiatan.map((item) => ({
        value: item.id,
        label: item.namaKegiatan,
      }))
    : [];
  useEffect(() => {
    if (editData) {
      setForm({
        idKegiatan: editData.idKegiatan || editData.id_kegiatan || "",
        kodeSubKegiatan: editData.kodeSubKegiatan || "",
        namaSubKegiatan: editData.namaSubKegiatan || "",
      });
    } else {
      setForm({
        idKegiatan: "",
        kodeSubKegiatan: "",
        namaSubKegiatan: "",
      });
    }
  }, [editData, modalOpen]);

  if (!modalOpen) return null;

  const handleSave = async () => {
    if (!form.idKegiatan || !form.kodeSubKegiatan || !form.namaSubKegiatan) {
      showToast("Harap isi semua field!", "error");
      return;
    }

    const editId = editData?.id;

    const result = await Swal.fire({
      title: editId ? "Update Data?" : "Simpan Data?",
      html: editId
        ? `Apakah Anda yakin ingin mengubah data <b>${form.namaSubKegiatan}</b>?`
        : `Apakah Anda yakin ingin menyimpan data <b>${form.namaSubKegiatan}</b>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Batal",
      confirmButtonText: "Simpan",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      const url = editId
        ? `http://20.2.2.230/simkeu/public/api/data_sub_kegiatan_blud/${editId}`
        : "http://20.2.2.230/simkeu/public/api/data_sub_kegiatan_blud";

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

      const kegiatanData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: editId ? "Data berhasil diperbarui." : "Data berhasil disimpan.",
        timer: 1500,
        showConfirmButton: false,
      });

      onSaveSuccess(kegiatanData, editId);
      console.log("Data kegiatan yang disimpan:", kegiatanData);
      setModalOpen(false);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Gagal menyimpan data!",
      });
    }
  };

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={() => setModalOpen(false)}
      ></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div
              className={`modal-header bg-${editData ? "success" : "primary"} text-white`}
            >
              <h6 className="modal-title" id="modalTitle">
                <i
                  className={`bi ${editData ? "bi-pencil" : "bi-plus-circle"} me-2 text-white`}
                ></i>
                {editData ? "Edit Sub Kegiatan" : "Tambah Sub Kegiatan"}
              </h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalOpen(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form id="transaksiForm" onSubmit={(e) => e.preventDefault()}>
                <input type="hidden" id="editId" value={editData?.id || ""} />
                <div className="mb-3">
                  <label className="form-label">Kegiatan</label>
                  <Select
                    className="text-dark"
                    options={options}
                    value={options.find(
                      (option) => option.value === form.idKegiatan,
                    )}
                    onChange={(selectedOption) =>
                      setForm({
                        ...form,
                        idKegiatan: selectedOption.value,
                      })
                    }
                    placeholder="Pilih Kegiatan"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Kode Sub Kegiatan</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan kode sub kegiatan"
                    value={form.kodeSubKegiatan}
                    onChange={(e) =>
                      setForm({ ...form, kodeSubKegiatan: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nama Sub Kegiatan</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nama sub kegiatan"
                    value={form.namaSubKegiatan}
                    onChange={(e) =>
                      setForm({ ...form, namaSubKegiatan: e.target.value })
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
                className={`btn ${editData ? "btn-success" : "btn-primary"} text-white`}
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

export default FormSubKegiatanBlud;
