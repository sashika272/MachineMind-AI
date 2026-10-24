import React, { useState, useEffect } from 'react';
import { useNavigation, AppView } from '../../context/NavigationContext';
import { useMachine } from '../../context/MachineContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Search, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  Crosshair, 
  Wrench, 
  Layers, 
  Sliders, 
  TrendingUp, 
  History, 
  BarChart3, 
  Settings, 
  X, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, navigate } = useNavigation();
  const { machines, selectMachine } = useMachine();
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const quickNavItems: { label: string; view: AppView; icon: any; category: string }[] = [
    { label: 'Overview Dashboard', view: 'overview', icon: Activity, category: 'Navigation' },
    { label: 'Live Machine Monitoring', view: 'monitoring', icon: Activity, category: 'Navigation' },
    { label: '3D Interactive Motor Model', view: '3d-model', icon: Cpu, category: 'Navigation' },
    { label: 'Fault Detection & Anomalies', view: 'faults', icon: AlertTriangle, category: 'Navigation' },
    { label: 'Root Cause Bayesian Analysis', view: 'root-cause', icon: Crosshair, category: 'Navigation' },
    { label: 'AI Repair Strategies', view: 'repair-strategies', icon: Wrench, category: 'Navigation' },
    { label: 'Digital Twin Simulator', view: 'digital-twin', icon: Layers, category: 'Navigation' },
    { label: 'Solution Recommendations', view: 'recommendations', icon: Sliders, category: 'Navigation' },
    { label: 'Predictive Maintenance & RUL', view: 'predictive', icon: TrendingUp, category: 'Navigation' },
    { label: 'Machine History & Audits', view: 'history', icon: History, category: 'Navigation' },
    { label: 'Fleet Analytics & Reports', view: 'analytics', icon: BarChart3, category: 'Navigation' },
    { label: 'Settings & Configurations', view: 'settings', icon: Settings, category: 'Navigation' },
    { label: 'Enterprise Admin Console & RBAC', view: 'admin', icon: ShieldCheck, category: 'Navigation' },
  ];

  const filteredNav = quickNavItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMachines = machines.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.code.toLowerCase().includes(query.toLowerCase()) ||
    m.type.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectNav = (view: AppView) => {
    navigate(view);
    setCommandPaletteOpen(false);
  };

  const handleSelectMachine = (id: string) => {
    selectMachine(id);
    navigate('monitoring');
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border ${
          isDark
            ? 'bg-graphite-900 border-graphite-700/80 text-white'
            : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className={`flex items-center px-4 py-3.5 border-b gap-3 ${
          isDark ? 'border-graphite-800' : 'border-slate-200 bg-slate-50'
        }`}>
          <Search className={`w-5 h-5 shrink-0 ${isDark ? 'text-cyan-electric' : 'text-cyan-600'}`} />
          <input
            autoFocus
            type="text"
            placeholder="Search commands, screens, or telemetry assets... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full bg-transparent text-sm focus:outline-none ${
              isDark ? 'text-graphite-100 placeholder-graphite-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className={`p-1 rounded-md transition-colors ${
              isDark ? 'text-graphite-400 hover:text-white hover:bg-graphite-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Machines Group */}
          {filteredMachines.length > 0 && (
            <div>
              <div className={`px-3 py-1 text-xs font-mono uppercase tracking-wider font-semibold ${
                isDark ? 'text-graphite-400' : 'text-slate-500'
              }`}>
                Industrial Assets ({filteredMachines.length})
              </div>
              <div className="mt-1 space-y-1">
                {filteredMachines.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMachine(m.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm transition-colors group ${
                      isDark ? 'hover:bg-graphite-800/80' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded transition-colors ${
                        isDark 
                          ? 'bg-graphite-800 text-cyan-400 group-hover:bg-cyan-500/10' 
                          : 'bg-slate-100 text-cyan-700 group-hover:bg-cyan-50'
                      }`}>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-medium transition-colors ${
                          isDark 
                            ? 'text-graphite-200 group-hover:text-cyan-electric' 
                            : 'text-slate-800 group-hover:text-cyan-700'
                        }`}>
                          {m.name}
                        </div>
                        <div className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                          {m.code} · {m.type} · {m.location}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-mono flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDark ? 'text-cyan-400' : 'text-cyan-700 font-semibold'
                    }`}>
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Group */}
          <div>
            <div className={`px-3 py-1 text-xs font-mono uppercase tracking-wider font-semibold ${
              isDark ? 'text-graphite-400' : 'text-slate-500'
            }`}>
              Platform Views & Capabilities
            </div>
            <div className="mt-1 space-y-1">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleSelectNav(item.view)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm transition-colors group ${
                      isDark ? 'hover:bg-graphite-800/80' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded transition-colors ${
                        isDark 
                          ? 'bg-graphite-800 text-graphite-300 group-hover:text-cyan-electric group-hover:bg-cyan-500/10' 
                          : 'bg-slate-100 text-slate-600 group-hover:text-cyan-700 group-hover:bg-cyan-50'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`font-medium transition-colors ${
                        isDark ? 'text-graphite-200 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950 font-semibold'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    <span className={`text-xs font-mono ${isDark ? 'text-graphite-500' : 'text-slate-400'}`}>
                      Jump to view
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className={`px-4 py-2.5 border-t flex items-center justify-between text-xs font-mono ${
          isDark ? 'bg-graphite-950/60 border-graphite-800 text-graphite-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div className="flex items-center gap-3">
            <span><kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-graphite-800 text-graphite-300' : 'bg-slate-200 text-slate-700'}`}>↑↓</kbd> navigate</span>
            <span><kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-graphite-800 text-graphite-300' : 'bg-slate-200 text-slate-700'}`}>↵</kbd> select</span>
          </div>
          <span>MachineMind Intelligent Telemetry Router</span>
        </div>
      </div>
    </div>
  );
};
