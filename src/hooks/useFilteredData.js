import { useMemo } from "react";
import { useFilter } from "./useFilter";

export function useFilteredData(data, searchFields, dateField = null) {
  const filter = useFilter();
  const { searchTerm, startDate, endDate } = filter;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchFields.some((field) => {
        const val = item[field];
        return val != null && String(val).toLowerCase().includes(searchTerm.toLowerCase());
      });

      let matchesDate = true;

      if (dateField) {
        const dateVal = item[dateField];
        if (dateVal) {
          const itemDate = new Date(dateVal).setHours(0, 0, 0, 0);

          if (startDate) {
            const start = new Date(startDate).setHours(0, 0, 0, 0);
            matchesDate = matchesDate && itemDate >= start;
          }
          if (endDate) {
            const end = new Date(endDate).setHours(0, 0, 0, 0);
            matchesDate = matchesDate && itemDate <= end;
          }
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [data, searchTerm, startDate, endDate, searchFields, dateField]);

  return { filteredData, ...filter };
}
