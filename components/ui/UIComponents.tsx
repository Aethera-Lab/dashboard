import React, { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { ProjectStatus, KYCStatus } from '../../types';
import { CheckCircle, Clock, XCircle, DollarSign, Activity, Lock, AlertCircle } from 'lucide-react';

export const Button = React.forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger', size?: 'sm' | 'md' | 'lg' }>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const sizeStyles = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };
    const variants = {
      primary: "bg-aethera-600 text-white hover:bg-aethera-700 focus:ring-aethera-500",
      secondary: "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500",
      outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-aethera-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };
    return (
      <button ref={ref} className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`} {...props} />
    );
  }
);
Button.displayName = "Button";

export const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
        <input
          ref={ref}
          className={`appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-aethera-500 focus:border-aethera-500 sm:text-sm ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

export const StatusBadge = ({ status }: { status: ProjectStatus | KYCStatus }) => {
  const styles: Record<string, string> = {
    [ProjectStatus.PENDING_REVIEW]: "bg-yellow-100 text-yellow-800",
    [ProjectStatus.APPROVED]: "bg-blue-100 text-blue-800",
    [ProjectStatus.LIVE]: "bg-aethera-100 text-aethera-800",
    [ProjectStatus.FUNDED]: "bg-purple-100 text-purple-800",
    [ProjectStatus.DISBURSED]: "bg-slate-100 text-slate-800",
    [ProjectStatus.REJECTED]: "bg-red-100 text-red-800",
    [KYCStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    // Note: KYCStatus.APPROVED and KYCStatus.REJECTED share string values with ProjectStatus
    // so they are handled by the keys above.
    [KYCStatus.NONE]: "bg-slate-100 text-slate-500",
  };

  const icons: Record<string, React.ReactNode> = {
    [ProjectStatus.PENDING_REVIEW]: <Clock className="w-3 h-3 mr-1" />,
    [ProjectStatus.APPROVED]: <CheckCircle className="w-3 h-3 mr-1" />,
    [ProjectStatus.LIVE]: <Activity className="w-3 h-3 mr-1" />,
    [ProjectStatus.FUNDED]: <DollarSign className="w-3 h-3 mr-1" />,
    [ProjectStatus.DISBURSED]: <Lock className="w-3 h-3 mr-1" />,
    [ProjectStatus.REJECTED]: <XCircle className="w-3 h-3 mr-1" />,
    [KYCStatus.PENDING]: <Clock className="w-3 h-3 mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {icons[status] || null}
      {status.replace('_', ' ')}
    </span>
  );
};

export const ProgressBar = ({ current, total }: { current: number, total: number }) => {
  const percent = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1 text-slate-600">
        <span>${current.toLocaleString()} raised</span>
        <span>{percent}% of ${total.toLocaleString()}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div className="bg-aethera-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};