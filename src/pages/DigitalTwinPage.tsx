import React, { useState, useMemo } from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { runDigitalTwinSimulation } from '../services/simulationEngine';
import { 
  Layers, 
  Play, 
  RotateCcw, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  Flame, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  TrendingUp,
  FastForward
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { TelemetryLineChart } from '../components/charts/TelemetryLineChart';
import { IndustrialMotor3D } from '../components/three/IndustrialMotor3D';
import { apiClient } from '../services/apiClient';

export const DigitalTwinPage: React.FC = () => {
  const { selectedMachine, repairStrategies, selectedStrategy, setSelectedStrategy } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();

  // Simulation Controls & Parameters
  const [targetRpm, setTargetRpm] = useState<number>(3000);
  const [loadPercentage, setLoadPercentage] = useState<number>(92);
  const [ambientTempC, setAmbientTempC] = useState<number>(32);
  const [lubeQuality, setLubeQuality] = useState<number>(85);
  const [coolingAirflow, setCoolingAirflow] = useState<number>(100);
  const [appliedStrategyId, setAppliedStrategyId] = useState<string>(selectedStrategy?.id || 'strat-1');

  // Backend Persistence State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Animated Repair Sequence State
  const [simStep, setSimStep] = useState<number>(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);

  const handleSelectStrategy = (id: string) => {
    setAppliedStrategyId(id);
    const found = repairStrategies.find(s => s.id === id);
    if (found) setSelectedStrategy(found);
  };

  const handleSaveSimulation = async () => {
    setIsSaving(true);
    try {
      await apiClient.simulation.run({
        targetRpm,
        loadPercentage,
        ambientTempC,
        lubricationQualityPercent: lubeQuality,
        coolingAirflowPercent: coolingAirflow,
        appliedStrategyId
      }, selectedMachine.id);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Run simulation engine
  const simulation = useMemo(() => {
    return runDigitalTwinSimulation(selectedMachine, {
      targetRpm,
      loadPercentage,
      ambientTempC,
      lubricationQualityPercent: lubeQuality,
      coolingAirflowPercent: coolingAirflow,
      appliedStrategyId: appliedStrategyId || undefined
    });
  }, [selectedMachine, targetRpm, loadPercentage, ambientTempC, lubeQuality, coolingAirflow, appliedStrategyId]);

  const handleRunSequence = () => {
    setIsPlayingSequence(true);
    setSimStep(1);

    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setIsPlayingSequence(false);
          return 5;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handleReset = () => {
    setTargetRpm(3000);
    setLoadPercentage(92);
    setAmbientTempC(32);
    setLubeQuality(85);
    setCoolingAirflow(100);
    setAppliedStrategyId('strat-1');
    setSimStep(0);
    setIsPlayingSequence(false);
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
              Digital Twin Physics & Repair Simulator
            </h2>
            <Badge variant="cyan" size="sm">PHYSICS CO-SIMULATION</Badge>
          </div>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            Finite Element & Thermal Network Simulation · {selectedMachine.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Baseline
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSimulation}
            loading={isSaving}
            icon={saveSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Layers className="w-3.5 h-3.5" />}
          >
            {saveSuccess ? 'Saved to Database' : 'Save Simulation Run'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunSequence}
            loading={isPlayingSequence}
            icon={<Play className="w-3.5 h-3.5" />}
          >
            {isPlayingSequence ? 'Executing Sequence...' : 'Play Virtual Repair Sequence'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('recommendations')}
            icon={<ArrowRight className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />}
          >
            Decision Matrix
          </Button>
        </div>
      </div>

      {/* Repair Sequence Progress Tracker (when running) */}
      {(simStep > 0 || isPlayingSequence) && (
        <Card className={`animate-in slide-in-from-top duration-300 ${
          isDark 
            ? 'border-cyan-500/40 shadow-cyan-glow bg-graphite-900/95' 
            : 'border-cyan-400 shadow-sm bg-white'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-graphite-800' : 'border-slate-200'
          }`}>
            <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${
              isDark ? 'text-cyan-electric' : 'text-cyan-700'
            }`}>
              VIRTUAL COMMISSIONING SEQUENCE IN PROGRESS
            </span>
            <span className="text-xs font-mono text-emerald-500 font-bold">
              Step {simStep} of 5 Completed
            </span>
          </div>

          <div className="pt-4 grid grid-cols-5 gap-2 text-center text-xs font-mono">
            {[
              '1. Electrical LOTO',
              '2. End-Shield Disassembly',
              '3. Bearing Extraction',
              '4. Induction Mounting',
              '5. Precision Alignment'
            ].map((stepName, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border transition-all font-semibold ${
                  simStep > idx
                    ? isDark
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                    : simStep === idx + 1
                    ? isDark
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-electric animate-pulse'
                      : 'bg-cyan-100 border-cyan-400 text-cyan-800 animate-pulse font-bold'
                    : isDark
                      ? 'bg-graphite-950/40 border-graphite-800 text-graphite-500'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                {stepName}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Two Column Layout: Parameter Sliders vs Twin Preview & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Parameter Controls */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-graphite-800' : 'border-slate-200'
            }`}>
              <h3 className={`text-sm font-semibold uppercase font-mono tracking-wider flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
                Virtual Scenario Controls
              </h3>
              <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Real-Time Solver</span>
            </div>

            {/* Strategy Select Dropdown */}
            <div className="pt-4 space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-2 font-semibold ${
                  isDark ? 'text-graphite-300' : 'text-slate-700'
                }`}>
                  Applied Repair Strategy
                </label>
                <select
                  value={appliedStrategyId}
                  onChange={(e) => handleSelectStrategy(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600 font-medium'
                  }`}
                >
                  <option value="">No Action (Maintain Current Degraded State)</option>
                  {repairStrategies.map((strat) => (
                    <option key={strat.id} value={strat.id}>
                      {strat.title} ({strat.tier.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Slider 1: Target RPM */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Target Shaft Speed:</span>
                  <span className={`font-bold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>{targetRpm} RPM</span>
                </div>
                <input
                  type="range"
                  min="2400"
                  max="3600"
                  step="25"
                  value={targetRpm}
                  onChange={(e) => setTargetRpm(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Slider 2: Motor Load % */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Operating Load Factor:</span>
                  <span className={`font-bold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>{loadPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="125"
                  step="5"
                  value={loadPercentage}
                  onChange={(e) => setLoadPercentage(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Slider 3: Ambient Room Temp */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Ambient Facility Temp:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ambientTempC} °C</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="1"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Slider 4: Lubricant Quality */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Lubrication Viscosity Film:</span>
                  <span className="text-emerald-500 font-bold">{lubeQuality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={lubeQuality}
                  onChange={(e) => setLubeQuality(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Slider 5: Cooling Airflow */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Cooling Airflow Volume:</span>
                  <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>{coolingAirflow}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="130"
                  step="5"
                  value={coolingAirflow}
                  onChange={(e) => setCoolingAirflow(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Von Mises Stress Distribution */}
          <Card>
            <h4 className={`text-xs font-mono uppercase tracking-wider mb-3 font-semibold ${
              isDark ? 'text-graphite-400' : 'text-slate-600'
            }`}>
              Finite Element Stress Margins (FEA)
            </h4>

            <div className="space-y-3 font-mono text-xs">
              {simulation.stressDistribution.map((stress, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-graphite-200' : 'text-slate-800'}>{stress.component}</span>
                    <span className={`font-bold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>
                      {stress.stressMpa} MPa <span className={`text-[10px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>(Yield: {stress.yieldLimitMpa})</span>
                    </span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${
                    isDark ? 'bg-graphite-950' : 'bg-slate-200'
                  }`}>
                    <div
                      className={`h-full ${
                        stress.stressMpa > stress.yieldLimitMpa * 0.8
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(stress.stressMpa / stress.yieldLimitMpa) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Simulation Outcome Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Before vs After Telemetry Comparison Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <Card className="text-center p-3">
              <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Simulated Health</span>
              <div className={`text-2xl font-bold mt-1 ${
                simulation.simulatedHealth < 70 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {simulation.simulatedHealth}%
              </div>
              <span className={`text-[10px] ${isDark ? 'text-graphite-500' : 'text-slate-400'}`}>Base: {selectedMachine.healthScore}%</span>
            </Card>

            <Card className="text-center p-3">
              <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Projected Temp</span>
              <div className={`text-2xl font-bold mt-1 ${
                simulation.projectedTemp > 85 ? 'text-rose-500' : (isDark ? 'text-cyan-electric' : 'text-cyan-700')
              }`}>
                {simulation.projectedTemp}°C
              </div>
              <span className={`text-[10px] ${isDark ? 'text-graphite-500' : 'text-slate-400'}`}>Base: {selectedMachine.temperature}°C</span>
            </Card>

            <Card className="text-center p-3">
              <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Vibration RMS</span>
              <div className={`text-2xl font-bold mt-1 ${
                simulation.projectedVibration > 4.5 ? 'text-rose-500' : 'text-emerald-500'
              }`}>
                {simulation.projectedVibration} <span className="text-xs">mm/s</span>
              </div>
              <span className={`text-[10px] ${isDark ? 'text-graphite-500' : 'text-slate-400'}`}>Base: {selectedMachine.vibration}</span>
            </Card>

            <Card className="text-center p-3">
              <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Post-Fix RUL</span>
              <div className="text-2xl font-bold text-emerald-500 mt-1">
                {simulation.rulDaysPostFix} <span className="text-xs">Days</span>
              </div>
              <span className={`text-[10px] ${isDark ? 'text-graphite-500' : 'text-slate-400'}`}>Risk: {simulation.failureRiskPercent}%</span>
            </Card>
          </div>

          {/* Simulated Telemetry Progression Chart */}
          <Card>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-graphite-800' : 'border-slate-200'
            }`}>
              <div>
                <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Projected 2-Hour Telemetry Stabilization
                </h3>
                <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                  Virtual transient convergence curve post-procedure
                </p>
              </div>
              <Badge variant="emerald" size="sm">STABILIZED</Badge>
            </div>

            <div className="pt-4">
              <TelemetryLineChart data={simulation.telemetryStream} metric="temperature" height={220} />
            </div>
          </Card>

          {/* 3D Model Mini View with Dynamic Changes */}
          <div>
            <IndustrialMotor3D compact hideInspectorOverlay />
          </div>

          {/* Solution Recommendation Forward Banner */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDark 
              ? 'bg-graphite-900 border-cyan-500/30 shadow-cyan-glow' 
              : 'bg-white border-cyan-300 shadow-sm text-slate-900'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className={`text-xs font-mono font-bold uppercase ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Safety Gate: Passed API 670 Trip Limits
                </span>
                <Badge variant="emerald" size="sm">0 TRIPS</Badge>
              </div>
              <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                Thermal & vibration convergence verified. Projected post-fix RUL: {simulation.rulDaysPostFix} days.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('recommendations')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Compare Solutions in Decision Matrix
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
