import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { startSimulation } from './services/simulationService';

import CustomerApp from './pages/CustomerApp';
import BookApp from './pages/BookApp';
import WorkerApp from './pages/WorkerApp';
import DashboardApp from './pages/DashboardApp';
import AuthModal from './components/auth/AuthModal';

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
          <Route path="/" element={<CustomerApp />} />
          <Route path="/book" element={<BookApp />} />
          <Route path="/worker" element={<WorkerApp />} />
          <Route path="/dashboard" element={<DashboardApp />} />
        </Routes>
      </Router>
      <AuthModal />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
