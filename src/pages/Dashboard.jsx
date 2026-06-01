import { useState, useEffect } from "react";
import LoadingSkeleton from "./dashboard/LoadingSkeleton";
import StatCards from "./dashboard/StatCards";
import Charts from "./dashboard/Charts";
import TransactionsTable from "./dashboard/TransactionsTable";

function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <StatCards />
      <Charts />
      <TransactionsTable />
    </>
  );
}

export default Dashboard;
