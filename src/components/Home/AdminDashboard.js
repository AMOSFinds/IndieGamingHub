import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase-config";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user || user.email !== "amogetswe.mashele@gmail.com") return; // restrict to admin only

      const docRef = doc(db, "adminStats", "summary");
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setStats(snapshot.data());
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Metrics</h1>
      {stats ? (
        <div className="space-y-2">
          <p>Total Users: {stats.totalUsers}</p>
          <p>Total Revenue: R{(stats.totalRevenue / 100).toFixed(2)}</p>
          <p>Total Pricing Queries: {stats.totalQueries}</p>
          <p>Last Updated: {stats.dateUpdated?.toDate().toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
}
