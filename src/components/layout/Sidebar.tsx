import React from 'react';
import { useNavigation, AppView } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Activity, 
  Cpu, 
  AlertTriangle, 
  Crosshair, 
  Wrench, 
  Layers, 
  Sliders, 
  TrendingUp, 
  History, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Power,
  Compass,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, navigate, sidebarCollapsed, setSidebarCollapsed } = useNavigation();
  const { logout, user } = useAuth();
  const { isDark } = useTheme();

  const navSections: {
    category: string;
    items: {
      id: AppView;
      label: string;
      icon: any;
      badge?: string | number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      category: 'MONITORING & CONTROL',
      items: [
        { id: 'overview', label: 'Overview Dashboard', icon: Activity },
        { id: 'monitoring', label: 'Live Telemetry', icon: Radio, badge: 'LIVE', badgeColor: isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800 border border-emerald-300' },
        { id: '3d-model', label: '3D Digital Twin Model', icon: Cpu },
      ]
    },
    {
      category: 'INTELLIGENCE & DIAGNOSTICS',
      items: [
        { id: 'faults', label: 'Fault Detection', icon: AlertTriangle, badge: 3, badgeColor: isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-800 border border-rose-300' },
        { id: 'root-cause', label: 'Root Cause Analysis', icon: Crosshair },
        { id: 'repair-strategies', label: 'AI Repair Strategies', icon: Wrench, badge: '3 Available', badgeColor: isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-800 border border-cyan-300' },
        { id: 'digital-twin', label: 'Digital Twin Simulator', icon: Layers },
        { id: 'recommendations', label: 'Strategy Recommendations', icon: Sliders },
      ]
    },
    {
      category: 'ANALYTICS & RELIABILITY',
      items: [
        { id: 'predictive', label: 'Predictive Health & RUL', icon: TrendingUp },
        { id: 'history', label: 'Machine History & Log', icon: History },
        { id: 'analytics', label: 'Fleet Analytics & Reports', icon: BarChart3 },
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings & Security', icon: Settings },
        { id: 'admin', label: 'Admin Console & RBAC', icon: ShieldCheck, badge: 'ADMIN' },
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r flex flex-col ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } ${
        isDark 
          ? 'border-graphite-800 bg-graphite-900/95 backdrop-blur-xl text-white' 
          : 'border-slate-200 bg-white/95 backdrop-blur-xl text-slate-800 shadow-sm'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center justify-between px-4 border-b ${
        isDark ? 'border-graphite-800' : 'border-slate-200'
      }`}>
        {!sidebarCollapsed ? (
          <div 
            onClick={() => navigate('overview')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-electric to-electric-blue flex items-center justify-center shadow-cyan-glow">
              <Cpu className="w-5 h-5 text-graphite-950 font-bold" />
            </div>
            <div>
              <span className={`font-bold text-base tracking-tight flex items-center gap-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                MachineMind <span className="text-cyan-electric text-xs font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">AI</span>
              </span>
              <span className={`block text-[10px] font-mono tracking-wider ${
                isDark ? 'text-graphite-400' : 'text-slate-500'
              }`}>
                INDUSTRIAL INTELLIGENCE
              </span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => navigate('overview')} 
            className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-cyan-electric to-electric-blue flex items-center justify-center shadow-cyan-glow cursor-pointer"
          >
            <Cpu className="w-5 h-5 text-graphite-950" />
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`p-1.5 rounded-lg transition-colors ${
            isDark 
              ? 'text-graphite-400 hover:text-white hover:bg-graphite-800' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.category} className="space-y-1">
            {!sidebarCollapsed && (
              <div className={`px-3 pb-1 text-[10px] font-mono tracking-wider uppercase font-semibold ${
                isDark ? 'text-graphite-500' : 'text-slate-400'
              }`}>
                {section.category}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-cyan-500/15 to-transparent text-cyan-electric border-l-2 border-cyan-electric font-semibold'
                        : 'bg-gradient-to-r from-cyan-50 to-transparent text-cyan-800 border-l-2 border-cyan-600 font-semibold'
                      : isDark
                        ? 'text-graphite-400 hover:text-graphite-100 hover:bg-graphite-800/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive 
                        ? (isDark ? 'text-cyan-electric' : 'text-cyan-600') 
                        : (isDark ? 'text-graphite-400 group-hover:text-graphite-200' : 'text-slate-400 group-hover:text-slate-700')
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${item.badgeColor || (isDark ? 'bg-graphite-800 text-graphite-300' : 'bg-slate-200 text-slate-800')}`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {sidebarCollapsed && (
                    <div className={`absolute left-full ml-3 px-3 py-1.5 text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 ${
                      isDark 
                        ? 'bg-graphite-800 text-graphite-100 border border-graphite-700' 
                        : 'bg-white text-slate-900 border border-slate-200'
                    }`}>
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Landing page link & System Status */}
      <div className={`p-3 border-t space-y-2 ${
        isDark ? 'border-graphite-800 bg-graphite-950/40' : 'border-slate-200 bg-slate-50/70'
      }`}>
        <button
          onClick={() => navigate('landing')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
            isDark 
              ? 'text-graphite-400 hover:text-cyan-electric hover:bg-graphite-800/80' 
              : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
          }`}
          title="Visit Public Landing Page"
        >
          <Compass className="w-4 h-4 shrink-0 text-cyan-500" />
          {!sidebarCollapsed && <span>Public Landing Page</span>}
        </button>

        {!sidebarCollapsed && (
          <div className={`p-2.5 rounded-xl border text-xs ${
            isDark ? 'bg-graphite-850 border-graphite-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between ${
              isDark ? 'text-graphite-300' : 'text-slate-700'
            }`}>
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Agent Active
              </span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 text-[10px] font-semibold">99.98% SLA</span>
            </div>
            <div className={`mt-1 text-[11px] font-mono ${
              isDark ? 'text-graphite-500' : 'text-slate-500'
            }`}>
              Delta-4 Fleet Gateway: Connected
            </div>
          </div>
        )}

        {/* User Mini Bar */}
        {user && (
          <div className="flex items-center justify-between pt-1">
            <div 
              onClick={() => navigate('settings')}
              className={`flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity ${sidebarCollapsed ? 'mx-auto' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-600 dark:text-cyan-electric text-xs">
                {user.name.charAt(0)}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <div className={`text-xs font-semibold truncate ${
                    isDark ? 'text-graphite-200' : 'text-slate-800'
                  }`}>{user.name}</div>
                  <div className={`text-[10px] truncate ${
                    isDark ? 'text-graphite-500' : 'text-slate-500'
                  }`}>{user.role}</div>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={() => {
                  logout();
                  navigate('login');
                }}
                title="Log out"
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-graphite-500 hover:text-rose-400 hover:bg-graphite-800' 
                    : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                }`}
              >
                <Power className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
