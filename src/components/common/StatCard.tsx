import React from 'react';
import { Card } from './Card';
import { useTheme } from '../../context/ThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'optimal' | 'nominal' | 'warning' | 'critical';
  icon?: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  change,
  trend,
  status = 'nominal',
  icon,
  subtitle
}) => {
  const { isDark } = useTheme();

  const statusColors = {
    optimal: isDark ? 'text-emerald-400' : 'text-emerald-700',
    nominal: isDark ? 'text-cyan-400' : 'text-cyan-700',
    warning: isDark ? 'text-amber-400' : 'text-amber-700',
    critical: isDark ? 'text-rose-400' : 'text-rose-700'
  };

  const trendColors = {
    up: isDark ? 'text-rose-400' : 'text-rose-700',
    down: isDark ? 'text-emerald-400' : 'text-emerald-700',
    neutral: isDark ? 'text-graphite-400' : 'text-slate-500'
  };

  return (
    <Card className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <span className={`text-xs font-mono tracking-wider uppercase font-semibold ${
          isDark ? 'text-graphite-400' : 'text-slate-500'
        }`}>
          {title}
        </span>
        {icon && (
          <div className={`p-2 rounded-lg border transition-colors ${
            isDark
              ? 'bg-graphite-800/80 text-cyan-electric border-graphite-700/50 group-hover:border-cyan-500/30'
              : 'bg-slate-100 text-cyan-700 border-slate-200 group-hover:border-cyan-500/40'
          }`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-2xl lg:text-3xl font-bold font-telemetry tracking-tight ${statusColors[status]}`}>
          {value}
        </span>
        {unit && <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{unit}</span>}
      </div>

      {(change || subtitle) && (
        <div className="mt-2 flex items-center justify-between text-xs">
          {change && (
            <span className={`font-mono font-medium flex items-center gap-1 ${
              trend ? trendColors[trend] : isDark ? 'text-graphite-400' : 'text-slate-500'
            }`}>
              {trend === 'up' && '▲'}
              {trend === 'down' && '▼'}
              {change}
            </span>
          )}
          {subtitle && (
            <span className={`truncate ml-auto ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{subtitle}</span>
          )}
        </div>
      )}
    </Card>
  );
};
