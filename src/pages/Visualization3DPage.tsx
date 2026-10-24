import React from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { IndustrialMotor3D } from '../components/three/IndustrialMotor3D';
import { 
  Cpu, 
  Layers, 
  Flame, 
  Crosshair, 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Maximize2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const Visualization3DPage: React.FC = () => {
  const { selectedMachine, selectedComponent, setSelectedComponent } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Header & Subsystem Pills */}
      <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              3D Digital Twin Studio · {selectedMachine.name}
            </h2>
            <Badge variant="cyan" size="sm">INTERACTIVE WebGL</Badge>
          </div>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            Procedural High-Fidelity Physics Model · Frame {selectedMachine.modelSpecs.frameSize} · {selectedMachine.modelSpecs.ratedKw}kW
          </p>
        </div>

        {/* Subsystem Quick Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {selectedMachine.components.map((comp) => {
            const isSelected = selectedComponent?.id === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedComponent(comp)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 font-semibold ${
                  isSelected
                    ? isDark 
                      ? 'bg-cyan-500/20 text-cyan-electric border border-cyan-500/40 shadow-cyan-glow'
                      : 'bg-cyan-100 text-cyan-900 border border-cyan-400 shadow-sm'
                    : comp.status === 'critical'
                    ? isDark
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                      : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                    : isDark
                      ? 'bg-graphite-800 text-graphite-300 hover:text-white border border-graphite-700'
                      : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {comp.status === 'critical' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                <span>{comp.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Model Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <IndustrialMotor3D hideInspectorOverlay />
        </div>

        {/* Component Deep-Dive Inspection Panel */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <Card className="flex-1 flex flex-col justify-between">
            <div>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isDark ? 'border-graphite-800' : 'border-slate-200'
              }`}>
                <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                  isDark ? 'text-cyan-electric' : 'text-cyan-700'
                }`}>
                  Component Inspector
                </span>
                {selectedComponent && (
                  <Badge
                    variant={
                      selectedComponent.status === 'critical'
                        ? 'rose'
                        : selectedComponent.status === 'warning'
                        ? 'amber'
                        : 'emerald'
                    }
                    size="sm"
                    pulse={selectedComponent.status === 'critical'}
                  >
                    {selectedComponent.status.toUpperCase()}
                  </Badge>
                )}
              </div>

              {selectedComponent ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {selectedComponent.name}
                    </h3>
                    <div className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                      Type ID: {selectedComponent.type} · Inspected: {selectedComponent.inspectedDate || '2026-10-21'}
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed p-3 rounded-xl border ${
                    isDark ? 'text-graphite-300 bg-graphite-950/60 border-graphite-800' : 'text-slate-700 bg-slate-50 border-slate-200'
                  }`}>
                    {selectedComponent.description}
                  </p>

                  {/* Component Telemetry Stats */}
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className={`p-3 rounded-xl border ${
                      isDark ? 'bg-graphite-800/60 border-graphite-700/60' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div className={`text-[10px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>HEALTH SCORE</div>
                      <div className={`text-xl font-bold mt-1 ${
                        selectedComponent.healthScore < 50 ? 'text-rose-500 font-extrabold' : selectedComponent.healthScore < 80 ? 'text-amber-500 font-extrabold' : 'text-emerald-500 font-extrabold'
                      }`}>
                        {selectedComponent.healthScore}%
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${
                      isDark ? 'bg-graphite-800/60 border-graphite-700/60' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div className={`text-[10px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>CORE TEMPERATURE</div>
                      <div className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {selectedComponent.temperature} °C
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${
                      isDark ? 'bg-graphite-800/60 border-graphite-700/60' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div className={`text-[10px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>VIBRATION VELOCITY</div>
                      <div className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {selectedComponent.vibration} <span className={`text-[10px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>mm/s</span>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${
                      isDark ? 'bg-graphite-800/60 border-graphite-700/60' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div className={`text-[10px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>FAILURE RISK (14D)</div>
                      <div className={`text-xl font-bold mt-1 ${
                        selectedComponent.failureProbability > 0.5 ? 'text-rose-500 font-extrabold' : 'text-emerald-500 font-extrabold'
                      }`}>
                        {(selectedComponent.failureProbability * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {selectedComponent.recommendation && (
                    <div className={`p-3 rounded-xl border text-xs ${
                      isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200 text-cyan-900'
                    }`}>
                      <span className={`font-semibold block mb-1 font-mono ${
                        isDark ? 'text-cyan-400' : 'text-cyan-800'
                      }`}>
                        ENGINEERING RECOMMENDATION
                      </span>
                      <p className={`leading-relaxed ${isDark ? 'text-graphite-300' : 'text-slate-700'}`}>
                        {selectedComponent.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`py-12 text-center text-xs font-mono ${
                  isDark ? 'text-graphite-500' : 'text-slate-400'
                }`}>
                  Select a machine component in the 3D model or from the list above to view telemetry specs.
                </div>
              )}
            </div>

            <div className={`mt-6 pt-4 border-t space-y-2 ${
              isDark ? 'border-graphite-800' : 'border-slate-200'
            }`}>
              <Button
                variant="primary"
                className="w-full text-xs"
                onClick={() => navigate('root-cause')}
                icon={<Crosshair className="w-4 h-4" />}
              >
                Bayesian Root Cause Analysis
              </Button>
              <Button
                variant="secondary"
                className="w-full text-xs"
                onClick={() => navigate('repair-strategies')}
                icon={<Wrench className="w-4 h-4" />}
              >
                Synthesize Repair Plan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
