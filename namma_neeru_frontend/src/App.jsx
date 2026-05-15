import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { startSimulation } from './services/simulationService';

import CustomerApp from './pages/CustomerApp';
import BookApp from './pages/BookApp';
import WorkerApp from './pages/WorkerApp';
import DashboardApp from './pages/DashboardApp';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import AuthModal from './components/auth/AuthModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ROLES } from './constants/roles';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_DEMO_MODE === 'true') {
      startSimulation();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<CustomerApp />} />
          
          {/* Protected Routes */}
          <Route path="/book" element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
              <BookApp />
            </ProtectedRoute>
          } />
          <Route path="/worker" element={
            <ProtectedRoute allowedRoles={[ROLES.WORKER]}>
              <WorkerApp />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.OFFICIAL]}>
              <DashboardApp />
            </ProtectedRoute>
          } />

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AuthModal />
      </Router>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
