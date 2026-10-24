import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { mockAnalyticsSummary } from '../services/mockData';
import { formatCurrency } from '../utils/formatters';
import { apiClient } from '../services/apiClient';
import { useMachine } from '../context/MachineContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const AnalyticsReportsPage: React.FC = () => {
  const { selectedMachine } = useMachine();
  const { isDark } = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportReport = () => {
    setDownloading(true);
    apiClient.reports.downloadPdf(selectedMachine?.id || "MTR-704");
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 800);
  };

  const handleExportCsv = () => {
    apiClient.reports.downloadCsv(selectedMachine?.id || "MTR-704");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl bg-graphite-900 border border-graphite-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">
              Fleet Reliability Analytics & Financial Impact
            </h2>
            <Badge variant="cyan" size="sm">ENTERPRISE Q4 REPORT</Badge>
          </div>
          <p className="text-xs font-mono text-graphite-400 mt-0.5">
            Operational MTBF, Unplanned Outage Attribution & Cost Avoidance Models
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            icon={<Download className="w-4 h-4 text-cyan-400" />}
          >
            Export Raw CSV Telemetry
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportReport}
            loading={downloading}
            icon={downloadSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          >
            {downloadSuccess ? 'PDF Report Generated' : 'Export Executive PDF Brief'}
          </Button>
        </div>
      </div>

      {/* 4 Core Financial & Reliability Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mean Time Between Failures"
          value={mockAnalyticsSummary.mtbfHours}
          unit="Hours"
          status="optimal"
          trend="up"
          change="+18.4% YoY"
          icon={<Clock className="w-4 h-4" />}
          subtitle="Fleet Target: 4,500 hrs"
        />
        <StatCard
          title="Mean Time To Repair (MTTR)"
          value={mockAnalyticsSummary.mttrHours}
          unit="Hours"
          status="optimal"
          trend="down"
          change="-32% faster diagnosis"
          icon={<TrendingUp className="w-4 h-4" />}
          subtitle="Guided by AI Procedures"
        />
        <StatCard
          title="Avoided Outage Loss"
          value={formatCurrency(mockAnalyticsSummary.avoidedDowntimeSavingsUsd)}
          status="optimal"
          icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
          subtitle="YTD Net Cost Avoidance"
        />
        <StatCard
          title="Total Maintenance Spend"
          value={formatCurrency(mockAnalyticsSummary.maintenanceSpendYearUsd)}
          status="nominal"
          icon={<Activity className="w-4 h-4" />}
          subtitle="Within 88% Budget Cap"
        />
      </div>

      {/* Monthly Planned vs Unplanned Outage Hours Chart */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-graphite-800">
          <div>
            <h3 className="text-base font-semibold text-white">
              6-Month Plant Outage Hours: Planned vs Unplanned
            </h3>
            <p className="text-xs font-mono text-graphite-400">
              Dramatic reduction in emergency catastrophic halts since AI deployment in July
            </p>
          </div>
          <Badge variant="emerald" size="sm">UNPLANNED -68%</Badge>
        </div>

        <div className="pt-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockAnalyticsSummary.monthlyDowntimeTrend}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
              <XAxis dataKey="month" stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fill: isDark ? '#64748b' : '#475569', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fill: isDark ? '#64748b' : '#475569', fontSize: 10, fontFamily: 'monospace' }} unit=" hrs" />
              <Tooltip
                cursor={{ fill: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.08)' }}
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.6)' : '0 10px 25px -5px rgba(0,0,0,0.12)'
                }}
                itemStyle={{
                  color: isDark ? '#f8fafc' : '#0f172a',
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
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px', color: isDark ? '#cbd5e1' : '#334155' }} />
              <Bar dataKey="plannedHours" name="Controlled Planned Overhaul (hrs)" fill={isDark ? '#0284c7' : '#0284c7'} radius={[4, 4, 0, 0]} />
              <Bar dataKey="unplannedHours" name="Emergency Unplanned Outage (hrs)" fill={isDark ? '#ef4444' : '#dc2626'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Fault Frequency Breakdown & Fleet Health Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fault Category Breakdown */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <h3 className="text-base font-semibold text-white pb-3 border-b border-graphite-800">
              Fault Inception by Component Category (All-Time)
            </h3>

            <div className="mt-4 space-y-4 font-mono text-xs">
              {mockAnalyticsSummary.faultTypeDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-graphite-200 font-semibold">{item.category}</span>
                    <span className="text-cyan-electric font-bold">
                      {item.count} Incidents ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-graphite-950 rounded-full overflow-hidden border border-graphite-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-electric to-blue-600 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Fleet Health Breakdown & Certification */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white pb-3 border-b border-graphite-800">
                Asset Health Integrity Breakdown
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-center text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold text-2xl">
                    {mockAnalyticsSummary.healthDistribution.optimal}
                  </span>
                  <span className="block text-[10px] text-graphite-400 mt-1 uppercase">Optimal Health</span>
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <span className="text-cyan-electric font-bold text-2xl">
                    {mockAnalyticsSummary.healthDistribution.nominal}
                  </span>
                  <span className="block text-[10px] text-graphite-400 mt-1 uppercase">Nominal Operating</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-amber-400 font-bold text-2xl">
                    {mockAnalyticsSummary.healthDistribution.warning}
                  </span>
                  <span className="block text-[10px] text-graphite-400 mt-1 uppercase">Warning / Degrading</span>
                </div>

                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <span className="text-rose-400 font-bold text-2xl">
                    {mockAnalyticsSummary.healthDistribution.critical}
                  </span>
                  <span className="block text-[10px] text-graphite-400 mt-1 uppercase">Trip Imminent</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-graphite-950/70 border border-graphite-800 text-xs font-mono text-graphite-300 mt-6">
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ISO 13374 Condition Monitoring Certified
              </div>
              Telemetry data ingested across OPC-UA, MQTT, and Modbus TCP channels meets Class 1 data integrity guidelines.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
