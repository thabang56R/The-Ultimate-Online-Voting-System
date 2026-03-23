const FraudFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Risk Level
        </label>
        <select
          name="riskLevel"
          value={filters.riskLevel}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Review Status
        </label>
        <select
          name="reviewStatus"
          value={filters.reviewStatus}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All</option>
          <option value="pending_review">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="blocked">Blocked</option>
          <option value="confirmed_fraud">Confirmed Fraud</option>
          <option value="false_positive">False Positive</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          onClick={() =>
            setFilters({
              riskLevel: "",
              reviewStatus: "",
            })
          }
          className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FraudFilters;