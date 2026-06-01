import Swal from "sweetalert2";
import { showToast } from "../utils/toast";

export function confirmDelete({ url, id, itemName, onSuccess }) {
  Swal.fire({
    title: "Apakah Anda yakin?",
    html: itemName
      ? `Data <b>"${itemName}"</b> yang dihapus tidak dapat dikembalikan!`
      : undefined,
    text: itemName ? undefined : "Data yang dihapus tidak dapat dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
  }).then((result) => {
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");

      fetch(`${url}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Gagal menghapus data");
          onSuccess?.();
          showToast("Data berhasil dihapus!", "success");
        })
        .catch((error) => {
          console.log(error);
          showToast("Gagal menghapus data!", "error");
        });
    }
  });
}
