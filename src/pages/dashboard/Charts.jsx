import { useContext, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ThemeContext } from "../../contexts/ThemeContext";

const labels = ["15 Mei", "16 Mei", "17 Mei", "18 Mei", "19 Mei", "20 Mei", "21 Mei"];
const pendapatanData = [12.5, 18.3, 15.7, 22.1, 19.8, 25.4, 20.2];
const pengeluaranData = [8.2, 10.5, 7.8, 12.3, 9.5, 11.8, 8.9];

function Charts() {
  const { darkMode } = useContext(ThemeContext);
  const lineRef = useRef(null);
  const barRef = useRef(null);
  const lineInstance = useRef(null);
  const barInstance = useRef(null);

  useEffect(() => {
    const colors = {
      grid: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      tick: darkMode ? "#9a9a9a" : "#888",
    };

    if (lineInstance.current) lineInstance.current.destroy();
    if (barInstance.current) barInstance.current.destroy();

    const lineCtx = lineRef.current.getContext("2d");
    const greenGrad = lineCtx.createLinearGradient(0, 0, 0, 250);
    greenGrad.addColorStop(0, "rgba(40, 167, 69, 0.4)");
    greenGrad.addColorStop(1, "rgba(40, 167, 69, 0.01)");
    const redGrad = lineCtx.createLinearGradient(0, 0, 0, 250);
    redGrad.addColorStop(0, "rgba(220, 53, 69, 0.4)");
    redGrad.addColorStop(1, "rgba(220, 53, 69, 0.01)");

    lineInstance.current = new Chart(lineCtx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Pendapatan",
            data: pendapatanData,
            borderColor: "#28a745",
            backgroundColor: greenGrad,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#28a745",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
          },
          {
            label: "Pengeluaran",
            data: pengeluaranData,
            borderColor: "#dc3545",
            backgroundColor: redGrad,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#dc3545",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: colors.tick, usePointStyle: true, padding: 16 },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (ctx) {
                return ctx.dataset.label + ": Rp" + ctx.parsed.y + "jt";
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: colors.grid },
            ticks: { color: colors.tick },
          },
          y: {
            grid: { color: colors.grid },
            ticks: {
              color: colors.tick,
              callback: function (v) {
                return "Rp" + v + "jt";
              },
            },
          },
        },
        interaction: { intersect: false, mode: "index" },
      },
    });

    const barCtx = barRef.current.getContext("2d");
    barInstance.current = new Chart(barCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Pendapatan",
            data: pendapatanData,
            backgroundColor: "rgba(40, 167, 69, 0.7)",
            borderColor: "#28a745",
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "Pengeluaran",
            data: pengeluaranData,
            backgroundColor: "rgba(220, 53, 69, 0.7)",
            borderColor: "#dc3545",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { color: colors.tick, usePointStyle: true, padding: 16 },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (ctx) {
                return ctx.dataset.label + ": Rp" + ctx.parsed.y + "jt";
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: colors.grid },
            ticks: { color: colors.tick },
          },
          y: {
            grid: { color: colors.grid },
            ticks: {
              color: colors.tick,
              callback: function (v) {
                return "Rp" + v + "jt";
              },
            },
          },
        },
        interaction: { intersect: false, mode: "index" },
      },
    });

    return () => {
      if (lineInstance.current) lineInstance.current.destroy();
      if (barInstance.current) barInstance.current.destroy();
    };
  }, [darkMode]);

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-6">
        <div className="content-card">
          <div className="card-header">
            <h5>
              <i className="bi bi-graph-up me-2" style={{ color: "var(--primary-light)" }}></i>
              Grafik Pendapatan & Pengeluaran
            </h5>
          </div>
          <div className="card-body">
            <div style={{ height: "280px" }}>
              <canvas ref={lineRef}></canvas>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="content-card">
          <div className="card-header">
            <h5>
              <i className="bi bi-bar-chart-fill me-2" style={{ color: "var(--primary-light)" }}></i>
              Perbandingan Bulanan
            </h5>
          </div>
          <div className="card-body">
            <div style={{ height: "280px" }}>
              <canvas ref={barRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
