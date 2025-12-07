import { Project, ProjectStatus, User, UserRole, KYCStatus, Investment } from '../types';

// Initial Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    installerId: 'inst1',
    installerName: 'SolarFlow Inc.',
    title: 'Sunnyvale Community Grid',
    summary: 'A 500kW community solar project serving 200 households in Sunnyvale, CA.',
    location: 'Sunnyvale, CA',
    fundingGoal: 250000,
    currentFunding: 125000,
    status: ProjectStatus.LIVE,
    documents: ['SitePlan.pdf', 'Financials.xlsx'],
    tokenSupply: 250000,
    tokenSymbol: 'SVGRID',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    installerId: 'inst2',
    installerName: 'EcoBuild Partners',
    title: 'Nevada Desert Array',
    summary: 'Large scale ground-mount installation for industrial supply.',
    location: 'Reno, NV',
    fundingGoal: 1000000,
    currentFunding: 1000000,
    status: ProjectStatus.FUNDED,
    documents: ['ImpactReport.pdf'],
    tokenSupply: 1000000,
    tokenSymbol: 'NVDES',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'p3',
    installerId: 'inst1',
    installerName: 'SolarFlow Inc.',
    title: 'High School Rooftop Retrofit',
    summary: 'Retrofitting the local high school with high-efficiency panels.',
    location: 'Austin, TX',
    fundingGoal: 75000,
    currentFunding: 0,
    status: ProjectStatus.PENDING_REVIEW,
    documents: ['Proposal.pdf'],
    createdAt: new Date().toISOString()
  }
];

const INITIAL_USERS: User[] = [
  { id: 'admin1', name: 'System Admin', email: 'admin@aethera.com', role: UserRole.ADMIN },
  { id: 'inst1', name: 'John Solar', email: 'john@solarflow.com', role: UserRole.INSTALLER, companyName: 'SolarFlow Inc.', kycStatus: KYCStatus.APPROVED },
  { id: 'inv1', name: 'Alice Investor', email: 'alice@capital.com', role: UserRole.INVESTOR, walletAddress: '0x123...abc' }
];

class MockBackend {
  private projects: Project[] = INITIAL_PROJECTS;
  private users: User[] = INITIAL_USERS;
  private investments: Investment[] = [];

  constructor() {
    this.load();
  }

  private load() {
    const p = localStorage.getItem('aethera_projects');
    const u = localStorage.getItem('aethera_users');
    const i = localStorage.getItem('aethera_investments');
    if (p) this.projects = JSON.parse(p);
    if (u) this.users = JSON.parse(u);
    if (i) this.investments = JSON.parse(i);
  }

  private save() {
    localStorage.setItem('aethera_projects', JSON.stringify(this.projects));
    localStorage.setItem('aethera_users', JSON.stringify(this.users));
    localStorage.setItem('aethera_investments', JSON.stringify(this.investments));
  }

  // --- Projects ---
  getProjects(statusFilter?: ProjectStatus): Project[] {
    if (statusFilter) return this.projects.filter(p => p.status === statusFilter);
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getProjectsByInstaller(installerId: string): Project[] {
    return this.projects.filter(p => p.installerId === installerId);
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'currentFunding' | 'status'>): Project {
    const newProject: Project = {
      ...project,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
      currentFunding: 0,
      status: ProjectStatus.PENDING_REVIEW,
      documents: project.documents || []
    };
    this.projects.push(newProject);
    this.save();
    return newProject;
  }

  updateProjectStatus(id: string, status: ProjectStatus, extra?: Partial<Project>) {
    const p = this.projects.find(x => x.id === id);
    if (p) {
      p.status = status;
      if (extra) Object.assign(p, extra);
      this.save();
    }
  }

  addFunding(projectId: string, amount: number) {
    const p = this.projects.find(x => x.id === projectId);
    if (p) {
      p.currentFunding += amount;
      // Auto-transition to FUNDED if goal reached
      if (p.currentFunding >= p.fundingGoal && p.status === ProjectStatus.LIVE) {
        p.status = ProjectStatus.FUNDED;
      }
      this.save();
    }
  }

  // --- Users ---
  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  updateUserKYC(userId: string, status: KYCStatus) {
    const u = this.users.find(x => x.id === userId);
    if (u) {
      u.kycStatus = status;
      this.save();
    }
  }

  registerUser(user: User) {
    this.users.push(user);
    this.save();
  }

  getUsersByRole(role: UserRole): User[] {
    return this.users.filter(u => u.role === role);
  }
}

export const db = new MockBackend();