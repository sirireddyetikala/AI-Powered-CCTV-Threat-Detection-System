import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { AnalysisPage } from "./pages/AnalysisPage";
import { HistoryPage } from "./pages/HistoryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import CreditsExhaustedPage from "./pages/CreditsExhaustedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { DeploymentGuard } from "./components/DeploymentGuard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DeploymentGuard>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Page Route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Credits Exhausted Route */}
          <Route path="/credits-exhausted" element={<CreditsExhaustedPage />} />

          {/* Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route
                index
                element={<Navigate to="/dashboard/analysis" replace />}
              />
              <Route path="analysis" element={<AnalysisPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DeploymentGuard>
    </BrowserRouter>
  );
};

export default App;
