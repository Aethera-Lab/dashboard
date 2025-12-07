import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { UserRole, ProjectStatus } from '../../types';
import { Button, Card, StatusBadge, ProgressBar } from '../../components/ui/UIComponents';
import { db } from '../../services/mockBackend';
import { MapPin } from 'lucide-react';

const InvestorDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Investors see LIVE projects, or FUNDED ones (historical)
  const projects = db.getProjects().filter(p => [ProjectStatus.LIVE, ProjectStatus.FUNDED, ProjectStatus.DISBURSED].includes(p.status));

  return (
    <Layout role={UserRole.INVESTOR} title="Explore Projects">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">
                No active projects available for investment at the moment.
            </div>
        ) : (
            projects.map(project => (
                <Card key={project.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-slate-200 flex items-center justify-center text-slate-400">
                        {/* Placeholder for project image */}
                        <span className="text-sm">Project Image</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 mb-4">
                            <MapPin className="w-3 h-3 mr-1" /> {project.location}
                        </div>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">{project.summary}</p>
                        
                        <div className="mt-auto space-y-4">
                            <ProgressBar current={project.currentFunding} total={project.fundingGoal} />
                            <div className="flex justify-between items-center">
                                <StatusBadge status={project.status} />
                                <Button size="sm" onClick={() => navigate(`/investor/project/${project.id}`)}>
                                    View Project
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))
        )}
      </div>
    </Layout>
  );
};

export default InvestorDashboard;