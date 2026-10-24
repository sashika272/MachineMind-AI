import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TelemetryPoint } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface TelemetryLineChartProps {
  data: TelemetryPoint[];
  metric: 'temperature' | 'vibration' | 'powerKw' | 'rpm';
  height?: number;
}

export const TelemetryLineChart: React.FC<TelemetryLineChartProps> = ({ 
  data, 
  metric,
  height = 240 
}) => {
  const { isDark } = useTheme();

  const metricConfigs = {
    temperature: {
      color: isDark ? '#ef4444' : '#dc2626',
      unit: '°C',
      name: 'DE Bearing Temp',
      domain: [50, 110],
      threshold: 85
    },
    vibration: {
      color: isDark ? '#00e5ff' : '#0891b2',
      unit: 'mm/s',
      name: 'Vibration Velocity RMS',
      domain: [0, 14],
      threshold: 4.5
    },
    powerKw: {
      color: isDark ? '#3b82f6' : '#2563eb',
      unit: 'kW',
      name: 'Active Power',
      domain: [350, 480],
      threshold: 450
    },
    rpm: {
      color: isDark ? '#10b981' : '#059669',
      unit: 'RPM',
      name: 'Shaft Speed',
      domain: [2900, 3050],
      threshold: 3000
    }
  };

  const config = metricConfigs[metric];

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
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={config.color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={config.color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis 
            dataKey="timeStr" 
            stroke={axisStroke} 
            tick={{ fill: tickFill, fontSize: 10, fontFamily: 'monospace' }} 
            tickLine={false} 
          />
          <YAxis 
            domain={config.domain as [number, number]} 
            stroke={axisStroke} 
            tick={{ fill: tickFill, fontSize: 10, fontFamily: 'monospace' }} 
            tickLine={false} 
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
            formatter={(val: any) => [`${val} ${config.unit}`, config.name]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={config.color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradient-${metric})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
