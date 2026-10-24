import React from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Activity, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Flame, 
  Clock, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  Sliders, 
  Radio, 
  BarChart2,
  ExternalLink,
  Search,
  ArrowUpDown,
  X
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { IndustrialMotor3D } from '../components/three/IndustrialMotor3D';
import { getStatusColor, formatRPM } from '../utils/formatters';

export const OverviewDashboard: React.FC = () => {
  const { machines, selectedMachine, selectMachine, activeFault, liveTelemetry } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();
  const [fleetFilter, setFleetFilter] = React.useState<'all' | 'critical' | 'warning' | 'optimal'>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [sortBy, setSortBy] = React.useState<'health_asc' | 'health_desc' | 'name_asc' | 'temp_desc' | 'vib_desc'>('health_asc');

  // Fleet aggregations
  const totalAssets = machines.length;
  const criticalCount = machines.filter(m => m.status === 'critical').length;
  const warningCount = machines.filter(m => m.status === 'warning').length;
  const optimalCount = machines.filter(m => m.status === 'optimal' || m.status === 'nominal').length;
  const avgHealth = Math.round(machines.reduce((acc, m) => acc + m.healthScore, 0) / (totalAssets || 1));

  const filteredMachines = machines
    .filter(m => {
      if (fleetFilter === 'critical') return m.status === 'critical';
      if (fleetFilter === 'warning') return m.status === 'warning';
      if (fleetFilter === 'optimal') return m.status === 'optimal' || m.status === 'nominal';
      return true;
    })
    .filter(m => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'health_asc') return a.healthScore - b.healthScore;
      if (sortBy === 'health_desc') return b.healthScore - a.healthScore;
      if (sortBy === 'temp_desc') return b.temperature - a.temperature;
      if (sortBy === 'vib_desc') return b.vibration - a.vibration;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Critical Attention Required */}
      {activeFault && (
        <div className={`relative overflow-hidden p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isDark 
            ? 'bg-gradient-to-r from-rose-950/60 via-graphite-900 to-graphite-900 border-rose-500/40 shadow-crimson-glow text-white' 
            : 'bg-gradient-to-r from-rose-50 via-white to-white border-rose-300 shadow-sm text-slate-900'
        }`}>
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl border animate-pulse mt-0.5 ${
              isDark ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-rose-100 text-rose-700 border-rose-300'
            }`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="rose" size="sm" pulse>CRITICAL FAULT DETECTED</Badge>
                <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{activeFault.machineCode}</span>
                <span className="text-xs font-mono text-rose-500 font-semibold">{activeFault.detectedAt}</span>
              </div>
              <h3 className={`text-base font-semibold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeFault.title}
              </h3>
              <p className={`text-xs mt-0.5 line-clamp-1 max-w-2xl ${isDark ? 'text-graphite-300' : 'text-slate-600'}`}>
                {activeFault.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectMachine(activeFault.machineId);
                navigate('root-cause');
              }}
            >
              Root Cause
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                selectMachine(activeFault.machineId);
                navigate('repair-strategies');
              }}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Synthesize Fix
            </Button>
          </div>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fleet Health Score"
          value={avgHealth}
          unit="/100"
          status={avgHealth > 85 ? 'optimal' : avgHealth > 70 ? 'warning' : 'critical'}
          trend="down"
          change="-2.4% vs last week"
          icon={<Activity className="w-4 h-4" />}
          subtitle="6 Assets Connected"
        />
        <StatCard
          title="Active Telemetry Faults"
          value={warningCount + criticalCount}
          unit="Active"
          status={criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'optimal'}
          icon={<AlertTriangle className="w-4 h-4" />}
          subtitle="1 Critical · 1 High Alert"
        />
        <StatCard
          title="Mean Time Between Failures"
          value="4,850"
          unit="Hours"
          status="optimal"
          trend="down"
          change="+18% vs industry baseline"
          icon={<Clock className="w-4 h-4" />}
          subtitle="ISO 14224 Standard"
        />
        <StatCard
          title="Avoided Downtime Savings"
          value="$142,000"
          unit="USD"
          status="optimal"
          icon={<Zap className="w-4 h-4" />}
          subtitle="Q4 Projected Savings"
        />
      </div>

      {/* Centerpiece: Active Selected Machine 3D Digital Twin + Live Sensor Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 3D Digital Twin View */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center justify-between mb-2 h-6">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${
                isDark ? 'text-cyan-electric' : 'text-cyan-700'
              }`}>
                Digital Twin Physical Representation
              </span>
              <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                ({selectedMachine.name})
              </span>
            </div>
            <button
              onClick={() => navigate('3d-model')}
              className={`text-xs font-mono flex items-center gap-1 transition-colors font-semibold ${
                isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-700 hover:text-cyan-800'
              }`}
            >
              <span>Dedicated 3D Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <IndustrialMotor3D compact />
        </div>

        {/* Selected Machine Telemetry Summary */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-2 h-6">
            <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${
              isDark ? 'text-graphite-400' : 'text-slate-600'
            }`}>
              Telemetry Snapshot
            </span>
            <span className={`text-xs font-mono font-semibold ${
              isDark ? 'text-cyan-400' : 'text-cyan-700'
            }`}>
              Live Stream
            </span>
          </div>
          <Card className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedMachine.name}
                  </h3>
                  <div className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                    {selectedMachine.code} · {selectedMachine.location}
                  </div>
                </div>
                <Badge
                  variant={
                    selectedMachine.status === 'optimal'
                      ? 'emerald'
                      : selectedMachine.status === 'warning'
                      ? 'amber'
                      : 'rose'
                  }
                  size="sm"
                  pulse={selectedMachine.status === 'critical'}
                >
                  {selectedMachine.status.toUpperCase()}
                </Badge>
              </div>

              {/* Health Bar */}
              <div className={`mt-4 p-3 rounded-xl border ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Asset Health Rating</span>
                  <span className={`font-bold ${
                    selectedMachine.healthScore < 70 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {selectedMachine.healthScore}%
                  </span>
                </div>
                <div className={`h-2 w-full rounded-full overflow-hidden ${
                  isDark ? 'bg-graphite-800' : 'bg-slate-200'
                }`}>
                  <div
                    className={`h-full transition-all duration-500 ${
                      selectedMachine.healthScore < 50
                        ? 'bg-rose-500'
                        : selectedMachine.healthScore < 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedMachine.healthScore}%` }}
                  />
                </div>
              </div>

              {/* Real-Time Sensor Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-3 font-mono">
                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-graphite-800/60 border-graphite-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>DE Bearing Temp</div>
                  <div className="text-xl font-bold text-rose-500 mt-1">
                    {liveTelemetry.temperature} <span className={`text-xs ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>°C</span>
                  </div>
                  <div className="text-[10px] text-rose-500 mt-0.5 font-sans font-semibold">+28°C vs nominal</div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-graphite-800/60 border-graphite-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Vibration RMS</div>
                  <div className={`text-xl font-bold mt-1 ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>
                    {liveTelemetry.vibration} <span className={`text-xs ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>mm/s</span>
                  </div>
                  <div className="text-[10px] text-amber-500 mt-0.5 font-sans font-semibold">Zone C (Alert)</div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-graphite-800/60 border-graphite-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Shaft Speed</div>
                  <div className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {liveTelemetry.rpm} <span className={`text-xs ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>RPM</span>
                  </div>
                  <div className="text-[10px] text-emerald-500 mt-0.5 font-sans font-semibold">Sync Locked</div>
                </div>

                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-graphite-800/60 border-graphite-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Active Power</div>
                  <div className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {liveTelemetry.powerKw} <span className={`text-xs ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>kW</span>
                  </div>
                  <div className={`text-[10px] mt-0.5 font-sans ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>93.8% Load</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`mt-5 pt-4 border-t flex items-center gap-2 ${
              isDark ? 'border-graphite-800' : 'border-slate-200'
            }`}>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => navigate('digital-twin')}
                icon={<Layers className="w-4 h-4" />}
              >
                Run Simulator
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => navigate('monitoring')}
                icon={<Radio className="w-4 h-4" />}
              >
                Full Telemetry
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Fleet Asset Status Grid */}
      <div className="space-y-4">
        <div className={`p-4 rounded-2xl border flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 ${
          isDark ? 'bg-graphite-900 border-graphite-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <h3 className={`text-base font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Monitored Industrial Fleet ({machines.length} Assets)
            </h3>
            <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Select an asset to focus 3D digital twin and high-frequency telemetry feeds
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-graphite-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machine, bay, tag..."
                className={`w-full pl-8 pr-7 py-1.5 rounded-xl text-xs font-mono border focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-graphite-950 border-graphite-700 text-white placeholder-graphite-500 focus:border-cyan-electric' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded ${
                    isDark ? 'text-graphite-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className={`w-3.5 h-3.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort monitored machines"
                className={`py-1.5 px-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-colors font-semibold ${
                  isDark 
                    ? 'bg-graphite-950 border-graphite-700 text-graphite-200 focus:border-cyan-electric' 
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-600'
                }`}
              >
                <option value="health_asc">Health (Lowest First)</option>
                <option value="health_desc">Health (Highest First)</option>
                <option value="temp_desc">Temperature (Highest First)</option>
                <option value="vib_desc">Vibration (Highest First)</option>
                <option value="name_asc">Asset Name (A-Z)</option>
              </select>
            </div>

            {/* Filter Pills */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${
              isDark ? 'bg-graphite-950 border-graphite-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setFleetFilter('all')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all font-semibold ${
                  fleetFilter === 'all'
                    ? isDark 
                      ? 'bg-cyan-500/20 text-cyan-electric border border-cyan-500/40 shadow-sm'
                      : 'bg-white text-cyan-800 border border-cyan-300 shadow-xs'
                    : isDark
                      ? 'text-graphite-400 hover:text-white'
                      : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                All ({totalAssets})
              </button>
              <button
                onClick={() => setFleetFilter('critical')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all font-semibold ${
                  fleetFilter === 'critical'
                    ? isDark
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                      : 'bg-rose-100 text-rose-800 border border-rose-300 shadow-xs'
                    : isDark
                      ? 'text-graphite-400 hover:text-rose-400'
                      : 'text-slate-700 hover:text-rose-700'
                }`}
              >
                Critical ({criticalCount})
              </button>
              <button
                onClick={() => setFleetFilter('warning')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all font-semibold ${
                  fleetFilter === 'warning'
                    ? isDark
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                      : 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs'
                    : isDark
                      ? 'text-graphite-400 hover:text-amber-400'
                      : 'text-slate-700 hover:text-amber-700'
                }`}
              >
                Warning ({warningCount})
              </button>
              <button
                onClick={() => setFleetFilter('optimal')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all font-semibold ${
                  fleetFilter === 'optimal'
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs'
                    : isDark
                      ? 'text-graphite-400 hover:text-emerald-400'
                      : 'text-slate-700 hover:text-emerald-700'
                }`}
              >
                Optimal ({optimalCount})
              </button>
            </div>
          </div>
        </div>

        {filteredMachines.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border text-xs font-mono ${
            isDark ? 'bg-graphite-900/60 border-graphite-800 text-graphite-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            No assets match the selected filter ({fleetFilter.toUpperCase()}).
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMachines.map((machine) => {
              const isSelected = machine.id === selectedMachine.id;
              const statusConfig = getStatusColor(machine.status);

              return (
                <Card
                  key={machine.id}
                  onClick={() => selectMachine(machine.id)}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? isDark
                        ? 'border-cyan-electric/80 shadow-cyan-glow bg-graphite-850'
                        : 'border-cyan-500 shadow-md bg-cyan-50/30'
                      : isDark
                        ? 'hover:border-graphite-600'
                        : 'hover:border-slate-300'
                  }`}
                >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot} ${machine.status === 'critical' ? 'animate-ping' : ''}`} />
                    <div>
                      <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {machine.name}
                      </h4>
                      <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                        {machine.code} · {machine.type}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      machine.status === 'optimal'
                        ? 'emerald'
                        : machine.status === 'warning'
                        ? 'amber'
                        : 'rose'
                    }
                    size="sm"
                  >
                    {machine.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-center text-xs">
                  <div className={`p-2 rounded border ${
                    isDark ? 'bg-graphite-950/50 border-graphite-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className={`text-[10px] font-semibold ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>HEALTH</div>
                    <div className={`font-bold mt-0.5 ${
                      machine.healthScore < 70 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {machine.healthScore}%
                    </div>
                  </div>
                  <div className={`p-2 rounded border ${
                    isDark ? 'bg-graphite-950/50 border-graphite-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className={`text-[10px] font-semibold ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>TEMP</div>
                    <div className={`font-bold mt-0.5 ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>
                      {machine.temperature}°C
                    </div>
                  </div>
                  <div className={`p-2 rounded border ${
                    isDark ? 'bg-graphite-950/50 border-graphite-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className={`text-[10px] font-semibold ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>VIBRATION</div>
                    <div className={`font-bold mt-0.5 ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>
                      {machine.vibration} <span className="text-[9px]">mm/s</span>
                    </div>
                  </div>
                </div>

                <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isDark ? 'border-graphite-800/80 text-graphite-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <span>{machine.location}</span>
                  <span className={`hover:underline flex items-center gap-1 font-semibold ${
                    isDark ? 'text-cyan-400' : 'text-cyan-700'
                  }`}>
                    Select <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
};
