import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { UserRole, Project, User, KYCStatus, ProjectStatus } from '../../types';
import { Button, Card, StatusBadge } from '../../components/ui/UIComponents';
import { db } from '../../services/mockBackend';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Check, X } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'kyc'>('projects');
  const navigate = useNavigate();
  
  // Data Fetching (simulated real-time)
  const projects = db.getProjects();
  const pendingKYCUsers = db.getUsersByRole(UserRole.INSTALLER).filter(u => u.kycStatus === KYCStatus.PENDING);

  const handleKYCDecision = (userId: string, status: KYCStatus) => {
    db.updateUserKYC(userId, status);
    toast.success(`User KYC ${status}`);
    // force re-render trick or rely on router reload? in React state we should update local state
    // For simplicity in this snippet, we'll just reload the page/component logic via state update? 
    // Actually, let's just use window reload or router refresh for MVP simplicity
    window.location.reload(); 
  };

  return (
    <Layout role={UserRole.ADMIN} title="Admin Dashboard">
      <div className="flex space-x-4 mb-6 border-b border-slate-200">
        <button 
            className={`pb-2 px-1 ${activeTab === 'projects' ? 'border-b-2 border-slate-900 font-medium' : 'text-slate-500'}`}
            onClick={() => setActiveTab('projects')}
        >
            Project Management
        </button>
        <button 
            className={`pb-2 px-1 ${activeTab === 'kyc' ? 'border-b-2 border-slate-900 font-medium' : 'text-slate-500'}`}
            onClick={() => setActiveTab('kyc')}
        >
            KYC Reviews ({pendingKYCUsers.length})
        </button>
      </div>

      {activeTab === 'projects' && (
        <div className="space-y-4">
            <h3 className="text-lg font-medium mb-4">All Projects</h3>
            <div className="bg-white rounded-md shadow overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Installer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Raised</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {projects.map(p => (
                            <tr key={p.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{p.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-500">{p.installerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={p.status} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-500">${p.currentFunding.toLocaleString()} / ${p.fundingGoal.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button size="sm" variant="outline" onClick={() => navigate(`/admin/project/${p.id}`)}>Manage</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="space-y-4">
             {pendingKYCUsers.length === 0 ? (
                 <Card className="p-8 text-center text-slate-500">No pending KYC applications.</Card>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingKYCUsers.map(u => (
                        <Card key={u.id} className="p-6">
                            <h3 className="font-bold text-lg">{u.companyName}</h3>
                            <p className="text-sm text-slate-500 mb-2">Applicant: {u.name}</p>
                            <p className="text-sm text-slate-500 mb-4">Email: {u.email}</p>
                            
                            <div className="flex items-center text-sm text-blue-600 mb-4 cursor-pointer hover:underline">
                                <span className="mr-2">📄</span> View Documents
                            </div>

                            <div className="flex space-x-2">
                                <Button className="flex-1" onClick={() => handleKYCDecision(u.id, KYCStatus.APPROVED)}>
                                    <Check className="w-4 h-4 mr-2" /> Approve
                                </Button>
                                <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleKYCDecision(u.id, KYCStatus.REJECTED)}>
                                    <X className="w-4 h-4 mr-2" /> Reject
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
             )}
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;