import React from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Crosshair, 
  Cpu, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle, 
  Layers, 
  Wrench,
  Flame,
  Activity,
  GitBranch
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const RootCausePage: React.FC = () => {
  const { rootCause, selectedMachine, setSelectedComponent } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();

  const handleInspectIn3D = () => {
    const comp = selectedMachine.components.find((c) => c.type === rootCause.affectedComponent);
    if (comp) {
      setSelectedComponent(comp);
    }
    navigate('3d-model');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Bayesian Root Cause & Physics Diagnostic Chain
            </h2>
            <Badge variant="rose" size="sm">CONFIRMED ROOT CAUSE</Badge>
          </div>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            Causal Inference Engine · ISO 13373-2 Condition Monitoring Standards
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleInspectIn3D}
            icon={<Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
          >
            Highlight in 3D Model
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('repair-strategies')}
            icon={<Wrench className="w-4 h-4" />}
          >
            Review Repair Strategies
          </Button>
        </div>
      </div>

      {/* Affected Component Spotlight */}
      <Card className={isDark ? 'border-rose-500/30 shadow-crimson-glow' : 'border-rose-400 shadow-sm'}>
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-rose-500 uppercase tracking-wider font-semibold">
                ISOLATED FAULT TARGET
              </span>
              <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                Asset: {selectedMachine.name}
              </span>
            </div>
            <h3 className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {rootCause.affectedComponentName}
            </h3>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="text-right">
              <span className={`block text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Diagnostic Confidence</span>
              <span className="text-xl font-bold text-emerald-500">{rootCause.confidence}%</span>
            </div>
            <div className="text-right">
              <span className={`block text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Uncertainty Bounds</span>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {rootCause.uncertaintyBand.lower}% – {rootCause.uncertaintyBand.upper}%
              </span>
            </div>
          </div>
        </div>

        {/* Primary Cause Text */}
        <div className="pt-4">
          <span className={`text-xs font-mono uppercase block mb-1 font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            EXACT PRIMARY PHYSICAL MECHANISM
          </span>
          <p className={`text-sm font-medium leading-relaxed p-4 rounded-xl border ${
            isDark ? 'text-graphite-100 bg-graphite-950/70 border-graphite-800' : 'text-slate-800 bg-slate-50 border-slate-200'
          }`}>
            {rootCause.primaryCause}
          </p>
        </div>
      </Card>

      {/* Bayesian Causal Chain Node Graph */}
      <Card>
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <GitBranch className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
              Causal Fault Tree & Mechanism Propagation
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Probabilistic progression from environmental root stressor to observed sensor telemetry spikes
            </p>
          </div>
          <Badge variant="cyan" size="sm">5 Connected Nodes</Badge>
        </div>

        <div className="pt-6 pb-2 space-y-4">
          {rootCause.causalChain.map((node, index) => {
            const isRoot = node.type === 'root';
            const isMech = node.type === 'mechanism';
            const isSym = node.type === 'symptom';

            return (
              <div key={node.id} className="relative group">
                {/* Connector line */}
                {index < rootCause.causalChain.length - 1 && (
                  <div className={`absolute left-6 top-12 bottom-0 w-0.5 z-0 ${
                    isDark ? 'bg-gradient-to-b from-cyan-500/40 to-graphite-700' : 'bg-gradient-to-b from-cyan-500/50 to-slate-300'
                  }`} />
                )}

                <div className={`relative z-10 flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  isDark ? 'bg-graphite-950/80 border-graphite-800 hover:border-cyan-500/40' : 'bg-slate-50 border-slate-200 hover:border-cyan-600'
                }`}>
                  {/* Step Icon Badge */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                    isRoot
                      ? isDark
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-glow'
                        : 'bg-amber-100 text-amber-800 border-amber-300 font-extrabold'
                      : isMech
                      ? isDark
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-cyan-100 text-cyan-800 border-cyan-300 font-extrabold'
                      : isDark
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-crimson-glow'
                        : 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold'
                  }`}>
                    {isRoot ? 'ROOT' : isMech ? 'MECH' : 'SYMPT'}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {node.label}
                      </h4>
                      <span className={`text-xs font-mono font-semibold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>
                        P(Node) = {node.probability}%
                      </span>
                    </div>

                    <p className={`mt-1 text-xs font-mono leading-relaxed ${isDark ? 'text-graphite-300' : 'text-slate-700'}`}>
                      {node.evidence}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Contributing Factors & Supporting Telemetry Z-Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contributing Factors */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <h3 className={`text-base font-semibold pb-3 border-b ${isDark ? 'text-white border-graphite-800' : 'text-slate-900 border-slate-200'}`}>
              Multivariate Contributing Stressors
            </h3>

            <div className="mt-4 space-y-4">
              {rootCause.contributingFactors.map((factor, idx) => (
                <div key={idx} className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>{factor.factor}</span>
                    <span className={`font-bold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>{factor.weight}% Weight</span>
                  </div>
                  <div className={`h-2 w-full rounded-full overflow-hidden border ${isDark ? 'bg-graphite-950 border-graphite-800' : 'bg-slate-200 border-slate-300'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-cyan-electric to-electric-blue rounded-full"
                      style={{ width: `${factor.weight}%` }}
                    />
                  </div>
                  <p className={`text-[11px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{factor.impact}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Supporting Telemetry Z-Scores */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <h3 className={`text-base font-semibold pb-3 border-b ${isDark ? 'text-white border-graphite-800' : 'text-slate-900 border-slate-200'}`}>
                Statistical Anomaly Z-Scores
              </h3>
              <p className={`text-xs font-mono mt-1 mb-4 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                Standard deviations above healthy operational baseline
              </p>

              <div className="space-y-3 font-mono text-xs">
                {rootCause.supportingTelemetry.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className={`font-bold ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>{item.metric}</div>
                      <div className={`text-[11px] mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{item.description}</div>
                    </div>
                    <div className="text-right pl-3">
                      <span className="text-lg font-bold text-rose-500">+{item.zScore}σ</span>
                      <span className={`block text-[10px] ${isDark ? 'text-graphite-500' : 'text-slate-400'}`}>Z-Score</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full text-xs mt-6"
              onClick={() => navigate('repair-strategies')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Configure Mitigating Repair Strategies
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
