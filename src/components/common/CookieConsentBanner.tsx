import React, { useState, useEffect } from 'react';
import { Cookie, Settings, Check, X, Shield, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

export interface CookiePreferences {
  essential: boolean;
  telemetryAnalytics: boolean;
  incidentAlerts: boolean;
}

export const CookieConsentBanner: React.FC = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    telemetryAnalytics: true,
    incidentAlerts: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('machinemind_cookie_consent');
    if (!saved) {
      // Delay display slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = {
      essential: true,
      telemetryAnalytics: true,
      incidentAlerts: true,
    };
    localStorage.setItem('machinemind_cookie_consent', JSON.stringify(allEnabled));
    setIsVisible(false);
  };

  const handleDeclineNonEssential = () => {
    const minimal: CookiePreferences = {
      essential: true,
      telemetryAnalytics: false,
      incidentAlerts: false,
    };
    localStorage.setItem('machinemind_cookie_consent', JSON.stringify(minimal));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('machinemind_cookie_consent', JSON.stringify(preferences));
    setShowPreferences(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-50 animate-in slide-in-from-bottom duration-300">
      <div className={`p-5 rounded-2xl border shadow-2xl backdrop-blur-md ${
        isDark 
          ? 'bg-graphite-900/95 border-graphite-700/80 text-white shadow-cyan-950/40' 
          : 'bg-white/95 border-slate-300 text-slate-900 shadow-xl'
      }`}>
        {!showPreferences ? (
          <div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-2">
                  Telemetry & Cookie Compliance
                </h4>
                <p className={`mt-1 text-xs font-mono leading-relaxed ${isDark ? 'text-graphite-300' : 'text-slate-600'}`}>
                  MachineMind AI uses cryptographically signed session tokens and low-overhead telemetry buffers to monitor industrial machinery in compliance with ISO 27001.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-200 dark:border-graphite-800">
              <button
                onClick={() => setShowPreferences(true)}
                className={`text-xs font-mono flex items-center gap-1 hover:underline font-semibold ${
                  isDark ? 'text-cyan-electric' : 'text-cyan-700'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Customize
              </button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDeclineNonEssential}>
                  Reject Optional
                </Button>
                <Button variant="primary" size="sm" onClick={handleAcceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-graphite-800">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
                Cookie & Storage Preferences
              </h4>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {/* Essential */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    Strictly Necessary
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">Required</span>
                  </div>
                  <div className={isDark ? 'text-graphite-400' : 'text-slate-500'}>
                    JWT auth tokens, CSRF validation, and active theme state.
                  </div>
                </div>
                <input type="checkbox" checked disabled className="accent-cyan-500" />
              </div>

              {/* Telemetry */}
              <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="font-bold">Telemetry Analytics</div>
                  <div className={isDark ? 'text-graphite-400' : 'text-slate-500'}>
                    Sensor buffer sampling frequency & WebGL frame timing metrics.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.telemetryAnalytics}
                  onChange={(e) => setPreferences((p) => ({ ...p, telemetryAnalytics: e.target.checked }))}
                  className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              {/* Alerts */}
              <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="font-bold">Incident Alert Dispatch</div>
                  <div className={isDark ? 'text-graphite-400' : 'text-slate-500'}>
                    Web push notification subscriptions and emergency chime caching.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.incidentAlerts}
                  onChange={(e) => setPreferences((p) => ({ ...p, incidentAlerts: e.target.checked }))}
                  className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-graphite-800">
              <Button variant="outline" size="sm" onClick={() => setShowPreferences(false)}>
                Back
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveCustom}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
