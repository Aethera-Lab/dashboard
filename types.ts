export enum UserRole {
  INSTALLER = 'INSTALLER',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN'
}

export enum ProjectStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED', // Ready for minting
  LIVE = 'LIVE', // Tokenized & Funding
  FUNDED = 'FUNDED', // Goal reached
  DISBURSED = 'DISBURSED', // Funds released
  REJECTED = 'REJECTED'
}

export enum KYCStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NONE = 'NONE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  kycStatus?: KYCStatus;
  walletAddress?: string;
  companyName?: string;
}

export interface Project {
  id: string;
  installerId: string;
  installerName: string;
  title: string;
  summary: string;
  location: string;
  fundingGoal: number;
  currentFunding: number;
  status: ProjectStatus;
  documents: string[]; // Mocks
  tokenSupply?: number;
  tokenSymbol?: string;
  createdAt: string;
}

export interface Investment {
  id: string;
  investorId: string;
  projectId: string;
  amount: number;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}
