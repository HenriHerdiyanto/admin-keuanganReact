import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";

function Login() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    if (saved) document.body.classList.add("dark-mode");
    return saved;
  });
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("rememberUsername") || "";
  });
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem("rememberUsername");
  });

  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(
        "http://20.2.2.230/simkeu/public/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // simpan status login
        localStorage.setItem("isLoggedIn", "true");

        // simpan token
        localStorage.setItem("token", data.token);

        // simpan data user
        localStorage.setItem("user", JSON.stringify(data.user));

        // remember me
        if (rememberMe) {
          localStorage.setItem("rememberUsername", username);
        } else {
          localStorage.removeItem("rememberUsername");
        }

        // redirect
        navigate("/dashboard");
      } else {
        setError("Nama pengguna atau password salah");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="login-page">
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>

      <button
        className="dark-toggle"
        id="darkToggle"
        title="Toggle Dark Mode"
        onClick={toggleDarkMode}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="login-container animate__animated animate__fadeInUp">
        <div className="login-card">
          <div className="login-icon">
            <i className="bi bi-wallet2"></i>
          </div>
          <h1 className="login-title">Admin Keuangan</h1>
          <p className="login-subtitle">Silakan masuk ke akun Anda</p>

          {error && (
            <div className="login-error">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <form id="loginForm" autoComplete="off" onSubmit={handleSubmit}>
            <div className="form-floating">
              <i className="bi bi-envelope-fill input-icon"></i>
              <input
                type="username"
                className="form-control"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="username">Nama Pengguna</label>
            </div>
            <div className="form-floating">
              <i className="bi bi-lock-fill input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Kata Sandi</label>
              <button
                type="button"
                className="password-toggle"
                id="passwordToggle"
                tabIndex="-1"
                onClick={togglePassword}
              >
                <i
                  className={
                    showPassword ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
                  }
                ></i>
              </button>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Ingat saya
              </label>
            </div>
            <button type="submit" className="btn-login" id="loginBtn">
              <span className="btn-text">
                <i className="bi bi-box-arrow-in-right me-2"></i>Masuk
              </span>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              ></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
