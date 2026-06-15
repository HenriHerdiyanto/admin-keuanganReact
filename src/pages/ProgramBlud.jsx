import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import LoadingSkeleton from "./dashboard/LoadingSkeleton";

import DataProgramApbd from "./apbd/DataProgramApbd";
import DataKegiatanApbd from "./apbd/DataKegiatanApbd";
import SubKegiantanApbd from "./apbd/SubKegiantanApbd";
import LaporanApbd from "./apbd/LaporanApbd";

function ProgramBlud() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) return <LoadingSkeleton />;
  return (
    <>
      {location.pathname === "/program-blud" && <DataProgramApbd />}
      {location.pathname === "/kegiatan-blud" && <DataKegiatanApbd />}
      {location.pathname === "/subkegiatan-blud" && <SubKegiantanApbd />}
      {location.pathname === "/laporan-blud" && <LaporanApbd />}
    </>
  );
}
export default ProgramBlud;
