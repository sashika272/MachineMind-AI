import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { MachineProvider } from './context/MachineContext';
import { AppLayout } from './components/layout/AppLayout';

// All 16 complete screen modules
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { Visualization3DPage } from './pages/Visualization3DPage';
import { FaultDetectionPage } from './pages/FaultDetectionPage';
import { RootCausePage } from './pages/RootCausePage';
import { RepairStrategiesPage } from './pages/RepairStrategiesPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { RecommendationPage } from './pages/RecommendationPage';
import { PredictiveMaintPage } from './pages/PredictiveMaintPage';
import { MachineHistoryPage } from './pages/MachineHistoryPage';
import { AnalyticsReportsPage } from './pages/AnalyticsReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';

const ScreenRouter: React.FC = () => {
  const { currentView } = useNavigation();
  const { isAuthenticated } = useAuth();

  const isPublicPage = ['landing', 'login', 'register', 'forgot-password'].includes(currentView);

  // Protected route guard: Redirect unauthenticated requests to login
  if (!isAuthenticated && !isPublicPage) {
    return <LoginPage />;
  }

  switch (currentView) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'forgot-password':
      return <ForgotPasswordPage />;
    case 'overview':
      return <OverviewDashboard />;
    case 'monitoring':
      return <LiveMonitoringPage />;
    case '3d-model':
      return <Visualization3DPage />;
    case 'faults':
      return <FaultDetectionPage />;
    case 'root-cause':
      return <RootCausePage />;
    case 'repair-strategies':
      return <RepairStrategiesPage />;
    case 'digital-twin':
      return <DigitalTwinPage />;
    case 'recommendations':
      return <RecommendationPage />;
    case 'predictive':
      return <PredictiveMaintPage />;
    case 'history':
      return <MachineHistoryPage />;
    case 'analytics':
      return <AnalyticsReportsPage />;
    case 'settings':
      return <SettingsPage />;
    case 'admin':
      return <AdminDashboardPage />;
    default:
      return <OverviewDashboard />;
  }
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationProvider>
          <MachineProvider>
            <AppLayout>
              <ScreenRouter />
            </AppLayout>
            <CookieConsentBanner />
          </MachineProvider>
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
