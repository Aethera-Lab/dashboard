import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { UserRole, Project, KYCStatus } from '../../types';
import { Button, Card, StatusBadge, ProgressBar } from '../../components/ui/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/mockBackend';
import { Plus, ArrowRight, AlertTriangle } from 'lucide-react';

const InstallerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (user) {
        setProjects(db.getProjectsByInstaller(user.id));
    }
  }, [user]);

  if (user?.kycStatus === KYCStatus.NONE || user?.kycStatus === KYCStatus.REJECTED) {
     return (
        <Layout role={UserRole.INSTALLER} title="Dashboard">
            <Card className="p-8 text-center max-w-2xl mx-auto mt-10">
                <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Account Not Verified</h2>
                <p className="text-slate-500 mb-6">You must complete KYC verification before you can submit projects.</p>
                <Button onClick={() => navigate('/installer/kyc')}>Complete Verification</Button>
            </Card>
        </Layout>
     )
  }

  if (user?.kycStatus === KYCStatus.PENDING) {
     return (
        <Layout role={UserRole.INSTALLER} title="Dashboard">
             <Card className="p-8 text-center max-w-2xl mx-auto mt-10">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Verification Pending</h2>
                <p className="text-slate-500 mb-6">Your KYC application is currently under review by an admin. Please check back later.</p>
            </Card>
        </Layout>
     )
  }

  return (
    <Layout role={UserRole.INSTALLER} title="My Projects">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-500">Manage your solar project listings and track funding.</p>
        <Button onClick={() => navigate('/installer/create-project')}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
            No projects found. Create your first project to get started.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
                <Card key={project.id} className="flex flex-col">
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{project.title}</h3>
                            <StatusBadge status={project.status} />
                        </div>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.summary}</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Goal</span>
                                <span className="font-medium">${project.fundingGoal.toLocaleString()}</span>
                            </div>
                            <ProgressBar current={project.currentFunding} total={project.fundingGoal} />
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/installer/project/${project.id}`)}>
                            View Details <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
      )}
    </Layout>
  );
};

export default InstallerDashboard;