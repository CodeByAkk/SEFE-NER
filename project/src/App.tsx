import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute, PublicOnly } from './auth/guards';
import { TopBar } from './components/TopBar';
import { Toasts, Footer } from './components/ui';
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPage, VerifyPage } from './pages/AuthExtra';
import { ProfilePage, ChangePwPage } from './pages/Account';
import { DemoRolePage } from './pages/Demo';
import { AdminDash } from './pages/AdminDash';
import { UsersPage } from './pages/Users';
import { AuditPage, AlertsAdmin } from './pages/AuditAlerts';
import { DistrictDash } from './pages/District';
import { FieldDash } from './pages/Field';
import { CitizenDash } from './pages/Citizen';
import { NotFound, SetupPage } from './pages/Misc';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TopBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/demo/:role" element={<DemoRolePage />} />
          <Route element={<PublicOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPage />} />
            <Route path="/verify-email" element={<VerifyPage />} />
          </Route>
          <Route element={<ProtectedRoute allow={['admin']} />}>
            <Route path="/admin" element={<AdminDash />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/audit" element={<AuditPage />} />
            <Route path="/admin/alerts" element={<AlertsAdmin />} />
          </Route>
          <Route element={<ProtectedRoute allow={['district_officer']} />}>
            <Route path="/district-officer" element={<DistrictDash />} />
          </Route>
          <Route element={<ProtectedRoute allow={['field_officer']} />}>
            <Route path="/field-officer" element={<FieldDash />} />
          </Route>
          <Route element={<ProtectedRoute allow={['citizen']} />}>
            <Route path="/citizen" element={<CitizenDash />} />
          </Route>
          <Route element={<ProtectedRoute allow={['admin', 'district_officer', 'field_officer', 'citizen']} />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePwPage />} />
          </Route>
          <Route element={<ProtectedRoute allow={['admin', 'district_officer']} />}>
            <Route path="/alerts" element={<AlertsAdmin />} />
          </Route>
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toasts />
      </AuthProvider>
    </BrowserRouter>
  );
}
