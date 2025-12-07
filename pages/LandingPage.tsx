import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Briefcase, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button, Card } from '../components/ui/UIComponents';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-aethera-50 to-slate-100 p-4">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-aethera-100 p-4 rounded-full">
            <Sun className="h-16 w-16 text-aethera-600" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome to Aethera</h1>
        <p className="text-xl text-slate-600 max-w-2xl">
          The decentralized financing platform empowering solar installers and investors on Aptos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Installer */}
        <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center">
          <div className="bg-blue-50 p-3 rounded-full mb-4">
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Solar Installer</h2>
          <p className="text-slate-500 mb-6 flex-1">
            Submit your solar projects, pass KYC, and get funded by a global pool of investors.
          </p>
          <Button className="w-full" onClick={() => navigate('/installer/login')}>
            Installer Portal
          </Button>
        </Card>

        {/* Investor */}
        <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center">
          <div className="bg-aethera-50 p-3 rounded-full mb-4">
            <TrendingUp className="h-8 w-8 text-aethera-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Investor</h2>
          <p className="text-slate-500 mb-6 flex-1">
            Discover vetted renewable energy projects and earn yields through tokenized assets.
          </p>
          <Button className="w-full" variant="primary" onClick={() => navigate('/investor/login')}>
            Start Investing
          </Button>
        </Card>

        {/* Admin */}
        <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center text-center">
          <div className="bg-slate-100 p-3 rounded-full mb-4">
            <ShieldCheck className="h-8 w-8 text-slate-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Platform Admin</h2>
          <p className="text-slate-500 mb-6 flex-1">
            Review projects, approve KYC, mint tokens, and manage fund disbursement.
          </p>
          <Button className="w-full" variant="secondary" onClick={() => navigate('/admin/login')}>
            Admin Login
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;