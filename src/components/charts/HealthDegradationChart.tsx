import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Legend 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface DegradationDataPoint {
  day: number;
  dateStr: string;
  unmitigatedHealth: number;
  mitigatedHealth: number;
  threshold: number;
}

export const HealthDegradationChart: React.FC<{
  data: DegradationDataPoint[];
  height?: number;
}> = ({ data, height = 260 }) => {
  const { isDark } = useTheme();

  const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
  const axisStroke = isDark ? '#475569' : '#94a3b8';
  const tickFill = isDark ? '#64748b' : '#475569';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';
  const tooltipShadow = isDark ? '0 8px 24px rgba(0,0,0,0.6)' : '0 10px 25px -5px rgba(0,0,0,0.12)';

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis 
            dataKey="dateStr" 
            stroke={axisStroke} 
            tick={{ fill: tickFill, fontSize: 10, fontFamily: 'monospace' }} 
          />
          <YAxis 
            domain={[0, 100]} 
            stroke={axisStroke} 
            tick={{ fill: tickFill, fontSize: 10, fontFamily: 'monospace' }} 
            unit="%" 
          />
          <Tooltip
            cursor={{ stroke: isDark ? '#38bdf8' : '#0284c7', strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: tooltipText,
              boxShadow: tooltipShadow
            }}
            itemStyle={{
              color: tooltipText,
              fontSize: '11px',
              fontFamily: 'monospace'
            }}
            labelStyle={{
              color: isDark ? '#38bdf8' : '#0284c7',
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 600,
              marginBottom: '4px'
            }}
          />
          <Legend 
            wrapperStyle={{ 
              fontSize: '11px', 
              fontFamily: 'monospace', 
              paddingTop: '10px',
              color: isDark ? '#cbd5e1' : '#334155'
            }} 
          />
          <ReferenceLine 
            y={40} 
            stroke={isDark ? '#ef4444' : '#dc2626'} 
            strokeDasharray="4 4" 
            label={{ value: 'Trip Threshold (40%)', fill: isDark ? '#ef4444' : '#dc2626', fontSize: 10, position: 'insideBottomRight' }} 
          />
          <Line
            type="monotone"
            name="Unmitigated Runway (Projected Failure)"
            dataKey="unmitigatedHealth"
            stroke={isDark ? '#ef4444' : '#dc2626'}
            strokeWidth={3}
            dot={{ r: 4, fill: isDark ? '#ef4444' : '#dc2626' }}
          />
          <Line
            type="monotone"
            name="Post-Repair Health Restoration"
            dataKey="mitigatedHealth"
            stroke={isDark ? '#10b981' : '#059669'}
            strokeWidth={3}
            strokeDasharray="3 3"
            dot={{ r: 4, fill: isDark ? '#10b981' : '#059669' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
