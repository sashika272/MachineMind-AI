import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useMachine } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Search, 
  Bell, 
  Play, 
  Pause, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles,
  Command,
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { getStatusColor } from '../../utils/formatters';

export const TopHeader: React.FC = () => {
  const { currentView, navigate, setCommandPaletteOpen, notificationsOpen, setNotificationsOpen, unreadCount, sidebarCollapsed } = useNavigation();
  const { machines, selectedMachine, selectMachine, isStreaming, toggleStreaming, injectFault, resolveActiveFault } = useMachine();
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const viewTitles: Record<string, string> = {
    overview: 'Fleet Overview & Machine Intelligence',
    monitoring: 'Live Real-Time Telemetry Stream',
    '3d-model': 'Interactive 3D Digital Twin Model',
    faults: 'Fault Detection & Anomaly Signatures',
    'root-cause': 'Root Cause Diagnostic Fault Tree',
    'repair-strategies': 'AI-Synthesized Repair Procedures',
    'digital-twin': 'Multi-Scenario Digital Twin Simulator',
    recommendations: 'Multi-Criteria Strategy Comparison',
    predictive: 'Predictive Health & Remaining Useful Life (RUL)',
    history: 'Incident Log & Maintenance Audit Trail',
    analytics: 'Fleet Reliability Metrics & Financial Impact',
    settings: 'Organization Parameters & Alert Rules',
    landing: 'MachineMind AI Platform',
    login: 'Authentication Gateway',
    register: 'Create Enterprise Account',
    'forgot-password': 'Password Recovery'
  };

  const statusStyle = getStatusColor(selectedMachine.status);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 border-b backdrop-blur-xl transition-all duration-300 flex items-center justify-between px-6 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      } ${
        isDark 
          ? 'border-graphite-800 bg-graphite-900/90 text-white' 
          : 'border-slate-200 bg-white/95 text-slate-900 shadow-sm'
      }`}
    >
      {/* Left Title & Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0 flex-1 mr-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className={isDark ? 'text-graphite-400' : 'text-slate-500'}>MachineMind OS</span>
            <span className={isDark ? 'text-graphite-600' : 'text-slate-400'}>/</span>
            <span className={`capitalize truncate font-semibold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>
              {currentView.replace('-', ' ')}
            </span>
          </div>
          <h1 className={`text-base font-semibold tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {viewTitles[currentView] || 'MachineMind AI'}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Machine Quick Switcher */}
        <div className="relative group shrink-0">
          <select
            value={selectedMachine.id}
            onChange={(e) => selectMachine(e.target.value)}
            className={`appearance-none text-xs font-mono py-2 pl-3 pr-8 rounded-lg border transition-colors cursor-pointer max-w-[150px] sm:max-w-[210px] md:max-w-[260px] truncate ${
              isDark
                ? 'bg-graphite-800/80 hover:bg-graphite-750 text-graphite-200 border-graphite-700/80 hover:border-cyan-500/40 focus:ring-cyan-500'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 hover:border-cyan-600/50 focus:ring-cyan-600 font-semibold'
            }`}
          >
            {machines.map((m) => (
              <option key={m.id} value={m.id} className={isDark ? "bg-graphite-900 text-graphite-200 py-1" : "bg-white text-slate-900 py-1"}>
                {m.code} — {m.name} ({m.healthScore}%)
              </option>
            ))}
          </select>
          <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
            isDark ? 'text-graphite-400' : 'text-slate-500'
          }`} />
        </div>

        {/* Live Stream Ticker Toggle */}
        <button
          onClick={toggleStreaming}
          title={isStreaming ? "Pause real-time stream" : "Resume real-time stream"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            isStreaming
              ? isDark 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold'
              : isDark
                ? 'bg-graphite-800 border-graphite-700 text-graphite-400 hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-200 font-medium'
          }`}
        >
          {isStreaming ? (
            <>
              <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
              <span className="hidden sm:inline">STREAMING</span>
              <Pause className="w-3 h-3 ml-0.5" />
            </>
          ) : (
            <>
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-graphite-500' : 'bg-slate-400'}`} />
              <span className="hidden sm:inline">PAUSED</span>
              <Play className="w-3 h-3 ml-0.5" />
            </>
          )}
        </button>

        {/* Fault Injection / Self-Healing Demo Actions */}
        {selectedMachine.status === 'critical' ? (
          <button
            onClick={resolveActiveFault}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
              isDark
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 shadow-emerald-glow'
                : 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200 font-semibold'
            }`}
            title="Simulate successful technician repair"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Apply Verified Fix</span>
          </button>
        ) : (
          <button
            onClick={injectFault}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
              isDark
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100 font-semibold'
            }`}
            title="Inject simulated bearing degradation fault"
          >
            <Flame className={`w-3.5 h-3.5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
            <span>Inject Fault Test</span>
          </button>
        )}

        {/* Quick Search Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
            isDark
              ? 'bg-graphite-800/80 hover:bg-graphite-750 text-graphite-400 hover:text-graphite-200 border-graphite-700/60'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300 font-medium'
          }`}
        >
          <Search className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-electric' : 'text-cyan-600'}`} />
          <span className="hidden md:inline">Quick Search...</span>
          <kbd className={`hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] rounded border ${
            isDark ? 'bg-graphite-900 border-graphite-700 text-graphite-400' : 'bg-white border-slate-300 text-slate-600'
          }`}>
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`relative p-2 rounded-lg border transition-colors flex items-center justify-center group ${
            isDark
              ? 'bg-graphite-800/80 hover:bg-graphite-750 text-graphite-300 hover:text-white border-graphite-700/60'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-slate-300'
          }`}
          title={isDark ? "Switch to Clean Industrial Light Mode" : "Switch to Dark Graphite Mode"}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-deep group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className={`relative p-2 rounded-lg border transition-colors ${
            isDark
              ? 'bg-graphite-800/80 hover:bg-graphite-750 text-graphite-300 hover:text-white border-graphite-700/60'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-slate-300'
          }`}
          title="Telemetry alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white font-mono">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        {user && (
          <button
            onClick={() => navigate('settings')}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs transition-colors ${
              isDark
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-electric hover:border-cyan-400'
                : 'bg-cyan-100 border-cyan-300 text-cyan-800 hover:border-cyan-500'
            }`}
            title={`${user.name} (${user.role})`}
          >
            {user.name.charAt(0)}
          </button>
        )}
      </div>
    </header>
  );
};
