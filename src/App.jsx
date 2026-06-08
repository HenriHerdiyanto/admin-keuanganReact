import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./pages/layout/AdminLayout";
import Transactions from "./pages/Transactions";
import DataProgramApbd from "./pages/apbd/DataProgramApbd";
import DataKegiatanApbd from "./pages/apbd/DataKegiatanApbd";
import SubKegiantanApbd from "./pages/apbd/SubKegiantanApbd";
import ProtectedRoute from "./components/ProtectedRoute";
import LaporanApbd from "./pages/apbd/LaporanApbd";

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
