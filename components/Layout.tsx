import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Sun, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';
import Logo from '/athera_logo.png'

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, role, title }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src={Logo}
                className="w-48 h-16"
              />
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-500 rounded border border-slate-200 uppercase">
                {role}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 hidden sm:block">
                 {user?.email}
              </span>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;