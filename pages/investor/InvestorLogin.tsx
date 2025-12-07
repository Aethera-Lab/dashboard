import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button, Card } from '../../components/ui/UIComponents';
import { mockAptos } from '../../services/aptosService';
import { toast } from 'react-hot-toast';

const InvestorLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);

  const handleWalletConnect = async () => {
    setConnecting(true);
    try {
        const address = await mockAptos.connectWallet();
        // For MVP, we treat wallet connect as login
        // In real app, we'd sign a message
        await login(`investor_${address.slice(0,6)}@aethera.com`, UserRole.INVESTOR);
        toast.success(`Connected: ${address.slice(0,6)}...${address.slice(-4)}`);
        navigate('/investor/dashboard');
    } catch (e) {
        toast.error('Connection failed');
    } finally {
        setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Connect Wallet</h2>
        <p className="text-slate-500 mb-8">
            Connect your Aptos wallet to browse projects and invest in renewable energy.
        </p>
        
        <div className="space-y-4">
            <Button className="w-full bg-black hover:bg-slate-800" onClick={handleWalletConnect} disabled={connecting}>
                {connecting ? 'Connecting...' : 'Connect Petra Wallet'}
            </Button>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleWalletConnect} disabled={connecting}>
                {connecting ? 'Connecting...' : 'Connect Martian Wallet'}
            </Button>
        </div>
        <p className="mt-6 text-xs text-slate-400">
            By connecting, you agree to our Terms of Service.
        </p>
      </Card>
    </div>
  );
};

export default InvestorLogin;