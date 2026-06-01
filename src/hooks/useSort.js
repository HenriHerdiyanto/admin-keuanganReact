import { useState, useCallback } from "react";

export function useSort() {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = useCallback((key) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortOrder("asc");
      return key;
    });
  }, []);

  const sortIndicator = useCallback(
    (key) => {
      if (sortKey !== key) return null;
      return sortOrder === "asc" ? " \u2191" : " \u2193";
    },
    [sortKey, sortOrder],
  );

  const getSortedData = useCallback(
    (data) => {
      if (!sortKey) return data;

      return [...data].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA == null && valB == null) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        const comparison =
          typeof valA === "number"
            ? valA - valB
            : String(valA).localeCompare(String(valB));

        return sortOrder === "asc" ? comparison : -comparison;
      });
    },
    [sortKey, sortOrder],
  );

  return { sortKey, sortOrder, handleSort, sortIndicator, getSortedData };
}
