import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Settings, 
  User, 
  Building2, 
  Sliders, 
  Bell, 
  Key, 
  ShieldCheck, 
  Database, 
  CheckCircle2, 
  Save, 
  Cpu,
  Lock,
  Radio,
  Server,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  // Profile fields
  const [name, setName] = useState(user?.name || 'Dr. Elena Vance');
  const [role, setRole] = useState(user?.role || 'Chief Reliability Engineer');
  const [organization, setOrganization] = useState(user?.organization || 'Apex Industrial Dynamics · Plant Delta-4');
  const [location, setLocation] = useState(user?.plantLocation || 'Rotterdam Industrial Basin');

  // Thresholds
  const [tempThreshold, setTempThreshold] = useState(85);
  const [vibThreshold, setVibThreshold] = useState(4.5);
  const [tripHealthThreshold, setTripHealthThreshold] = useState(40);

  // Notification toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState(true);

  // Save feedback
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, role, organization, plantLocation: location });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              User Profile & Industrial System Configuration
            </h2>
            <Badge variant="cyan" size="sm">ENTERPRISE ADMIN</Badge>
          </div>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            Configure telemetry ingestion bounds, notification dispatchers, and plant credentials
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          icon={savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
        >
          {savedSuccess ? 'Configuration Saved!' : 'Save System Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: User Profile & Security */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <h3 className={`text-base font-semibold pb-3 border-b flex items-center gap-2 ${
              isDark ? 'text-white border-graphite-800' : 'text-slate-900 border-slate-200'
            }`}>
              <User className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
              Engineer Profile & Access Tier
            </h3>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                  isDark ? 'text-graphite-400' : 'text-slate-600'
                }`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                  isDark ? 'text-graphite-400' : 'text-slate-600'
                }`}>
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                  isDark ? 'text-graphite-400' : 'text-slate-600'
                }`}>
                  Facility / Organization
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                  isDark ? 'text-graphite-400' : 'text-slate-600'
                }`}>
                  Plant Location Basin
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div className={`pt-2 flex items-center justify-between text-xs font-mono border-t ${
                isDark ? 'text-graphite-400 border-graphite-800' : 'text-slate-600 border-slate-200'
              }`}>
                <span>Security Clearance Tier:</span>
                <span className={`font-bold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>Class 4 Cryptographic Token (Full)</span>
              </div>
            </form>
          </Card>

          {/* Industrial Protocol Endpoints */}
          <Card>
            <h3 className={`text-base font-semibold pb-3 border-b flex items-center gap-2 ${
              isDark ? 'text-white border-graphite-800' : 'text-slate-900 border-slate-200'
            }`}>
              <Server className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
              Connected Telemetry Gateways & Protocol Endpoints
            </h3>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>OPC-UA Server</span>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>opc.tcp://192.168.4.12:4840</div>
                </div>
                <Badge variant="emerald" size="sm">ONLINE</Badge>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>MQTT Broker (TLS 1.3)</span>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>mqtts://telemetry.apex-plant.internal:8883</div>
                </div>
                <Badge variant="emerald" size="sm">CONNECTED</Badge>
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>SAP PM Work Order API</span>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>https://sap.plant-ops.internal/api/v2/pm</div>
                </div>
                <Badge variant="emerald" size="sm">SYNCED</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Alert Thresholds & Notification Channels */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <h3 className={`text-base font-semibold pb-3 border-b flex items-center gap-2 ${
              isDark ? 'text-white border-graphite-800' : 'text-slate-900 border-slate-200'
            }`}>
              <Sliders className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
              ISO 10816 Alarm & Trip Threshold Rules
            </h3>

            <div className="mt-4 space-y-5 font-mono text-xs">
              {/* Bearing Temperature Threshold */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-graphite-300' : 'text-slate-700'}>Bearing Temperature Alarm Trigger:</span>
                  <span className="text-rose-500 font-bold">{tempThreshold} °C</span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="115"
                  step="1"
                  value={tempThreshold}
                  onChange={(e) => setTempThreshold(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <span className={`text-[10px] block ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>
                  Industry standard ISO Class II recommends 85°C limit.
                </span>
              </div>

              {/* Vibration Velocity Limit */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-graphite-300' : 'text-slate-700'}>Radial Vibration Velocity Trip:</span>
                  <span className="text-amber-500 font-bold">{vibThreshold} mm/s</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="12.0"
                  step="0.1"
                  value={vibThreshold}
                  onChange={(e) => setVibThreshold(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className={`text-[10px] block ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>
                  Transition from Zone B (Acceptable) to Zone C (Unrestricted running limited).
                </span>
              </div>

              {/* Health Score Trip */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-graphite-300' : 'text-slate-700'}>Automatic Emergency De-rate Cutoff:</span>
                  <span className={`font-bold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>{tripHealthThreshold}% Health</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={tripHealthThreshold}
                  onChange={(e) => setTripHealthThreshold(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <span className={`text-[10px] block ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>
                  Signals automated load reduction via Distributed Control System (DCS).
                </span>
              </div>
            </div>
          </Card>

          {/* Theme & Display Preferences Card */}
          <Card>
            <h3 className={`text-base font-semibold pb-3 border-b flex items-center gap-2 ${
              isDark ? 'text-white border-graphite-800' : 'text-slate-900 border-slate-200'
            }`}>
              <Sun className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
              Interface Theme & Visual Display
            </h3>

            <div className="mt-4 space-y-3">
              <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                Select your preferred interface display mode. All 16 screens, charts, and 3D visualizers adapt dynamically.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all font-mono text-xs ${
                    theme === 'dark'
                      ? 'bg-graphite-950 border-cyan-electric text-cyan-electric shadow-cyan-glow font-bold'
                      : isDark
                        ? 'bg-graphite-900 border-graphite-800 text-graphite-400 hover:text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <span className="font-bold">Dark Graphite (Default)</span>
                  <span className={`text-[10px] font-sans ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>High-contrast night & control-room ops</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all font-mono text-xs ${
                    theme === 'light'
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-800 shadow-sm font-bold'
                      : isDark
                        ? 'bg-graphite-900 border-graphite-800 text-graphite-400 hover:text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span className="font-bold">Clean Industrial Light</span>
                  <span className={`text-[10px] font-sans ${isDark ? 'text-graphite-500' : 'text-slate-500'}`}>High-ambient daylight & office reviews</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Incident Notification Dispatch Channels */}
          <Card>
            <h3 className={`text-base font-semibold pb-3 border-b flex items-center gap-2 ${
              isDark ? 'text-white border-graphite-800' : 'text-slate-900 border-slate-200'
            }`}>
              <Bell className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
              Incident Escalation & Notification Channels
            </h3>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>PagerDuty & SMS Escalation</div>
                  <div className={`text-[11px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Immediate wake-up dispatch for Zone C/D critical alarms</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                />
              </label>

              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Reliability Briefing Digest</div>
                  <div className={`text-[11px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>06:00 UTC morning email with fleet health overview</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                />
              </label>

              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                isDark ? 'bg-graphite-950/60 border-graphite-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Microsoft Teams / Slack Channel Webhook</div>
                  <div className={`text-[11px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Posts diagnostic cards directly into #plant-reliability-ops</div>
                </div>
                <input
                  type="checkbox"
                  checked={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                />
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
