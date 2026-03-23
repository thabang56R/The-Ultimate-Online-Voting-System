import { useEffect, useState } from "react";
import FraudStatCards from "../components/dashboard/FraudStatCards";
import FraudFilters from "../components/dashboard/FraudFilters";
import FraudReviewsTable from "../components/dashboard/FraudReviewsTable";
import {
  fetchFraudReviews,
  fetchFraudReviewStats,
  updateFraudReviewStatus,
} from "../services/fraudReviewService";

const FraudReviewPage = () => {
  const [stats, setStats] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    riskLevel: "",
    reviewStatus: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, reviewsRes] = await Promise.all([
        fetchFraudReviewStats(),
        fetchFraudReviews(filters),
      ]);

      setStats(statsRes?.stats || {});
      setReviews(reviewsRes?.reviews || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load fraud reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.riskLevel, filters.reviewStatus]);

  const handleUpdateStatus = async (reviewId, reviewStatus, note) => {
    try {
      setLoadingAction(reviewId);
      await updateFraudReviewStatus(reviewId, reviewStatus, note);
      await loadData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update fraud review");
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Fraud Review Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Monitor ML fraud scoring, review suspicious votes, and record admin decisions.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <FraudStatCards stats={stats} />

      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <FraudFilters filters={filters} setFilters={setFilters} />
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm border border-gray-100">
          Loading fraud review data...
        </div>
      ) : (
        <FraudReviewsTable
          reviews={reviews}
          onUpdateStatus={handleUpdateStatus}
          loadingAction={loadingAction}
        />
      )}
    </div>
  );
};

export default FraudReviewPage;