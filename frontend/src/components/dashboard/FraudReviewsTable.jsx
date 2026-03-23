import { useState } from "react";

const badgeClasses = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
  pending_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  blocked: "bg-red-100 text-red-700",
  confirmed_fraud: "bg-red-100 text-red-800",
  false_positive: "bg-gray-100 text-gray-700",
};

const FraudReviewsTable = ({ reviews, onUpdateStatus, loadingAction }) => {
  const [notes, setNotes] = useState({});

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Fraud Reviews</h2>
        <p className="text-sm text-gray-500">
          Review suspicious votes and update their fraud status.
        </p>
      </div>

      <div className="space-y-4">
        {reviews?.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            No fraud review records found.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-2xl border border-gray-200 p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        badgeClasses[review.riskLevel] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {review.riskLevel?.toUpperCase()}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        badgeClasses[review.reviewStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {review.reviewStatus}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Risk Score: {review.riskScore}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Election:</span>{" "}
                      {review.electionId?.title || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Voter:</span>{" "}
                      {review.voterId?.name || review.voterId?.email || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Model:</span>{" "}
                      {review.modelVersion || "unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Explanation
                    </p>
                    <p className="text-sm text-gray-600">
                      {review.explanation || "No explanation available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">Flags</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {review.flags?.length ? (
                        review.flags.map((flag) => (
                          <span
                            key={flag}
                            className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700"
                          >
                            {flag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No flags</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Top Reasons
                    </p>
                    <div className="mt-1 space-y-1">
                      {review.topReasons?.length ? (
                        review.topReasons.map((reason, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            • {reason.feature}:{" "}
                            <span className="font-medium">{String(reason.value)}</span>{" "}
                            ({reason.impact})
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No top reasons</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-3">
                  <textarea
                    value={notes[review._id] || ""}
                    onChange={(e) => handleNoteChange(review._id, e.target.value)}
                    placeholder="Add admin decision note..."
                    className="min-h-[100px] w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        onUpdateStatus(review._id, "approved", notes[review._id] || "")
                      }
                      disabled={loadingAction === review._id}
                      className="rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        onUpdateStatus(review._id, "blocked", notes[review._id] || "")
                      }
                      disabled={loadingAction === review._id}
                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      Block
                    </button>

                    <button
                      onClick={() =>
                        onUpdateStatus(
                          review._id,
                          "confirmed_fraud",
                          notes[review._id] || ""
                        )
                      }
                      disabled={loadingAction === review._id}
                      className="rounded-xl bg-red-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                    >
                      Confirm Fraud
                    </button>

                    <button
                      onClick={() =>
                        onUpdateStatus(
                          review._id,
                          "false_positive",
                          notes[review._id] || ""
                        )
                      }
                      disabled={loadingAction === review._id}
                      className="rounded-xl bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                    >
                      False Positive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FraudReviewsTable;