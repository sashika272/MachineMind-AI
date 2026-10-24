import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Radio, 
  Activity, 
  Flame, 
  Gauge, 
  Zap, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Layers, 
  Play, 
  Pause,
  Filter,
  Maximize2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { TelemetryLineChart } from '../components/charts/TelemetryLineChart';
import { VibrationSpectrumChart } from '../components/charts/VibrationSpectrumChart';
import { mockVibrationSpectrum } from '../services/mockData';

export const LiveMonitoringPage: React.FC = () => {
  const { 
    selectedMachine, 
    liveTelemetry, 
    telemetryHistory, 
    isStreaming, 
    toggleStreaming,
    currentScenario,
    setScenario
  } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();

  const [activeChartMetric, setActiveChartMetric] = useState<'temperature' | 'vibration' | 'powerKw' | 'rpm'>('vibration');

  const sensors = [
    { id: 'RTD-DE-01', name: 'Drive-End Bearing PT100', type: 'Temperature', value: `${liveTelemetry.temperature} °C`, status: 'critical', threshold: '85.0 °C', snr: '42 dB', lastCal: '2026-08-14' },
    { id: 'DE-Acc-101', name: 'Triaxial Accelerometer DE', type: 'Vibration', value: `${liveTelemetry.vibration} mm/s`, status: 'critical', threshold: '4.50 mm/s', snr: '58 dB', lastCal: '2026-08-14' },
    { id: 'NDE-Acc-102', name: 'Single-Axis Accelerometer NDE', type: 'Vibration', value: '2.14 mm/s', status: 'optimal', threshold: '4.50 mm/s', snr: '61 dB', lastCal: '2026-08-14' },
    { id: 'PT-104', name: 'Oil Lube Differential Pressure', type: 'Pressure', value: `${liveTelemetry.pressure} bar`, status: 'optimal', threshold: '22.0 bar', snr: '48 dB', lastCal: '2026-06-20' },
    { id: 'CT-PhaseA', name: 'Stator High-Voltage Current', type: 'Electrical', value: '44.2 A', status: 'nominal', threshold: '48.5 A', snr: '52 dB', lastCal: '2026-05-11' },
    { id: 'AES-02', name: 'High-Frequency Ultrasonic Acoustic', type: 'Acoustic', value: `${liveTelemetry.acousticDb} dB`, status: 'warning', threshold: '88.0 dB', snr: '45 dB', lastCal: '2026-07-02' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-electric">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedMachine.name}
              </h2>
              <Badge variant="amber" size="sm">ZONE C ALERT</Badge>
            </div>
            <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Sensor Bus: ProfiNet IO · 1000Hz Ingestion Rate · {selectedMachine.facility}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isStreaming ? 'secondary' : 'primary'}
            size="sm"
            onClick={toggleStreaming}
            icon={isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isStreaming ? 'Pause Feed' : 'Resume Feed'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('digital-twin')}
            icon={<Layers className="w-3.5 h-3.5" />}
          >
            Digital Twin
          </Button>
        </div>
      </div>

      {/* Interactive Scenario Selection & Anomaly Injection Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDark ? 'bg-graphite-900/90 border-graphite-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
            isDark ? 'text-graphite-400' : 'text-slate-600'
          }`}>
            <Radio className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-electric" />
            Active Simulation Scenario:
          </span>
          <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-electric uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
            {currentScenario.replace('_', ' ')}
          </span>
        </div>

        {/* Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setScenario('normal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 font-semibold ${
              currentScenario === 'normal'
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-glow font-bold'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-400 font-bold'
                : isDark
                  ? 'bg-graphite-950 text-graphite-400 hover:text-white border border-graphite-800'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Nominal
          </button>

          <button
            onClick={() => setScenario('overheating')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 font-semibold ${
              currentScenario === 'overheating'
                ? isDark
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-amber-glow font-bold'
                  : 'bg-amber-100 text-amber-800 border border-amber-400 font-bold'
                : isDark
                  ? 'bg-graphite-950 text-graphite-400 hover:text-white border border-graphite-800'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Overheating (98°C)
          </button>

          <button
            onClick={() => setScenario('bearing_spall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 font-semibold ${
              currentScenario === 'bearing_spall'
                ? isDark
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-crimson-glow font-bold'
                  : 'bg-rose-100 text-rose-800 border border-rose-400 font-bold'
                : isDark
                  ? 'bg-graphite-950 text-graphite-400 hover:text-white border border-graphite-800'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            Vibration Spike (8.8 mm/s)
          </button>

          <button
            onClick={() => setScenario('pressure_surge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 font-semibold ${
              currentScenario === 'pressure_surge'
                ? isDark
                  ? 'bg-cyan-500/20 text-cyan-electric border border-cyan-500/40 shadow-cyan-glow font-bold'
                  : 'bg-cyan-100 text-cyan-800 border border-cyan-400 font-bold'
                : isDark
                  ? 'bg-graphite-950 text-graphite-400 hover:text-white border border-graphite-800'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-electric" />
            Pressure Surge
          </button>

          <button
            onClick={() => setScenario('multi_anomaly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 font-semibold ${
              currentScenario === 'multi_anomaly'
                ? isDark
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/60 shadow-crimson-glow font-bold'
                  : 'bg-rose-100 text-rose-900 border border-rose-400 font-bold'
                : isDark
                  ? 'bg-graphite-950 text-graphite-400 hover:text-white border border-graphite-800'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            Multi-Anomaly
          </button>
        </div>
      </div>

      {/* 4 Real-Time Core Telemetry Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vibration Card */}
        <Card className={`relative overflow-hidden ${isDark ? 'border-cyan-500/30 shadow-cyan-glow' : 'border-cyan-400 shadow-sm'}`}>
          <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            <span>RADIAL VIBRATION RMS</span>
            <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-telemetry text-cyan-600 dark:text-cyan-electric">
              {liveTelemetry.vibration}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>mm/s</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-rose-500 font-semibold">Threshold: &gt; 4.5 mm/s</span>
            <span className={isDark ? 'text-graphite-400' : 'text-slate-500'}>Peak: 9.12</span>
          </div>
        </Card>

        {/* Temperature Card */}
        <Card className={`relative overflow-hidden ${isDark ? 'border-rose-500/30 shadow-crimson-glow' : 'border-rose-400 shadow-sm'}`}>
          <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            <span>DE BEARING TEMPERATURE</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-telemetry text-rose-500">
              {liveTelemetry.temperature}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>°C</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-rose-500 font-semibold">Alarm: &gt; 85.0 °C</span>
            <span className={isDark ? 'text-graphite-400' : 'text-slate-500'}>Max: 94.1 °C</span>
          </div>
        </Card>

        {/* Speed / RPM */}
        <Card className="relative overflow-hidden">
          <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            <span>ROTOR SHAFT SPEED</span>
            <Gauge className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-telemetry ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {liveTelemetry.rpm}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>RPM</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-500 font-semibold">Rated: 3,000 RPM</span>
            <span className={isDark ? 'text-graphite-400' : 'text-slate-500'}>Slip: 0.83%</span>
          </div>
        </Card>

        {/* Acoustic Emissions */}
        <Card className="relative overflow-hidden">
          <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            <span>ACOUSTIC EMISSIONS</span>
            <Volume2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-telemetry text-amber-500">
              {liveTelemetry.acousticDb}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>dB(A)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-500 font-semibold">Ultrasonic Spike</span>
            <span className={isDark ? 'text-graphite-400' : 'text-slate-500'}>Base: 78.0</span>
          </div>
        </Card>
      </div>

      {/* Main Real-Time Telemetry Stream Chart */}
      <Card>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              High-Speed Dynamic Telemetry Stream
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Rolling 30-sample sliding buffer · Sampling frequency 10 Hz with anti-aliasing filter
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
            isDark ? 'bg-graphite-950 border-graphite-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveChartMetric('vibration')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors font-medium ${
                activeChartMetric === 'vibration'
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-electric border border-cyan-500/40 font-bold'
                    : 'bg-white text-cyan-800 border border-cyan-300 shadow-xs font-bold'
                  : isDark
                    ? 'text-graphite-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vibration RMS
            </button>
            <button
              onClick={() => setActiveChartMetric('temperature')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors font-medium ${
                activeChartMetric === 'temperature'
                  ? isDark
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                    : 'bg-white text-rose-800 border border-rose-300 shadow-xs font-bold'
                  : isDark
                    ? 'text-graphite-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DE Bearing Temp
            </button>
            <button
              onClick={() => setActiveChartMetric('powerKw')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors font-medium ${
                activeChartMetric === 'powerKw'
                  ? isDark
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold'
                    : 'bg-white text-blue-800 border border-blue-300 shadow-xs font-bold'
                  : isDark
                    ? 'text-graphite-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Power (kW)
            </button>
            <button
              onClick={() => setActiveChartMetric('rpm')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors font-medium ${
                activeChartMetric === 'rpm'
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                    : 'bg-white text-emerald-800 border border-emerald-300 shadow-xs font-bold'
                  : isDark
                    ? 'text-graphite-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shaft RPM
            </button>
          </div>
        </div>

        <div className="pt-4">
          <TelemetryLineChart data={telemetryHistory} metric={activeChartMetric} height={280} />
        </div>
      </Card>

      {/* Vibration Frequency Spectrum FFT & Anomaly Signature */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className={`flex items-center justify-between pb-3 border-b ${
                isDark ? 'border-graphite-800' : 'border-slate-200'
              }`}>
                <div>
                  <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Fast Fourier Transform (FFT) Spectral Analysis
                  </h3>
                  <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                    High-resolution demodulated envelope spectrum (0 - 1,000 Hz)
                  </p>
                </div>
                <Badge variant="rose" size="sm">
                  184.2 Hz BPFO PEAK
                </Badge>
              </div>

              <div className="pt-4">
                <VibrationSpectrumChart data={mockVibrationSpectrum} height={260} />
              </div>
            </div>

            <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
              isDark ? 'bg-graphite-950/60 border-graphite-800 text-graphite-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                Ball Pass Frequency Outer Race (BPFO) = 184.2 Hz (Amplitude 7.82 mm/s RMS)
              </span>
              <button
                onClick={() => navigate('root-cause')}
                className="text-cyan-600 dark:text-cyan-electric hover:underline font-semibold"
              >
                Inspect Causal Model →
              </button>
            </div>
          </Card>
        </div>

        {/* Operating Conditions & Health Index */}
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col justify-between space-y-4">
            <div>
              <h3 className={`text-base font-semibold pb-3 border-b ${
                isDark ? 'text-white border-graphite-800' : 'text-slate-900 border-slate-200'
              }`}>
                Operating Parameters
              </h3>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                  isDark ? 'bg-graphite-950/50 border-graphite-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Grid Voltage</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedMachine.modelSpecs.voltage}</span>
                </div>
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                  isDark ? 'bg-graphite-950/50 border-graphite-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Power Factor (cos φ)</span>
                  <span className="text-emerald-500 font-bold">{selectedMachine.powerFactor}</span>
                </div>
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                  isDark ? 'bg-graphite-950/50 border-graphite-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Motor Efficiency</span>
                  <span className="text-cyan-600 dark:text-cyan-electric font-bold">{selectedMachine.efficiencyPercent}%</span>
                </div>
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                  isDark ? 'bg-graphite-950/50 border-graphite-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Accumulated Run Hours</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedMachine.runningHours} hrs</span>
                </div>
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                  isDark ? 'bg-graphite-950/50 border-graphite-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={isDark ? 'text-graphite-400' : 'text-slate-600'}>Acoustic Noise SPL</span>
                  <span className="text-amber-500 font-bold">{selectedMachine.noiseDb} dB</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full text-xs"
              onClick={() => navigate('repair-strategies')}
            >
              Evaluate AI Repair Strategies
            </Button>
          </Card>
        </div>
      </div>

      {/* Sensor Array Health & Calibration Table */}
      <Card>
        <div className={`flex items-center justify-between pb-3 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Installed Sensor Array Diagnostics
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              6 Active telemetry nodes with continuous loop self-test
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-500 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Loop Resistance Verified
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b ${
                isDark ? 'border-graphite-800 text-graphite-400' : 'border-slate-200 text-slate-500'
              }`}>
                <th className="pb-3 font-semibold">SENSOR ID</th>
                <th className="pb-3 font-semibold">DESCRIPTION</th>
                <th className="pb-3 font-semibold">TYPE</th>
                <th className="pb-3 font-semibold">CURRENT VALUE</th>
                <th className="pb-3 font-semibold">ALARM THRESHOLD</th>
                <th className="pb-3 font-semibold">SIGNAL SNR</th>
                <th className="pb-3 font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isDark ? 'divide-graphite-800/60' : 'divide-slate-200'
            }`}>
              {sensors.map((sensor) => (
                <tr key={sensor.id} className={`transition-colors ${
                  isDark ? 'hover:bg-graphite-850/50' : 'hover:bg-slate-50'
                }`}>
                  <td className="py-3 font-bold text-cyan-600 dark:text-cyan-electric">{sensor.id}</td>
                  <td className={`py-3 ${isDark ? 'text-graphite-200' : 'text-slate-700'}`}>{sensor.name}</td>
                  <td className={`py-3 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{sensor.type}</td>
                  <td className={`py-3 font-bold ${
                    sensor.status === 'critical' ? 'text-rose-500' : sensor.status === 'warning' ? 'text-amber-500' : (isDark ? 'text-white' : 'text-slate-900')
                  }`}>
                    {sensor.value}
                  </td>
                  <td className={`py-3 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{sensor.threshold}</td>
                  <td className={`py-3 ${isDark ? 'text-graphite-300' : 'text-slate-600'}`}>{sensor.snr}</td>
                  <td className="py-3">
                    <Badge
                      variant={
                        sensor.status === 'critical'
                          ? 'rose'
                          : sensor.status === 'warning'
                          ? 'amber'
                          : 'emerald'
                      }
                      size="sm"
                    >
                      {sensor.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
