import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { UserRole } from '../../types';
import { Button, Input, Card } from '../../components/ui/UIComponents';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/mockBackend';
import { toast } from 'react-hot-toast';

const InstallerCreateProject: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    location: '',
    fundingGoal: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
        db.createProject({
            installerId: user.id,
            installerName: user.companyName || user.name,
            title: formData.title,
            summary: formData.summary,
            location: formData.location,
            fundingGoal: parseFloat(formData.fundingGoal),
            documents: ['Site_Assessment.pdf'] // Mock
        });
        toast.success('Project submitted successfully!');
        navigate('/installer/dashboard');
    } catch (err) {
        toast.error('Failed to create project');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Layout role={UserRole.INSTALLER} title="Create New Project">
        <div className="max-w-3xl mx-auto">
            <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        label="Project Title"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Sunnyvale Community Solar"
                        required
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Project Summary</label>
                        <textarea 
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-aethera-500 focus:border-aethera-500 sm:text-sm"
                            rows={4}
                            value={formData.summary}
                            onChange={e => setFormData({...formData, summary: e.target.value})}
                            required
                        />
                    </div>

                    <Input 
                        label="Location"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        placeholder="City, State"
                        required
                    />

                    <Input 
                        label="Funding Goal (USD)"
                        type="number"
                        value={formData.fundingGoal}
                        onChange={e => setFormData({...formData, fundingGoal: e.target.value})}
                        placeholder="50000"
                        required
                    />

                    <div className="border-2 border-dashed border-slate-300 rounded-md p-6 text-center bg-slate-50">
                        <p className="text-sm text-slate-500">Upload Project Documents (Technical Specs, Financials)</p>
                        <Button type="button" variant="outline" className="mt-2" onClick={() => toast.success('Mock Document Added')}>
                            + Add Document
                        </Button>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="button" variant="outline" className="mr-4" onClick={() => navigate('/installer/dashboard')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Project'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    </Layout>
  );
};

export default InstallerCreateProject;