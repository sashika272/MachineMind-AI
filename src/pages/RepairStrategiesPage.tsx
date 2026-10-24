import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Wrench, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Package, 
  Sliders, 
  FileText,
  Star
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';

export const RepairStrategiesPage: React.FC = () => {
  const { repairStrategies, selectedStrategy, setSelectedStrategy, selectedMachine } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI-Synthesized Repair & Mitigation Strategies
            </h2>
            <Badge variant="cyan" size="sm">3 SCENARIOS EVALUATED</Badge>
          </div>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            MachineMind Action Engine · Targeted for {selectedMachine.name} ({selectedMachine.code})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('recommendations')}
            icon={<Sliders className="w-4 h-4" />}
          >
            Multi-Criteria Matrix
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('digital-twin')}
            icon={<Layers className="w-4 h-4" />}
          >
            Simulate Selected in Digital Twin
          </Button>
        </div>
      </div>

      {/* 3 Strategy Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {repairStrategies.map((strat) => {
          const isSelected = selectedStrategy.id === strat.id;

          return (
            <Card
              key={strat.id}
              onClick={() => setSelectedStrategy(strat)}
              className={`cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? isDark
                    ? 'border-cyan-electric shadow-cyan-glow bg-graphite-850'
                    : 'border-cyan-500 shadow-md bg-cyan-50/40'
                  : isDark
                    ? 'hover:border-graphite-600'
                    : 'hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={
                      strat.tier === 'balanced'
                        ? 'cyan'
                        : strat.tier === 'conservative'
                        ? 'amber'
                        : 'rose'
                    }
                    size="sm"
                  >
                    {strat.tier.toUpperCase()} TIER
                  </Badge>

                  {strat.isRecommended && (
                    <span className={`flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isDark 
                        ? 'text-cyan-electric bg-cyan-500/15 border-cyan-500/40' 
                        : 'text-cyan-800 bg-cyan-100 border-cyan-300'
                    }`}>
                      <Star className="w-3 h-3 fill-current" /> AI RECOMMENDED
                    </span>
                  )}
                </div>

                <h3 className={`text-base font-bold line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {strat.title}
                </h3>

                <p className={`mt-2 text-xs leading-relaxed line-clamp-3 ${isDark ? 'text-graphite-300' : 'text-slate-600'}`}>
                  {strat.description}
                </p>
              </div>

              <div className={`mt-5 pt-4 border-t space-y-2 font-mono text-xs ${
                isDark ? 'border-graphite-800' : 'border-slate-200'
              }`}>
                <div className={`flex items-center justify-between ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                  <span>Estimated Cost:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(strat.estimatedCost)}</span>
                </div>
                <div className={`flex items-center justify-between ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                  <span>Recovery Time:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{strat.recoveryTimeHours} hours</span>
                </div>
                <div className={`flex items-center justify-between ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                  <span>RUL Extension:</span>
                  <span className="text-emerald-500 font-bold">+{strat.expectedOutcome.rulExtensionDays} days</span>
                </div>
                <div className={`flex items-center justify-between ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                  <span>LOTO Electrical Lockout:</span>
                  <span className={`font-bold ${strat.lotoRequired ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {strat.lotoRequired ? 'REQUIRED' : 'NONE'}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selected Strategy In-Depth Execution Details */}
      <Card className={isDark ? 'border-cyan-500/30' : 'border-cyan-300 shadow-sm'}>
        <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                isDark ? 'text-cyan-electric' : 'text-cyan-700'
              }`}>
                SELECTED EXECUTION PROCEDURE
              </span>
              <Badge variant="cyan" size="sm">Score: {selectedStrategy.recommendationScore}/100</Badge>
            </div>
            <h3 className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {selectedStrategy.title}
            </h3>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('digital-twin')}
            icon={<Layers className="w-4 h-4" />}
          >
            Launch Digital Twin Simulation
          </Button>
        </div>

        {/* Step-by-Step Technical Procedure Checklist */}
        <div className="py-6">
          <h4 className={`text-sm font-semibold uppercase font-mono tracking-wider mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Turn-by-Turn Field Work Procedure ({selectedStrategy.procedure.length} Steps)
          </h4>

          <div className="space-y-4">
            {selectedStrategy.procedure.map((step) => (
              <div
                key={step.stepNumber}
                className={`p-4 rounded-xl border flex flex-col md:flex-row items-start gap-4 ${
                  isDark ? 'bg-graphite-950/80 border-graphite-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
                  isDark 
                    ? 'bg-cyan-500/20 text-cyan-electric border-cyan-500/40' 
                    : 'bg-cyan-100 text-cyan-800 border-cyan-300 font-extrabold'
                }`}>
                  {step.stepNumber}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h5 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {step.title}
                    </h5>
                    <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                      Est: {step.estimatedMinutes} minutes
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-graphite-300' : 'text-slate-700'}`}>
                    {step.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                    <div className={isDark ? 'text-graphite-400' : 'text-slate-500'}>
                      <strong className={isDark ? 'text-graphite-300' : 'text-slate-700'}>Tools:</strong> {step.toolsRequired.join(', ')}
                    </div>
                    <div className="text-amber-500 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{step.safetyCheck}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parts Inventory & Safety Specs */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          {/* Required Parts */}
          <div>
            <h4 className={`text-xs font-mono uppercase tracking-wider mb-3 flex items-center gap-2 font-semibold ${
              isDark ? 'text-graphite-400' : 'text-slate-600'
            }`}>
              <Package className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
              Warehouse Stock Verification
            </h4>

            <div className="space-y-2">
              {selectedStrategy.requiredParts.map((part) => (
                <div
                  key={part.partNo}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className={`font-semibold ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>{part.name}</div>
                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{part.partNo}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold">
                      IN STOCK
                    </span>
                    <div className={`text-[11px] mt-1 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{formatCurrency(part.costUsd)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Protocols */}
          <div>
            <h4 className={`text-xs font-mono uppercase tracking-wider mb-3 flex items-center gap-2 font-semibold ${
              isDark ? 'text-graphite-400' : 'text-slate-600'
            }`}>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Environmental Health & Safety (EHS) Requirements
            </h4>

            <ul className="space-y-2 text-xs font-mono">
              {selectedStrategy.safetyRequirements.map((req, idx) => (
                <li
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    isDark ? 'bg-graphite-950/60 border-graphite-800 text-graphite-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-amber-500 font-bold">!</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
