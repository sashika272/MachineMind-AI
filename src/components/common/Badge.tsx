import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'amber' | 'rose' | 'emerald' | 'graphite' | 'blue';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  pulse = false,
  className = ''
}) => {
  const { isDark } = useTheme();

  const variantStyles = {
    cyan: isDark 
      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' 
      : 'bg-cyan-50 border-cyan-300 text-cyan-800 font-semibold',
    amber: isDark 
      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' 
      : 'bg-amber-50 border-amber-300 text-amber-800 font-semibold',
    rose: isDark 
      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' 
      : 'bg-rose-50 border-rose-300 text-rose-800 font-semibold',
    emerald: isDark 
      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
      : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold',
    graphite: isDark 
      ? 'bg-graphite-800 border-graphite-700 text-graphite-300' 
      : 'bg-slate-100 border-slate-300 text-slate-700 font-medium',
    blue: isDark 
      ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' 
      : 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
};
