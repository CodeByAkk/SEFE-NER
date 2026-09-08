import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ToastContainer } from '@/components/Toast';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { RiskMapPage } from '@/pages/RiskMapPage';
import { RiskPredictionPage } from '@/pages/RiskPredictionPage';
import { RiskForecastPage } from '@/pages/RiskForecastPage';
import { IncidentReportsPage } from '@/pages/IncidentReportsPage';
import { AiImageAnalysisPage } from '@/pages/AiImageAnalysisPage';
import { InfrastructurePage } from '@/pages/InfrastructurePage';
import { AlertsPage } from '@/pages/AlertsPage';
import { EmergencyResponsePage } from '@/pages/EmergencyResponsePage';
import { HistoricalAnalysisPage } from '@/pages/HistoricalAnalysisPage';
import { SensorMonitoringPage } from '@/pages/SensorMonitoringPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ProfilePage } from '@/pages/ProfilePage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <Dashboard />
                </div>
              </Layout>
            }
          />
          <Route
            path="/risk-map"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <RiskMapPage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/risk-prediction"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <RiskPredictionPage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/risk-forecast"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <RiskForecastPage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/incident-reports"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <IncidentReportsPage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/ai-image-analysis"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <AiImageAnalysisPage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/infrastructure"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <InfrastructurePage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/alerts"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <AlertsPage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/emergency-response"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <EmergencyResponsePage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/historical-analysis"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <HistoricalAnalysisPage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/sensor-monitoring"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <SensorMonitoringPage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <SettingsPage />
                </div>
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                  <ProfilePage />
                </div>
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
