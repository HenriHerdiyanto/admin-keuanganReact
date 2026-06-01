import * as XLSX from "xlsx";
import { showToast } from "./toast";

export function exportToExcel({ data, columns, sheetName, fileName }) {
  if (!data || data.length === 0) {
    showToast("Tidak ada data untuk diexport!", "error");
    return;
  }

  const dataForExport = data.map((item, index) => {
    const row = { No: index + 1 };
    columns.forEach((col) => {
      row[col.header] = item[col.accessor];
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataForExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const colWidths = Object.keys(dataForExport[0] || {}).map((key) => {
    const maxLen = Math.max(
      ...dataForExport.map((row) => String(row[key] || "").length),
      key.length,
    );
    return { wch: maxLen + 2 };
  });
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
  showToast("Berhasil mendownload file Excel!", "success");
}
