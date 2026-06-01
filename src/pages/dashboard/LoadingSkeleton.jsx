function LoadingSkeleton() {
  return (
    <div id="loadingSkeleton">
      <div className="skeleton-wrapper">
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="skeleton skeleton-card"></div>
          </div>
          <div className="col-6 col-md-3">
            <div className="skeleton skeleton-card"></div>
          </div>
          <div className="col-6 col-md-3">
            <div className="skeleton skeleton-card"></div>
          </div>
          <div className="col-6 col-md-3">
            <div className="skeleton skeleton-card"></div>
          </div>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="skeleton skeleton-chart"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton skeleton-chart"></div>
          </div>
        </div>
        <div className="skeleton skeleton-table mb-3"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-row"></div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
