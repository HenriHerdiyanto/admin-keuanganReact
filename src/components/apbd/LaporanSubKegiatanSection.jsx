import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import LaporanItemRow from "./LaporanItemRow";

function LaporanSubKegiatanSection({ sub, expandedItems, onToggle }) {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div key={sub.idSubKegiatan}>
      <div
        className="px-3 py-2 fw-semibold small"
        style={{
          background: darkMode ? "#222" : "#f0f0f0",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <i className="bi bi-folder me-2 text-info"></i>
        {sub.namaSubKegiatan}
      </div>

      {sub.items.map((item) => (
        <LaporanItemRow
          key={item.idItemSubKegiatan}
          item={item}
          isExpanded={expandedItems[item.idItemSubKegiatan] || false}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

export default LaporanSubKegiatanSection;
