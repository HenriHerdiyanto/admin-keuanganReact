import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./pages/layout/AdminLayout";
import Transactions from "./pages/Transactions";
import DataProgramApbd from "./pages/apbd/DataProgramApbd";
import DataKegiatanApbd from "./pages/apbd/DataKegiatanApbd";
import SubKegiantanApbd from "./pages/apbd/SubKegiantanApbd";
import LaporanApbd from "./pages/apbd/LaporanApbd";
import ProtectedRoute from "./components/ProtectedRoute";

import DataProgramBlud from "./pages/blud/DataProgramBlud";
import DataKegiatanBlud from "./pages/blud/DataKegiatanBlud";
import SubKegiatanBlud from "./pages/blud/SubKegiatanBlud";
import LaporanBlud from "./pages/blud/LaporanBlud";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<AdminLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* route APBD */}
          <Route
            path="/program-apbd"
            element={
              <ProtectedRoute>
                <DataProgramApbd />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kegiatan-apbd"
            element={
              <ProtectedRoute>
                <DataKegiatanApbd />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subkegiatan-apbd"
            element={
              <ProtectedRoute>
                <SubKegiantanApbd />
              </ProtectedRoute>
            }
          />

          <Route
            path="/laporan-apbd"
            element={
              <ProtectedRoute>
                <LaporanApbd />
              </ProtectedRoute>
            }
          />

          {/* route BLUD */}
          <Route
            path="/program-blud"
            element={
              <ProtectedRoute>
                <DataProgramBlud />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kegiatan-blud"
            element={
              <ProtectedRoute>
                <DataKegiatanBlud />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subkegiatan-blud"
            element={
              <ProtectedRoute>
                <SubKegiatanBlud />
              </ProtectedRoute>
            }
          />

          <Route
            path="/laporan-blud"
            element={
              <ProtectedRoute>
                <LaporanBlud />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
