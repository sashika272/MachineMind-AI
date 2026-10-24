import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const { isDark } = useTheme();
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: isDark
      ? 'bg-gradient-to-r from-cyan-electric to-cyan-500 text-graphite-950 font-semibold hover:shadow-cyan-glow hover:brightness-110 active:scale-[0.98]'
      : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-semibold shadow-sm hover:brightness-105 active:scale-[0.98]',
    secondary: isDark
      ? 'bg-graphite-800 hover:bg-graphite-700 text-graphite-100 border border-graphite-700/80 hover:border-cyan-500/40 active:bg-graphite-750'
      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 hover:border-cyan-600/50 active:bg-slate-300 active:text-slate-900',
    danger: isDark
      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 hover:shadow-crimson-glow active:bg-rose-500/40'
      : 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 active:bg-rose-200 font-semibold',
    ghost: isDark
      ? 'text-graphite-300 hover:text-white hover:bg-graphite-800/60 active:bg-graphite-800'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 active:text-slate-950 font-medium',
    outline: isDark
      ? 'border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 active:bg-cyan-500/20'
      : 'border border-cyan-600 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-700 active:bg-cyan-100 font-semibold'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
