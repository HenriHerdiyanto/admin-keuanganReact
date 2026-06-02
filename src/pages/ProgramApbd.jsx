import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import LoadingSkeleton from "./dashboard/LoadingSkeleton";

import DataProgramApbd from "./apbd/DataProgramApbd";
import DataKegiatanApbd from "./apbd/DataKegiatanApbd";
import SubKegiantanApbd from "./apbd/SubKegiantanApbd";

function ProgramApbd() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) return <LoadingSkeleton />;
  return (
    <>
      {location.pathname === "/program-apbd" && <DataProgramApbd />}
      {location.pathname === "/kegiatan-apbd" && <DataKegiatanApbd />}
      {location.pathname === "/subkegiatan-apbd" && <SubKegiantanApbd />}
    </>
  );
}
export default ProgramApbd;
