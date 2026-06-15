import { useContext, useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";

import { ThemeContext } from "../../contexts/ThemeContext";
import "../../assets/css/dashboard.css";
import Swal from "sweetalert2";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarShow, setSidebarShow] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [programMenuOpen, setProgramMenuOpen] = useState(false);
  const [bludMenuOpen, setBludMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // =========================
  // ACTIVE MENU
  // =========================

  const isProgramMenuOpen =
    programMenuOpen ||
    location.pathname === "/program-apbd" ||
    location.pathname === "/kegiatan-apbd" ||
    location.pathname === "/subkegiatan-apbd" ||
    location.pathname === "/laporan-apbd";

  const isBludMenuOpen =
    bludMenuOpen ||
    location.pathname === "/program-blud" ||
    location.pathname === "/kegiatan-blud" ||
    location.pathname === "/subkegiatan-blud" ||
    location.pathname === "/laporan-blud";

  // =========================
  // AUTH CHECK
  // =========================

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/");
    }
  }, [navigate]);

  // =========================
  // CLOSE DROPDOWN OUTSIDE CLICK
  // =========================

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // =========================
  // BACK TO TOP
  // =========================

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 300);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================
  // RESPONSIVE SIDEBAR
  // =========================

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setSidebarShow(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================
  // TOGGLE SIDEBAR
  // =========================

  function toggleSidebar() {
    if (window.innerWidth < 768) {
      setSidebarShow((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Apakah Anda yakin ingin keluar dari aplikasi?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://20.2.2.230/simkeu/public/api/logout",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Anda berhasil logout.",
          timer: 1500,
          showConfirmButton: false,
        });

        localStorage.clear();
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Logout gagal.",
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Tidak dapat terhubung ke server.",
      });
    }
  };

  // =========================
  // CLOSE SIDEBAR MOBILE & PROGRAM MENU
  // =========================

  function closeSidebarMobile() {
    if (window.innerWidth < 768) {
      setSidebarShow(false);
    }
    setProgramMenuOpen(false);
    setBludMenuOpen(false);
  }

  // =========================
  // TOGGLE PROGRAM MENU
  // =========================

  function toggleProgramMenu() {
    setProgramMenuOpen((prev) => !prev);
  }

  // =========================
  // TOGGLE BLUD MENU
  // =========================

  function toggleBludMenu() {
    setBludMenuOpen((prev) => !prev);
  }

  // =========================
  // SIDEBAR CLASS
  // =========================

  const sidebarClass = [
    "sidebar",
    sidebarCollapsed ? "collapsed" : "",
    sidebarShow ? "show" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className="wrapper">
        {/* BACKDROP */}
        <div
          className={`sidebar-backdrop ${sidebarShow ? "show" : ""}`}
          onClick={() => setSidebarShow(false)}
        />

        {/* SIDEBAR */}
        <aside className={sidebarClass}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <i className="bi bi-wallet2"></i>
              <span>Admin Keuangan</span>
            </div>

            <button
              className="sidebar-close"
              onClick={() => setSidebarShow(false)}
            >
              &times;
            </button>
          </div>

          <ul className="sidebar-menu">
            {/* DASHBOARD */}
            <li className="sidebar-item">
              <NavLink
                to="/dashboard"
                onClick={closeSidebarMobile}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-grid-fill"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>

            {/* PROGRAM APBD */}
            <li className="sidebar-item">
              <div
                className={`sidebar-link d-flex justify-content-between align-items-center ${
                  isProgramMenuOpen ? "active" : ""
                }`}
                onClick={toggleProgramMenu}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <i className="bi bi-arrow-left-right me-2"></i>
                  <span>Program APBD</span>
                </div>

                <i
                  className={`bi bi-chevron-down ${isProgramMenuOpen ? "rotated" : ""}`}
                ></i>
              </div>

              <div className={`submenu ${isProgramMenuOpen ? "open" : ""}`}>
                <ul className="list-unstyled ps-4 mt-2">
                  <li>
                    <NavLink
                      to="/program-apbd"
                      onClick={closeSidebarMobile}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      Data Program
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/kegiatan-apbd"
                      onClick={closeSidebarMobile}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      Data Kegiatan
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/subkegiatan-apbd"
                      onClick={closeSidebarMobile}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      Sub Kegiatan
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/laporan-apbd"
                      onClick={closeSidebarMobile}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      Laporan APBD
                    </NavLink>
                  </li>
                </ul>
              </div>
            </li>

            {/* PROGRAM BLUD */}
            <li className="sidebar-item">
              <div
                className={`sidebar-link d-flex justify-content-between align-items-center ${
                  isBludMenuOpen ? "active" : ""
                }`}
                onClick={toggleBludMenu}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <i className="bi bi-arrow-left-right me-2"></i>
                  <span>Program BLUD</span>
                </div>

                <i
                  className={`bi bi-chevron-down ${isBludMenuOpen ? "rotated" : ""}`}
                ></i>
              </div>

              <div className={`submenu ${isBludMenuOpen ? "open" : ""}`}>
                <ul className="list-unstyled ps-4 mt-2">
                  <li>
                    <NavLink
                      to="/program-blud"
                      onClick={closeSidebarMobile}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      Data Program
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/kegiatan-blud"
                      onClick={closeSidebarMobile}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      Data Kegiatan
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/subkegiatan-blud"
                      onClick={closeSidebarMobile}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      Sub Kegiatan
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/laporan-blud"
                      onClick={closeSidebarMobile}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      Laporan BLUD
                    </NavLink>
                  </li>
                </ul>
              </div>
            </li>

            {/* TRANSAKSI */}
            <li className="sidebar-item">
              <NavLink
                to="/transactions"
                onClick={closeSidebarMobile}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-arrow-left-right"></i>
                <span>Transaksi</span>
              </NavLink>
            </li>

            {/* USERS */}
            <li className="sidebar-item">
              <NavLink
                to="/users"
                onClick={closeSidebarMobile}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-people-fill"></i>
                <span>Pengguna</span>
              </NavLink>
            </li>

            {/* LAPORAN */}
            <li className="sidebar-item">
              <button className="sidebar-link border-0 bg-transparent w-100 text-start">
                <i className="bi bi-file-earmark-bar-graph-fill"></i>
                <span>Laporan</span>
              </button>
            </li>

            {/* PENGATURAN */}
            <li className="sidebar-item">
              <button className="sidebar-link border-0 bg-transparent w-100 text-start">
                <i className="bi bi-gear-fill"></i>
                <span>Pengaturan</span>
              </button>
            </li>
          </ul>

          {/* FOOTER */}
          <div className="sidebar-footer">
            <div className="d-flex align-items-center gap-2">
              <i
                className="bi bi-person-circle"
                style={{
                  fontSize: "1.3rem",
                  color: "var(--primary-light)",
                }}
              ></i>

              <div className="user-info">
                <small
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.6,
                  }}
                >
                  Login sebagai
                </small>

                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Admin
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="main-content">
          {/* NAVBAR */}
          <nav className="navbar-custom">
            <div className="navbar-brand-mobile">
              <i
                className="bi bi-wallet2"
                style={{
                  color: "var(--primary-light)",
                }}
              ></i>

              <span>Admin Keuangan</span>
            </div>

            <button className="navbar-toggler" onClick={toggleSidebar}>
              <i className="bi bi-list"></i>
            </button>

            {/* SEARCH */}
            <div className="navbar-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Cari transaksi..."
                id="globalSearch"
              />
            </div>

            {/* RIGHT MENU */}
            <div className="navbar-right">
              {/* DARK MODE */}
              <div className="dark-switch">
                <i className="bi bi-moon-stars-fill"></i>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                </div>

                <i className="bi bi-sun-fill"></i>
              </div>

              {/* NOTIFICATION */}
              <div className="notif-dropdown" ref={notifRef}>
                <button
                  className="notif-btn"
                  onClick={() => {
                    setNotifOpen((prev) => !prev);
                    setProfileOpen(false);
                  }}
                >
                  <i className="bi bi-bell-fill"></i>

                  <span className="notif-badge">3</span>
                </button>

                <div className={`notif-menu ${notifOpen ? "show" : ""}`}>
                  <div className="notif-header">
                    <h6>Notifikasi</h6>

                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none"
                    >
                      Tandai dibaca
                    </button>
                  </div>

                  <div className="notif-item">
                    <div
                      className="notif-item-icon"
                      style={{
                        background: "rgba(40,167,69,0.15)",
                        color: "#28a745",
                      }}
                    >
                      <i className="bi bi-check-circle-fill"></i>
                    </div>

                    <div className="notif-item-content">
                      <p>Transaksi baru berhasil ditambahkan</p>
                      <small>5 menit yang lalu</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROFILE */}
              <div className="profile-dropdown" ref={profileRef}>
                <button
                  className="profile-btn"
                  onClick={() => {
                    setProfileOpen((prev) => !prev);
                    setNotifOpen(false);
                  }}
                >
                  <div className="profile-avatar">A</div>

                  <span>Admin</span>
                </button>

                <div className={`profile-menu ${profileOpen ? "show" : ""}`}>
                  <button className="profile-menu-item">
                    <i className="bi bi-person"></i>
                    Profil Saya
                  </button>

                  <button className="profile-menu-item">
                    <i className="bi bi-shield-lock"></i>
                    Keamanan
                  </button>

                  <div className="profile-divider"></div>

                  <button
                    className="profile-menu-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* PAGE */}
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className="toast-container" id="toastContainer"></div>

      {/* BACK TO TOP */}
      <button
        className={`back-to-top ${showBackToTop ? "show" : ""}`}
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        <i className="bi bi-arrow-up"></i>
      </button>
    </>
  );
}

export default AdminLayout;
