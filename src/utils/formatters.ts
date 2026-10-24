import { MachineStatus, FaultSeverity } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(num: number, digits: number = 1): string {
  return Number(num).toFixed(digits);
}

export function formatRPM(rpm: number): string {
  return new Intl.NumberFormat('en-US').format(rpm) + ' RPM';
}

export function getStatusColor(status: MachineStatus | string) {
  switch (status) {
    case 'optimal':
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
        glow: 'shadow-emerald-glow'
      };
    case 'nominal':
      return {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        dot: 'bg-cyan-400',
        glow: 'shadow-cyan-glow'
      };
    case 'warning':
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        dot: 'bg-amber-400',
        glow: 'shadow-amber-glow'
      };
    case 'critical':
      return {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
        dot: 'bg-rose-400',
        glow: 'shadow-crimson-glow'
      };
    default:
      return {
        bg: 'bg-graphite-700/30',
        border: 'border-graphite-600',
        text: 'text-graphite-400',
        dot: 'bg-graphite-400',
        glow: ''
      };
  }
}

export function getSeverityBadge(severity: FaultSeverity | string) {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/40',
        text: 'text-rose-400',
        label: 'CRITICAL'
      };
    case 'high':
      return {
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        label: 'HIGH'
      };
    case 'medium':
      return {
        bg: 'bg-yellow-500/15',
        border: 'border-yellow-500/40',
        text: 'text-yellow-400',
        label: 'MEDIUM'
      };
    default:
      return {
        bg: 'bg-cyan-500/15',
        border: 'border-cyan-500/40',
        text: 'text-cyan-400',
        label: 'LOW'
      };
  }
}
