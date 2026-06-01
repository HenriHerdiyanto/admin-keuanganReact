import { useState, useEffect } from "react";
import LoadingSkeleton from "./dashboard/LoadingSkeleton";
import DataTransactions from "./transactions/DataTransactions";

function Transactions() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <DataTransactions />
    </>
  );
}

export default Transactions;
