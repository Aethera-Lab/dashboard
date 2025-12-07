import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { UserRole, KYCStatus } from '../../types';
import { Button, Input, Card } from '../../components/ui/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/mockBackend';
import { toast } from 'react-hot-toast';

const InstallerKYC: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    companyName: user?.companyName || '',
    address: '',
    registrationNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    if (user) {
        db.updateUserKYC(user.id, KYCStatus.PENDING);
        updateUser({ 
            kycStatus: KYCStatus.PENDING, 
            companyName: formData.companyName,
            name: formData.fullName
        });
        toast.success('KYC Submitted for Review');
        navigate('/installer/dashboard');
    }
  };

  return (
    <Layout role={UserRole.INSTALLER} title="Installer Verification (KYC)">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="mb-6 border-b pb-4">
             <h3 className="text-lg font-medium">Identity Verification</h3>
             <p className="text-sm text-slate-500">We need some details to verify your business before you can list projects.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
                label="Full Legal Name" 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                required 
            />
            <Input 
                label="Company Name" 
                value={formData.companyName} 
                onChange={(e) => setFormData({...formData, companyName: e.target.value})} 
                required 
            />
            <Input 
                label="Business Address" 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                required 
            />
            <Input 
                label="Business Registration Number" 
                value={formData.registrationNumber} 
                onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} 
                required 
            />
            
            <div className="border-2 border-dashed border-slate-300 rounded-md p-6 text-center bg-slate-50">
                <p className="text-sm text-slate-500">Upload Government ID / Business License (Mock)</p>
                <Button type="button" variant="outline" className="mt-2" onClick={() => toast.success('Mock File Uploaded')}>
                    Select File
                </Button>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit">Submit for Review</Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default InstallerKYC;