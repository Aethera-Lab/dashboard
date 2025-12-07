import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button, Input, Card } from '../../components/ui/UIComponents';
import { toast } from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@aethera.com');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, UserRole.ADMIN);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Portal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit" className="w-full" variant="secondary">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;