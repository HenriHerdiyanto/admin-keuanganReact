const icons = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-circle-fill",
};

export function showToast(message, type) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.innerHTML =
    '<div class="custom-toast-icon ' +
    type +
    '"><i class="bi ' +
    (icons[type] || icons.success) +
    '"></i></div>' +
    '<div class="custom-toast-content"><p>' +
    message +
    "</p><small>" +
    new Date().toLocaleTimeString("id-ID") +
    "</small></div>" +
    '<button class="custom-toast-close"><i class="bi bi-x"></i></button>';

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  toast.querySelector(".custom-toast-close").onclick = function () {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  };

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }
  }, 4000);
}
