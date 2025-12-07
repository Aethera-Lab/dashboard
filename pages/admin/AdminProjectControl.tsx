import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { UserRole, Project, ProjectStatus } from '../../types';
import { Button, Card, StatusBadge, ProgressBar } from '../../components/ui/UIComponents';
import { db } from '../../services/mockBackend';
import { mockAptos } from '../../services/aptosService';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Coins, Send, Check } from 'lucide-react';

const AdminProjectControl: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchProject = () => {
        if (id) setProject(db.getProjectById(id) || null);
    };
    fetchProject();
  }, [id, processing]);

  const handleApprove = () => {
    if (!project) return;
    db.updateProjectStatus(project.id, ProjectStatus.APPROVED);
    toast.success('Project Approved for Tokenization');
    setProcessing(!processing); // Trigger refresh
  };

  const handleMintTokens = async () => {
    if (!project) return;
    setProcessing(true);
    try {
        await mockAptos.mintTokens(project.id, project.fundingGoal, `SLR-${project.id.slice(-4).toUpperCase()}`);
        toast.success('Tokens Minted on Aptos Chain');
    } catch (e) {
        toast.error('Minting failed');
    } finally {
        setProcessing(false);
    }
  };

  const handleReleaseFunds = async () => {
    if (!project) return;
    setProcessing(true);
    try {
        await mockAptos.releaseFunds(project.id, '0xInstallerWallet...');
        navigate('/admin/disbursement-confirmation');
    } catch (e) {
        toast.error('Release failed');
        setProcessing(false);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <Layout role={UserRole.ADMIN} title={`Manage: ${project.title}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
            <h2 className="font-bold text-lg mb-4">Project Details</h2>
            <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Status</span>
                    <StatusBadge status={project.status} />
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Installer</span>
                    <span>{project.installerName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Funding Goal</span>
                    <span>${project.fundingGoal.toLocaleString()}</span>
                </div>
                <div className="pt-2">
                     <ProgressBar current={project.currentFunding} total={project.fundingGoal} />
                </div>
            </div>
        </Card>

        <Card className="p-6 bg-slate-50 border-l-4 border-l-aethera-500">
            <h2 className="font-bold text-lg mb-4">Admin Actions</h2>
            
            {/* Logic for Buttons based on Status */}
            {project.status === ProjectStatus.PENDING_REVIEW && (
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Review documents and approve for tokenization.</p>
                    <div className="flex gap-2">
                        <Button onClick={handleApprove} className="w-full">
                            <ShieldCheck className="w-4 h-4 mr-2" /> Approve Project
                        </Button>
                        <Button variant="danger" className="w-full" onClick={() => {}}>
                            Reject
                        </Button>
                    </div>
                </div>
            )}

            {project.status === ProjectStatus.APPROVED && (
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Project approved. Ready to mint tokens on Aptos.</p>
                    <Button onClick={handleMintTokens} disabled={processing} className="w-full">
                        <Coins className="w-4 h-4 mr-2" /> 
                        {processing ? 'Minting...' : 'Mint Tokens & Go Live'}
                    </Button>
                </div>
            )}

            {project.status === ProjectStatus.LIVE && (
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Project is LIVE. Investors are funding.</p>
                    <div className="bg-white p-3 rounded border text-sm text-slate-500">
                        Waiting for 100% funding...
                    </div>
                    {/* Mock ability to force funding for demo */}
                    <Button variant="outline" size="sm" onClick={() => {
                        db.addFunding(project.id, project.fundingGoal - project.currentFunding);
                        toast.success('Simulated full funding!');
                        setProcessing(!processing);
                    }}>
                        [Demo] Force Full Funding
                    </Button>
                </div>
            )}

            {project.status === ProjectStatus.FUNDED && (
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Goal reached. Release funds from escrow.</p>
                    <Button onClick={handleReleaseFunds} disabled={processing} className="w-full bg-slate-900">
                        <Send className="w-4 h-4 mr-2" />
                        {processing ? 'Releasing...' : 'Release Funds to Installer'}
                    </Button>
                </div>
            )}
            
            {project.status === ProjectStatus.DISBURSED && (
                <p className="text-green-600 font-medium flex items-center">
                    <Check className="w-5 h-5 mr-2" /> Funds Disbursed Complete
                </p>
            )}

        </Card>
      </div>
    </Layout>
  );
};

export default AdminProjectControl;