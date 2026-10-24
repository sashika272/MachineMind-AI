import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Crosshair, 
  Layers, 
  SlidersHorizontal,
  Flame,
  Activity
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { getSeverityBadge } from '../utils/formatters';

export const FaultDetectionPage: React.FC = () => {
  const { allFaults, selectMachine } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();

  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  const filteredFaults = allFaults.filter((f) => 
    severityFilter === 'all' ? true : f.severity === severityFilter
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Autonomous Fault Detection & Classification
            </h2>
            <Badge variant="rose" size="sm" pulse>
              {allFaults.filter(f => f.status === 'active').length} ACTIVE
            </Badge>
          </div>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            Continuous anomaly classification via ISO 10816 spectral pattern recognition
          </p>
        </div>

        {/* Severity Filters */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          isDark ? 'bg-graphite-950 border-graphite-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors font-semibold ${
              severityFilter === 'all'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-electric border border-cyan-500/40 font-bold'
                  : 'bg-white text-cyan-800 border border-cyan-300 shadow-xs font-bold'
                : isDark
                  ? 'text-graphite-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Faults ({allFaults.length})
          </button>
          <button
            onClick={() => setSeverityFilter('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors font-semibold ${
              severityFilter === 'critical'
                ? isDark
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                  : 'bg-white text-rose-800 border border-rose-300 shadow-xs font-bold'
                : isDark
                  ? 'text-graphite-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setSeverityFilter('high')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors font-semibold ${
              severityFilter === 'high'
                ? isDark
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                  : 'bg-white text-amber-800 border border-amber-300 shadow-xs font-bold'
                : isDark
                  ? 'text-graphite-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setSeverityFilter('medium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors font-semibold ${
              severityFilter === 'medium'
                ? isDark
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold'
                  : 'bg-white text-yellow-800 border border-yellow-300 shadow-xs font-bold'
                : isDark
                  ? 'text-graphite-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Medium
          </button>
        </div>
      </div>

      {/* Fault Cards List */}
      <div className="space-y-4">
        {filteredFaults.map((fault) => {
          const badgeConfig = getSeverityBadge(fault.severity);

          return (
            <Card
              key={fault.id}
              className={`p-6 transition-all ${
                fault.severity === 'critical'
                  ? isDark
                    ? 'border-rose-500/40 shadow-crimson-glow bg-graphite-900/95'
                    : 'border-rose-400 shadow-sm bg-white'
                  : isDark
                    ? 'hover:border-graphite-600'
                    : 'hover:border-slate-300'
              }`}
            >
              <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b ${
                isDark ? 'border-graphite-800' : 'border-slate-200'
              }`}>
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border mt-0.5 ${
                    fault.severity === 'critical'
                      ? isDark
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                        : 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                      : isDark
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-amber-100 text-amber-700 border-amber-300'
                  }`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border ${badgeConfig.bg} ${badgeConfig.border} ${badgeConfig.text}`}>
                        {badgeConfig.label}
                      </span>
                      <span className={`text-xs font-mono font-semibold ${
                        isDark ? 'text-cyan-electric' : 'text-cyan-700'
                      }`}>
                        {fault.id}
                      </span>
                      <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                        Detected: {fault.detectedAt}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {fault.title}
                    </h3>
                    <div className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                      Asset: <span className={`font-semibold ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>{fault.machineName} ({fault.machineCode})</span> · Subsystem: <span className={isDark ? 'text-cyan-400' : 'text-cyan-700'}>{fault.affectedComponentName}</span>
                    </div>
                  </div>
                </div>

                {/* AI Confidence Meter */}
                <div className={`flex items-center gap-4 p-3 rounded-xl border ${
                  isDark ? 'bg-graphite-950/70 border-graphite-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-right font-mono">
                    <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>AI CONFIDENCE</div>
                    <div className="text-xl font-bold text-emerald-500">{fault.confidenceScore}%</div>
                  </div>
                  <div className="h-10 w-10 rounded-full border-2 border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-500 font-mono">
                    ✓
                  </div>
                </div>
              </div>

              {/* Description & Primary Cause */}
              <div className="py-4 space-y-3">
                <p className={`text-sm leading-relaxed ${isDark ? 'text-graphite-300' : 'text-slate-700'}`}>
                  {fault.summary}
                </p>

                <div className={`p-3.5 rounded-xl border text-xs font-mono ${
                  isDark ? 'bg-graphite-950/80 border-graphite-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`uppercase text-[10px] block mb-1 font-semibold ${
                    isDark ? 'text-graphite-400' : 'text-slate-500'
                  }`}>
                    PRIMARY DIAGNOSTIC CAUSE
                  </span>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {fault.primaryCause}
                  </p>
                </div>
              </div>

              {/* Sensor Evidence Table */}
              <div className="pt-2">
                <div className={`text-xs font-mono uppercase mb-2 font-semibold ${
                  isDark ? 'text-graphite-400' : 'text-slate-500'
                }`}>
                  EMPIRICAL SENSOR EVIDENCE ({fault.sensorEvidence.length} SIGNALS)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {fault.sensorEvidence.map((ev, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                        isDark ? 'bg-graphite-950/50 border-graphite-800/80' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className={`font-semibold ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>{ev.sensor}</div>
                        <div className={`text-[11px] mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                          Baseline: {ev.baselineValue}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          ev.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'
                        }`}>
                          {ev.currentValue}
                        </div>
                        <div className="text-[10px] text-rose-500 font-semibold mt-0.5">
                          {ev.deviation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className={`mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                isDark ? 'border-graphite-800' : 'border-slate-200'
              }`}>
                <div className={`flex items-center gap-2 text-xs font-mono ${
                  isDark ? 'text-graphite-400' : 'text-slate-600'
                }`}>
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Functional Failure Runway: <strong className="text-rose-500 font-bold">{fault.estimatedDegradationDays} operating days</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      selectMachine(fault.machineId);
                      navigate('root-cause');
                    }}
                    icon={<Crosshair className="w-3.5 h-3.5" />}
                  >
                    Bayesian Root Cause
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      selectMachine(fault.machineId);
                      navigate('repair-strategies');
                    }}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Repair Plan
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
