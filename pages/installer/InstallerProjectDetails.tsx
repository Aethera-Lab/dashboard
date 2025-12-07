import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { UserRole, Project, ProjectStatus } from '../../types';
import { Button, Card, StatusBadge, ProgressBar } from '../../components/ui/UIComponents';
import { db } from '../../services/mockBackend';
import { FileText, MapPin, DollarSign, Wallet } from 'lucide-react';

const InstallerProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
        const p = db.getProjectById(id);
        setProject(p || null);
    }
  }, [id]);

  if (!project) return <Layout role={UserRole.INSTALLER} title="Loading..."><div className="text-center">Loading...</div></Layout>;

  return (
    <Layout role={UserRole.INSTALLER} title={project.title}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Project Overview</h2>
                    <StatusBadge status={project.status} />
                </div>
                <p className="text-slate-600 mb-6">{project.summary}</p>
                <div className="flex items-center text-slate-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {project.location}
                </div>
                <div className="flex items-center text-slate-500">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Goal: ${project.fundingGoal.toLocaleString()}
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Documents</h2>
                <ul className="space-y-2">
                    {project.documents.map((doc, i) => (
                        <li key={i} className="flex items-center p-3 bg-slate-50 rounded border border-slate-200">
                            <FileText className="w-5 h-5 text-aethera-600 mr-3" />
                            <span className="text-sm font-medium text-slate-700">{doc}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Funding Status</h2>
                <div className="mb-6">
                    <ProgressBar current={project.currentFunding} total={project.fundingGoal} />
                </div>
                
                {project.status === ProjectStatus.FUNDED && (
                    <div className="bg-green-50 text-green-800 p-4 rounded-md text-sm mb-4">
                        Funding goal reached! Waiting for admin disbursement.
                    </div>
                )}
                {project.status === ProjectStatus.DISBURSED && (
                    <div className="bg-slate-100 text-slate-800 p-4 rounded-md text-sm mb-4 flex items-center">
                        <Wallet className="w-4 h-4 mr-2" />
                        Funds released to wallet.
                    </div>
                )}
            </Card>
            
            <Button variant="outline" className="w-full" onClick={() => navigate('/installer/dashboard')}>
                Back to Dashboard
            </Button>
        </div>
      </div>
    </Layout>
  );
};

export default InstallerProjectDetails;