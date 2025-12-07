import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Pages
import LandingPage from './pages/LandingPage';
import InstallerLogin from './pages/installer/InstallerLogin';
import InstallerKYC from './pages/installer/InstallerKYC';
import InstallerDashboard from './pages/installer/InstallerDashboard';
import InstallerCreateProject from './pages/installer/InstallerCreateProject';
import InstallerProjectDetails from './pages/installer/InstallerProjectDetails';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjectControl from './pages/admin/AdminProjectControl';
import DisbursementConfirmation from './pages/admin/DisbursementConfirmation';

import InvestorLogin from './pages/investor/InvestorLogin';
import InvestorDashboard from './pages/investor/InvestorDashboard';
import InvestorProjectDetails from './pages/investor/InvestorProjectDetails';

// Services/State
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Installer Routes */}
            <Route path="/installer/login" element={<InstallerLogin />} />
            <Route path="/installer/kyc" element={<InstallerKYC />} />
            <Route path="/installer/dashboard" element={<InstallerDashboard />} />
            <Route path="/installer/create-project" element={<InstallerCreateProject />} />
            <Route path="/installer/project/:id" element={<InstallerProjectDetails />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/project/:id" element={<AdminProjectControl />} />
            <Route path="/admin/disbursement-confirmation" element={<DisbursementConfirmation />} />

            {/* Investor Routes */}
            <Route path="/investor/login" element={<InvestorLogin />} />
            <Route path="/investor/dashboard" element={<InvestorDashboard />} />
            <Route path="/investor/project/:id" element={<InvestorProjectDetails />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;