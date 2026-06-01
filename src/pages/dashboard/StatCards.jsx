import { useEffect, useRef } from "react";

function StatCard({
  icon,
  label,
  value,
  change,
  changeType,
  iconBg,
  valuePrefix,
}) {
  const valueRef = useRef(null);

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;

    let startTime = null;
    const duration = 1500;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * value);
      el.textContent = valuePrefix + current.toLocaleString("id-ID");
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value, valuePrefix]);

  return (
    <div className="col-6 col-md-3">
      <div className="stat-card">
        <div className="stat-card-header">
          <p className="stat-card-label">{label}</p>
          <div className="stat-card-icon" style={{ background: iconBg }}>
            <i className={"bi " + icon}></i>
          </div>
        </div>
        <div className="stat-card-value" ref={valueRef}>
          Rp 0
        </div>
        <div
          className={
            "stat-card-change " +
            (changeType === "up" ? "positive" : "negative")
          }
        >
          <i
            className={"bi bi-arrow-" + (changeType === "up" ? "up" : "down")}
          ></i>{" "}
          {change}
        </div>
      </div>
    </div>
  );
}

function StatCards() {
  return (
    <div className="row g-3 mb-4">
      <StatCard
        icon="bi-cash-stack"
        label="Total Pendapatan"
        value={12500000}
        change="+12.5% dari bulan lalu"
        changeType="up"
        iconBg="linear-gradient(135deg, #28a745, #20c997)"
        valuePrefix="Rp "
      />
      <StatCard
        icon="bi-cart"
        label="Total Pengeluaran"
        value={8200000}
        change="+5.2% dari bulan lalu"
        changeType="up"
        iconBg="linear-gradient(135deg, #dc3545, #e74c3c)"
        valuePrefix="Rp "
      />
      <StatCard
        icon="bi-graph-up-arrow"
        label="Laba Bersih"
        value={4300000}
        change="+18.7% dari bulan lalu"
        changeType="up"
        iconBg="linear-gradient(135deg, #0d6efd, #6610f2)"
        valuePrefix="Rp "
      />
      <StatCard
        icon="bi-arrow-left-right"
        label="Total Transaksi"
        value={1247}
        change="+8.3% dari bulan lalu"
        changeType="up"
        iconBg="linear-gradient(135deg, #6f42c1, #d63384)"
        valuePrefix="Rp "
      />
    </div>
  );
}

export default StatCards;
