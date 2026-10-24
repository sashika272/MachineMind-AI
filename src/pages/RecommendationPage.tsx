import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiClient } from '../services/apiClient';
import { 
  Sliders, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Zap, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  FileText, 
  Award,
  Layers,
  Calendar
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';

export const RecommendationPage: React.FC = () => {
  const { repairStrategies, selectedMachine, setSelectedStrategy } = useMachine();
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [committedWorkOrder, setCommittedWorkOrder] = useState<any | null>(null);

  const recommendedStrat = repairStrategies.find(s => s.isRecommended) || repairStrategies[0];

  const handleCommitWorkOrder = async () => {
    setIsCommitting(true);
    try {
      const res = await apiClient.recommendations.commit(
        selectedMachine.id,
        recommendedStrat.id,
        user?.name || "Dr. Elena Vance"
      );
      setCommittedWorkOrder(res);
    } catch (err) {
      console.error("Failed to commit work order:", err);
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Multi-Criteria Decision Analysis (MCDA) & AI Recommendations
            </h2>
            <Badge variant="cyan" size="sm">OPTIMIZED TRADE-OFFS</Badge>
          </div>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            Ranked against Safety, Total Cost of Ownership, Outage Duration, and Energy Impact
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('repair-strategies')}
          >
            Review Step Procedures
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('predictive')}
            icon={<TrendingUp className="w-4 h-4" />}
          >
            Predictive Schedule
          </Button>
        </div>
      </div>

      {/* Committed Work Order Banner */}
      {committedWorkOrder && (
        <Card className={`animate-in slide-in-from-top duration-300 ${
          isDark 
            ? 'border-emerald-500/50 shadow-emerald-glow bg-emerald-950/20' 
            : 'border-emerald-400 shadow-sm bg-emerald-50/80 text-emerald-950'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`text-sm font-bold flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Work Order Approved & Committed ({committedWorkOrder.workOrderId})
                  <Badge variant="emerald" size="sm">PERSISTED TO DB</Badge>
                </h4>
                <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-300' : 'text-slate-700'}`}>
                  {committedWorkOrder.title} · Technician: {committedWorkOrder.technician} · Budget: {formatCurrency(committedWorkOrder.costUsd)}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('history')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View in Machine History
            </Button>
          </div>
        </Card>
      )}

      {/* Recommended Strategy Spotlight Card */}
      <Card className={`border ${
        isDark 
          ? 'border-cyan-500/40 shadow-cyan-glow bg-gradient-to-r from-graphite-900 via-graphite-900 to-cyan-950/20' 
          : 'border-cyan-400 shadow-md bg-gradient-to-r from-white via-cyan-50/30 to-white text-slate-900'
      }`}>
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                isDark 
                  ? 'bg-cyan-500/20 text-cyan-electric border-cyan-500/40' 
                  : 'bg-cyan-100 text-cyan-800 border-cyan-300'
              }`}>
                <Star className="w-3.5 h-3.5 fill-current" />
                RECOMMENDED STRATEGY (#1 OPTIMAL)
              </span>
              <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Score: {recommendedStrat.recommendationScore}/100</span>
            </div>

            <h3 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {recommendedStrat.title}
            </h3>

            <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${isDark ? 'text-graphite-300' : 'text-slate-700'}`}>
              {recommendedStrat.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSelectedStrategy(recommendedStrat);
                navigate('digital-twin');
              }}
              icon={<Layers className="w-4 h-4" />}
            >
              Simulate in Digital Twin
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCommitWorkOrder}
              loading={isCommitting}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              {committedWorkOrder ? 'Re-Approve Order' : 'Approve & Schedule Work Order'}
            </Button>
          </div>
        </div>

        {/* 4 Quantitative Impact Metrics */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-graphite-950/70 border-graphite-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Total Outage Cost</span>
            <div className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(recommendedStrat.estimatedCost)}
            </div>
            <span className="text-[10px] text-emerald-500 mt-0.5 block font-sans font-semibold">
              74% cheaper than motor swap
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-graphite-950/70 border-graphite-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Facility Downtime</span>
            <div className={`text-2xl font-bold mt-1 ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>
              {recommendedStrat.recoveryTimeHours} hrs
            </div>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 mt-0.5 block font-sans font-semibold">
              Matches shift changeover
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-graphite-950/70 border-graphite-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>RUL Gain Post-Fix</span>
            <div className="text-2xl font-bold text-emerald-500 mt-1">
              +{recommendedStrat.expectedOutcome.rulExtensionDays} Days
            </div>
            <span className="text-[10px] text-emerald-500 mt-0.5 block font-sans font-semibold">
              Resets bearing L10h life
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-graphite-950/70 border-graphite-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Efficiency Gain</span>
            <div className="text-2xl font-bold text-amber-500 mt-1">
              +{recommendedStrat.efficiencyImpactPercent}%
            </div>
            <span className={`text-[10px] mt-0.5 block font-sans ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Reduces friction heat loss
            </span>
          </div>
        </div>
      </Card>

      {/* Multi-Criteria Comparison Matrix Table */}
      <Card>
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Multi-Attribute Decision Matrix
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Direct comparison between Conservative, Balanced, and Aggressive pathways
            </p>
          </div>
          <Badge variant="cyan" size="sm">MCDA Matrix v1.4</Badge>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b ${isDark ? 'border-graphite-800 text-graphite-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="pb-3 font-semibold">DECISION METRIC</th>
                {repairStrategies.map((s) => (
                  <th key={s.id} className={`pb-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {s.title.split(' ')[0]} {s.title.split(' ')[1]}
                    {s.isRecommended && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isDark ? 'bg-cyan-500/20 text-cyan-electric' : 'bg-cyan-100 text-cyan-800'
                      }`}>
                        ★ BEST
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-graphite-800/60' : 'divide-slate-200'}`}>
              <tr>
                <td className={`py-3 font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>Tier Category</td>
                {repairStrategies.map((s) => (
                  <td key={s.id} className={`py-3 font-bold uppercase ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>
                    {s.tier}
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`py-3 font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>Overall AI Score</td>
                {repairStrategies.map((s) => (
                  <td key={s.id} className={`py-3 font-bold text-sm ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>
                    {s.recommendationScore} / 100
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`py-3 font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>Direct Cost (USD)</td>
                {repairStrategies.map((s) => (
                  <td key={s.id} className={`py-3 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {formatCurrency(s.estimatedCost)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`py-3 font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>Required Downtime</td>
                {repairStrategies.map((s) => (
                  <td key={s.id} className={`py-3 ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>
                    {s.downtimeHours} hours
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`py-3 font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>RUL Extension</td>
                {repairStrategies.map((s) => (
                  <td key={s.id} className="py-3 font-bold text-emerald-500">
                    +{s.expectedOutcome.rulExtensionDays} days
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`py-3 font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>Risk Reduction</td>
                {repairStrategies.map((s) => (
                  <td key={s.id} className="py-3 font-bold text-emerald-500">
                    {s.expectedOutcome.riskReductionPercent}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`py-3 font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>LOTO Required</td>
                {repairStrategies.map((s) => (
                  <td key={s.id} className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.lotoRequired 
                        ? (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-800') 
                        : (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800')
                    }`}>
                      {s.lotoRequired ? 'YES (6.6kV)' : 'NO'}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className={`py-3 font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>Warehouse Parts</td>
                {repairStrategies.map((s) => (
                  <td key={s.id} className="py-3 text-emerald-500 font-semibold">
                    ✓ All Parts In-Stock
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
