import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button, Card } from '../../components/ui/UIComponents';

const DisbursementConfirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Disbursement Successful</h1>
        <p className="text-slate-500 mb-8">
            The funds have been successfully released from the escrow smart contract to the installer's wallet.
        </p>
        <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded text-xs font-mono text-slate-500">
                Tx Hash: 0x71c...9a2b
            </div>
            <Button className="w-full" onClick={() => navigate('/admin/dashboard')}>
                Return to Dashboard
            </Button>
        </div>
      </Card>
    </div>
  );
};

export default DisbursementConfirmation;