import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import { X, CheckCheck, AlertTriangle, Info, AlertCircle, ArrowUpRight } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { 
    notificationsOpen, 
    setNotificationsOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    navigate 
  } = useNavigation();
  const { isDark } = useTheme();

  if (!notificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md border-l shadow-2xl flex flex-col ${
          isDark
            ? 'bg-graphite-900 border-graphite-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {/* Header */}
          <div className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'border-graphite-800' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isDark ? 'text-graphite-100' : 'text-slate-900'}`}>
                Telemetry Notifications
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${
                isDark 
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                  : 'bg-cyan-50 text-cyan-800 border-cyan-200 font-semibold'
              }`}>
                {notifications.filter(n => !n.read).length} Unread
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-mono transition-colors ${
                  isDark
                    ? 'text-graphite-400 hover:text-cyan-electric hover:bg-graphite-800'
                    : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-200'
                }`}
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
              <button
                onClick={() => setNotificationsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? 'text-graphite-400 hover:text-white hover:bg-graphite-800'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className={`text-center py-12 text-sm ${isDark ? 'text-graphite-500' : 'text-slate-400'}`}>
                No active notifications
              </div>
            ) : (
              notifications.map((notif) => {
                const isCritical = notif.severity === 'critical';
                const isWarning = notif.severity === 'warning';

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.targetView) {
                        navigate(notif.targetView);
                        setNotificationsOpen(false);
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      notif.read
                        ? isDark 
                          ? 'bg-graphite-850/40 border-graphite-800/60 opacity-75'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                        : isCritical
                        ? isDark
                          ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60 shadow-crimson-glow'
                          : 'bg-rose-50 border-rose-300 hover:border-rose-500 shadow-sm'
                        : isWarning
                        ? isDark
                          ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
                          : 'bg-amber-50 border-amber-300 hover:border-amber-500 shadow-sm'
                        : isDark
                        ? 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/60'
                        : 'bg-cyan-50 border-cyan-300 hover:border-cyan-500 shadow-sm'
                    }`}
                  >
                    {!notif.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-electric animate-pulse" />
                    )}

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isCritical && <AlertCircle className={`w-5 h-5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />}
                        {isWarning && <AlertTriangle className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />}
                        {!isCritical && !isWarning && <Info className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />}
                      </div>

                      <div className="flex-1 pr-4">
                        <div className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                          isDark 
                            ? 'text-graphite-100 group-hover:text-cyan-electric' 
                            : 'text-slate-900 group-hover:text-cyan-700'
                        }`}>
                          {notif.title}
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className={`mt-1 text-xs leading-relaxed ${
                          isDark ? 'text-graphite-300' : 'text-slate-600'
                        }`}>
                          {notif.message}
                        </p>
                        <span className={`mt-2 block text-[11px] font-mono ${
                          isDark ? 'text-graphite-500' : 'text-slate-500'
                        }`}>
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className={`p-4 border-t text-xs font-mono text-center ${
            isDark ? 'border-graphite-800 bg-graphite-950/40 text-graphite-400' : 'border-slate-200 bg-slate-50 text-slate-500'
          }`}>
            System monitored by MachineMind Autonomous Agent v2.4
          </div>
        </div>
      </div>
    </div>
  );
};
