import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell, 
  ReferenceLine 
} from 'recharts';
import { VibrationSpectrumPoint } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface VibrationSpectrumChartProps {
  data: VibrationSpectrumPoint[];
  height?: number;
}

export const VibrationSpectrumChart: React.FC<VibrationSpectrumChartProps> = ({ 
  data, 
  height = 240 
}) => {
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
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis 
            dataKey="frequency" 
            stroke={axisStroke} 
            tick={{ fill: tickFill, fontSize: 10, fontFamily: 'monospace' }} 
            unit=" Hz" 
          />
          <YAxis 
            stroke={axisStroke} 
            tick={{ fill: tickFill, fontSize: 10, fontFamily: 'monospace' }} 
            unit=" mm/s" 
          />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.08)' }}
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
            formatter={(val: any, _, item: any) => [
              `${val} mm/s RMS ${item.payload.label ? `(${item.payload.label})` : ''}`,
              'Spectral Amplitude'
            ]}
            labelFormatter={(freq) => `Frequency: ${freq} Hz`}
          />
          <ReferenceLine y={2.8} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'ISO Warning (2.8 mm/s)', fill: isDark ? '#f59e0b' : '#d97706', fontSize: 9, position: 'top' }} />
          <ReferenceLine y={4.5} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'ISO Critical (4.5 mm/s)', fill: isDark ? '#ef4444' : '#dc2626', fontSize: 9, position: 'top' }} />
          <Bar dataKey="amplitude" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => {
              const isExceeded = entry.amplitude > 4.5;
              const isWarning = entry.amplitude > 2.8;
              const fill = isExceeded ? (isDark ? '#ef4444' : '#dc2626') : isWarning ? (isDark ? '#f59e0b' : '#d97706') : (isDark ? '#00e5ff' : '#0891b2');
              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
