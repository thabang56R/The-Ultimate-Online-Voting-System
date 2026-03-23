import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import VoterRoute from "./routes/VoterRoute";

import HomePage from "./pages/HomePage";
import ElectionsListPage from "./pages/ElectionsListPage";
import ElectionDetailsPage from "./pages/ElectionDetailsPage";
import VoterLoginPage from "./pages/VoterLoginPage";
import VoterDashboardPage from "./pages/VoterDashboardPage";
import ResultsPage from "./pages/ResultsPage";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ElectionsPage from "./pages/ElectionsPage";
import CandidatesPage from "./pages/CandidatesPage";
import ReviewQueuePage from "./pages/ReviewQueuePage";
import RiskEventsPage from "./pages/RiskEventsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import FraudReviewPage from "./pages/FraudReviewPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/elections" element={<ElectionsListPage />} />
          <Route path="/elections/:id" element={<ElectionDetailsPage />} />
          <Route path="/results" element={<ResultsPage />} />

          <Route path="/voter/login" element={<VoterLoginPage />} />
          <Route
            path="/voter/dashboard"
            element={
              <VoterRoute>
                <VoterDashboardPage />
              </VoterRoute>
            }
          />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/elections"
            element={
              <AdminRoute>
                <ElectionsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/candidates"
            element={
              <AdminRoute>
                <CandidatesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/review-queue"
            element={
              <AdminRoute>
                <ReviewQueuePage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/risk-events"
            element={
              <AdminRoute>
                <RiskEventsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/fraud-reviews"
            element={
              <AdminRoute>
                <FraudReviewPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <AdminRoute>
                <AuditLogsPage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
