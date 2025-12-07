import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { UserRole, Project, ProjectStatus } from '../../types';
import { Button, Card, StatusBadge, ProgressBar, Input } from '../../components/ui/UIComponents';
import { db } from '../../services/mockBackend';
import { mockAptos } from '../../services/aptosService';
import { toast } from 'react-hot-toast';
import { CheckCircle, Download } from 'lucide-react';

const InvestorProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [amount, setAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
        setProject(db.getProjectById(id) || null);
    }
  }, [id, investing]);

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !amount) return;

    setInvesting(true);
    try {
        await mockAptos.invest(project.id, parseFloat(amount), '0xUserWallet');
        setShowSuccess(true);
        toast.success('Investment Successful!');
    } catch (err) {
        toast.error('Investment failed');
        setInvesting(false);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <Layout role={UserRole.INVESTOR} title={project.title}>
      {showSuccess ? (
        <Card className="max-w-xl mx-auto p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Investment Confirmed!</h2>
            <p className="text-slate-600 mb-6">
                You have successfully invested <strong>${parseFloat(amount).toLocaleString()}</strong> in {project.title}.
                <br/>
                Tokens have been transferred to your wallet.
            </p>
            <Button onClick={() => navigate('/investor/dashboard')}>Browse More Projects</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                    <div className="flex justify-between mb-4">
                        <StatusBadge status={project.status} />
                        <span className="text-sm text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Project Summary</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{project.summary}</p>
                    
                    <h3 className="font-bold text-lg mb-2">Documents</h3>
                    <div className="flex gap-2">
                        {project.documents.map((doc, i) => (
                            <Button key={i} variant="outline" size="sm" className="text-xs">
                                <Download className="w-3 h-3 mr-1" /> {doc}
                            </Button>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="p-6 border-t-4 border-t-aethera-500">
                    <h3 className="font-bold text-lg mb-4">Invest in this Project</h3>
                    <div className="mb-6">
                        <ProgressBar current={project.currentFunding} total={project.fundingGoal} />
                    </div>

                    {project.status === ProjectStatus.LIVE ? (
                        <form onSubmit={handleInvest} className="space-y-4">
                            <Input 
                                label="Investment Amount (USDC)"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Min $100"
                                required
                                min="100"
                            />
                            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                                Estimated Tokens: {amount ? (parseFloat(amount) * 1).toLocaleString() : '0'} {project.tokenSymbol || 'TOKENS'}
                            </div>
                            <Button type="submit" className="w-full" disabled={investing}>
                                {investing ? 'Processing Transaction...' : 'Invest Now'}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center p-4 bg-slate-100 rounded text-slate-600 font-medium">
                            Investment is currently closed for this project.
                        </div>
                    )}
                </Card>
            </div>
        </div>
      )}
    </Layout>
  );
};

export default InvestorProjectDetails;