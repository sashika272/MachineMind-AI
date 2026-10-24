import React from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Activity, 
  Layers, 
  FileText,
  Sliders
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { HealthDegradationChart } from '../components/charts/HealthDegradationChart';
import { mockPredictiveHealth } from '../services/mockData';

export const PredictiveMaintPage: React.FC = () => {
  const { selectedMachine } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Predictive Health Runway & Remaining Useful Life (RUL)
            </h2>
            <Badge variant="amber" size="sm">MONTE CARLO PROJECTION</Badge>
          </div>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            Stochastic Degradation Forecasting for {selectedMachine.name} ({selectedMachine.code})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('repair-strategies')}
          >
            Synthesize Action
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('digital-twin')}
            icon={<Layers className="w-4 h-4" />}
          >
            Digital Twin Simulator
          </Button>
        </div>
      </div>

      {/* 3 RUL Confidence Interval Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        {/* P10 Worst Case */}
        <Card className={isDark ? 'border-rose-500/30 shadow-crimson-glow' : 'border-rose-300 shadow-sm'}>
          <span className={`text-xs uppercase tracking-wider block font-semibold ${
            isDark ? 'text-graphite-400' : 'text-slate-600'
          }`}>
            P10 Worst-Case Bound (90% Confidence)
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-rose-500 font-telemetry">
              {mockPredictiveHealth.rulConfidenceInterval.p10}
            </span>
            <span className={`text-sm ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Operating Days</span>
          </div>
          <p className={`mt-2 text-xs font-sans leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
            Rapid spall expansion under peak continuous 450kW boiler feed pump demand.
          </p>
        </Card>

        {/* P50 Median Expected */}
        <Card className={isDark ? 'border-amber-500/30 shadow-amber-glow' : 'border-amber-300 shadow-sm'}>
          <span className={`text-xs uppercase tracking-wider block font-semibold ${
            isDark ? 'text-graphite-400' : 'text-slate-600'
          }`}>
            P50 Median Estimated RUL
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-amber-500 font-telemetry">
              {mockPredictiveHealth.rulConfidenceInterval.p50}
            </span>
            <span className={`text-sm ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Operating Days</span>
          </div>
          <p className={`mt-2 text-xs font-sans leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
            Expected functional failure point without immediate load derate or bearing replacement.
          </p>
        </Card>

        {/* P90 Best Case */}
        <Card className={isDark ? 'border-cyan-500/30' : 'border-cyan-300 shadow-sm'}>
          <span className={`text-xs uppercase tracking-wider block font-semibold ${
            isDark ? 'text-graphite-400' : 'text-slate-600'
          }`}>
            P90 Optimistic Ceiling
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold font-telemetry ${
              isDark ? 'text-cyan-electric' : 'text-cyan-700'
            }`}>
              {mockPredictiveHealth.rulConfidenceInterval.p90}
            </span>
            <span className={`text-sm ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Operating Days</span>
          </div>
          <p className={`mt-2 text-xs font-sans leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
            Possible run extension if ambient room cooling is optimized to 20°C.
          </p>
        </Card>
      </div>

      {/* Degradation Curve Chart */}
      <Card>
        <div className={`flex items-center justify-between pb-3 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Health Degradation Curve: Unmitigated vs Mitigated
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Projected exponential decay towards 40% automatic trip threshold
            </p>
          </div>
          <Badge variant="rose" size="sm">
            CRITICAL TRIP IN 5.2 DAYS
          </Badge>
        </div>

        <div className="pt-4">
          <HealthDegradationChart data={mockPredictiveHealth.healthDegradationCurve} height={280} />
        </div>
      </Card>

      {/* Maintenance Schedule Timeline & Sensor Drift Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Maintenance Timeline */}
        <div className="lg:col-span-6">
          <Card className="h-full">
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-graphite-800' : 'border-slate-200'
            }`}>
              <h3 className={`text-base font-semibold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
                Intervention Schedule & Dispatch
              </h3>
              <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Next 60 Days</span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              {mockPredictiveHealth.maintenanceTimeline.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                    item.urgency === 'critical'
                      ? isDark ? 'bg-rose-500/10 border-rose-500/40' : 'bg-rose-50 border-rose-200'
                      : item.urgency === 'warning'
                      ? isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                      : isDark ? 'bg-graphite-950/50 border-graphite-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{item.date}</span>
                      <Badge
                        variant={item.urgency === 'critical' ? 'rose' : item.urgency === 'warning' ? 'amber' : 'graphite'}
                        size="sm"
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className={`font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</div>
                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                      Subsystem: {item.component} · Assigned: {item.technician}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sensor Drift Forecast */}
        <div className="lg:col-span-6">
          <Card className="h-full">
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-graphite-800' : 'border-slate-200'
            }`}>
              <h3 className={`text-base font-semibold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
                Sensor Drift Trend Model
              </h3>
              <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Autoregressive ARIMA</span>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-graphite-800 text-graphite-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="pb-3 font-semibold">SENSOR</th>
                    <th className="pb-3 font-semibold">CURRENT</th>
                    <th className="pb-3 font-semibold">+7 DAYS</th>
                    <th className="pb-3 font-semibold">+30 DAYS</th>
                    <th className="pb-3 font-semibold">DRIFT STATUS</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-graphite-800/60' : 'divide-slate-200'}`}>
                  {mockPredictiveHealth.sensorDriftForecast.map((drift, idx) => (
                    <tr key={idx} className={`transition-colors ${isDark ? 'hover:bg-graphite-850/50' : 'hover:bg-slate-50'}`}>
                      <td className={`py-3 font-bold ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>{drift.sensor}</td>
                      <td className={`py-3 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{drift.current}</td>
                      <td className={`py-3 font-bold ${
                        drift.driftStatus === 'rapid_escalation' ? 'text-rose-500' : (isDark ? 'text-graphite-300' : 'text-slate-600')
                      }`}>
                        {drift.oneWeekProjected}
                      </td>
                      <td className={`py-3 font-bold ${
                        drift.driftStatus === 'rapid_escalation' ? 'text-rose-500' : (isDark ? 'text-graphite-300' : 'text-slate-600')
                      }`}>
                        {drift.oneMonthProjected}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            drift.driftStatus === 'rapid_escalation'
                              ? 'rose'
                              : drift.driftStatus === 'gradual_drift'
                              ? 'amber'
                              : 'emerald'
                          }
                          size="sm"
                        >
                          {drift.driftStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
