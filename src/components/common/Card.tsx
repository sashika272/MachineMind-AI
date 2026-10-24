import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'amber' | 'crimson' | 'emerald' | 'none';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  glow = 'none',
  onClick 
}) => {
  const { isDark } = useTheme();

  const glowClasses = isDark ? {
    cyan: 'border-cyan-500/40 shadow-cyan-glow',
    amber: 'border-amber-500/40 shadow-amber-glow',
    crimson: 'border-rose-500/40 shadow-crimson-glow',
    emerald: 'border-emerald-500/40 shadow-emerald-glow',
    none: 'border-graphite-700/60 hover:border-graphite-600/80'
  } : {
    cyan: 'border-cyan-500 shadow-sm shadow-cyan-500/20',
    amber: 'border-amber-500 shadow-sm shadow-amber-500/20',
    crimson: 'border-rose-500 shadow-sm shadow-rose-500/20',
    emerald: 'border-emerald-500 shadow-sm shadow-emerald-500/20',
    none: 'border-slate-200 hover:border-slate-300 shadow-sm'
  };

  const bgClasses = isDark
    ? 'bg-graphite-900/90 text-graphite-100'
    : 'bg-white text-slate-900';

  return (
    <div
      onClick={onClick}
      className={`${bgClasses} backdrop-blur-md rounded-xl border p-5 transition-all duration-200 ${glowClasses[glow]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </div>
  );
};
