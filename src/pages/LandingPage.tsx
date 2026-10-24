import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Layers, 
  TrendingUp, 
  Crosshair, 
  Wrench, 
  CheckCircle2, 
  Server, 
  BarChart2, 
  Sparkles,
  Lock,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { PrivacyPolicyModal } from '../components/common/PrivacyPolicyModal';
import { TermsConditionsModal } from '../components/common/TermsConditionsModal';

export const LandingPage: React.FC = () => {
  const { navigate } = useNavigation();
  const { theme, toggleTheme, isDark } = useTheme();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-200 ${
      isDark ? 'bg-graphite-950 text-graphite-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-cyan-electric/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[800px] left-1/4 w-[600px] h-[350px] bg-electric-blue/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Public Navigation Bar */}
      <nav className={`relative z-20 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b ${
        isDark ? 'border-graphite-800/80' : 'border-slate-200 bg-white/70 backdrop-blur-md'
      }`}>
        <div 
          onClick={() => navigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-electric to-electric-blue flex items-center justify-center shadow-cyan-glow group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-graphite-950 font-bold" />
          </div>
          <div>
            <span className={`font-bold text-lg tracking-tight flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              MachineMind <span className="text-cyan-electric text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">AI</span>
            </span>
            <span className={`block text-[10px] font-mono tracking-wider ${
              isDark ? 'text-graphite-400' : 'text-slate-500'
            }`}>
              ENTERPRISE INDUSTRIAL INTELLIGENCE
            </span>
          </div>
        </div>

        <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${
          isDark ? 'text-graphite-300' : 'text-slate-600'
        }`}>
          <a href="#capabilities" className="hover:text-cyan-600 dark:hover:text-cyan-electric transition-colors">Capabilities</a>
          <a href="#digital-twin" className="hover:text-cyan-600 dark:hover:text-cyan-electric transition-colors">Digital Twin</a>
          <a href="#architecture" className="hover:text-cyan-600 dark:hover:text-cyan-electric transition-colors">Architecture</a>
          <a href="#roi" className="hover:text-cyan-600 dark:hover:text-cyan-electric transition-colors">Impact & ROI</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-colors flex items-center justify-center group ${
              isDark 
                ? 'bg-graphite-800/80 hover:bg-graphite-750 text-graphite-300 hover:text-white border-graphite-700/60' 
                : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-300 shadow-xs'
            }`}
            title={isDark ? "Switch to Clean Industrial Light Mode" : "Switch to Dark Graphite Mode"}
            aria-label="Toggle visual theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
          <button
            onClick={() => navigate('login')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isDark 
                ? 'text-graphite-200 hover:text-white hover:bg-graphite-800' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Sign In
          </button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('overview')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Launch Platform
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-24 px-6 max-w-7xl mx-auto text-center">
        {/* Tagline Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono mb-8 animate-pulse ${
          isDark 
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-electric shadow-cyan-glow' 
            : 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-sm'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Physics-Informed Industrial AI</span>
        </div>

        {/* Hero Title */}
        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          See the Failure. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-electric via-cyan-400 to-electric-blue">Understand the Cause.</span>
          <br />
          Simulate the Fix. Trust the Solution.
        </h1>

        <p className={`mt-6 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${
          isDark ? 'text-graphite-300' : 'text-slate-600'
        }`}>
          The autonomous predictive maintenance platform for mission-critical industrial assets. Transform noisy high-frequency sensor streams into physics-grounded root causes and verified digital twin repair simulations.
        </p>

        {/* CTA Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('overview')}
            icon={<Zap className="w-5 h-5 text-graphite-950" />}
          >
            Explore Live Fleet Demo
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('3d-model')}
            icon={<Cpu className="w-5 h-5 text-cyan-500" />}
          >
            Inspect 3D Digital Twin
          </Button>
        </div>

        {/* Proof Metrics Bar */}
        <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl border backdrop-blur-xl shadow-2xl ${
          isDark ? 'bg-graphite-900/80 border-graphite-800' : 'bg-white border-slate-200'
        }`}>
          <div className="text-center p-3">
            <div className={`text-3xl lg:text-4xl font-extrabold font-telemetry ${
              isDark ? 'text-cyan-electric' : 'text-cyan-700'
            }`}>
              78%
            </div>
            <div className={`text-xs font-mono mt-1 uppercase tracking-wider ${
              isDark ? 'text-graphite-400' : 'text-slate-500'
            }`}>
              Unplanned Downtime Reduction
            </div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl lg:text-4xl font-extrabold font-telemetry text-emerald-500">
              94.6%
            </div>
            <div className={`text-xs font-mono mt-1 uppercase tracking-wider ${
              isDark ? 'text-graphite-400' : 'text-slate-500'
            }`}>
              Diagnostic Precision Score
            </div>
          </div>
          <div className="text-center p-3">
            <div className={`text-3xl lg:text-4xl font-extrabold font-telemetry ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              &lt; 50ms
            </div>
            <div className={`text-xs font-mono mt-1 uppercase tracking-wider ${
              isDark ? 'text-graphite-400' : 'text-slate-500'
            }`}>
              Real-Time Inference Latency
            </div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl lg:text-4xl font-extrabold font-telemetry text-amber-500">
              $1.4M+
            </div>
            <div className={`text-xs font-mono mt-1 uppercase tracking-wider ${
              isDark ? 'text-graphite-400' : 'text-slate-500'
            }`}>
              Average Annual Avoided Loss
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section id="capabilities" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className={`text-xs font-mono uppercase tracking-widest font-semibold ${
            isDark ? 'text-cyan-electric' : 'text-cyan-700'
          }`}>
            ENGINEERED FOR EXTREME RELIABILITY
          </span>
          <h2 className={`mt-3 text-3xl sm:text-4xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Comprehensive Machine Intelligence Stack
          </h2>
          <p className={`mt-4 ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
            From raw high-frequency vibration spectrums to actionable, turn-by-turn maintenance procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border transition-all group ${
            isDark 
              ? 'bg-graphite-900 border-graphite-800 hover:border-cyan-500/40' 
              : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-electric mb-5 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Sub-Millisecond Telemetry</h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
              Streams continuous vibration, temperature, acoustic emissions, and pressure at full sampling rates with automated ISO 10816 threshold evaluation.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all group ${
            isDark 
              ? 'bg-graphite-900 border-graphite-800 hover:border-cyan-500/40' 
              : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-electric mb-5 group-hover:scale-110 transition-transform">
              <Crosshair className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Bayesian Root Cause Trees</h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
              Goes beyond mere anomaly flags. Isolates physical degradation mechanisms: raceway micro-spalling, dynamic unbalance, or lubricant shear thinning.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all group ${
            isDark 
              ? 'bg-graphite-900 border-graphite-800 hover:border-cyan-500/40' 
              : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-electric mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Interactive Digital Twin Simulator</h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
              Simulate proposed repair procedures inside a virtualized physical twin before dispatching technicians to the plant floor.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all group ${
            isDark 
              ? 'bg-graphite-900 border-graphite-800 hover:border-cyan-500/40' 
              : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-electric mb-5 group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Turnkey Repair Procedures</h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
              Synthesizes step-by-step technical procedures, estimated downtime, LOTO safety guidelines, and warehouse spare part availability checks.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all group ${
            isDark 
              ? 'bg-graphite-900 border-graphite-800 hover:border-cyan-500/40' 
              : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-electric mb-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Remaining Useful Life (RUL)</h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
              Monte Carlo stochastic degradation models with P10, P50, and P90 confidence intervals for exact maintenance schedule optimization.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border transition-all group ${
            isDark 
              ? 'bg-graphite-900 border-graphite-800 hover:border-cyan-500/40' 
              : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-electric mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Enterprise Security & Compliance</h3>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
              Air-gapped deployment ready, role-based access control, cryptographic audit trails, and ISO 55001 asset management compliance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="relative z-10 py-20 px-6 max-w-5xl mx-auto text-center">
        <div className={`p-10 rounded-3xl border shadow-cyan-glow ${
          isDark 
            ? 'bg-gradient-to-b from-graphite-900 to-graphite-850 border-cyan-500/30' 
            : 'bg-gradient-to-b from-white to-slate-50 border-cyan-400 shadow-lg text-slate-900'
        }`}>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ready to eliminate unplanned industrial outages?
          </h2>
          <p className={`mt-4 max-w-xl mx-auto text-sm sm:text-base ${isDark ? 'text-graphite-300' : 'text-slate-600'}`}>
            Join leading chemical, power, and manufacturing facilities utilizing MachineMind AI for zero-downtime operations.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('overview')}
            >
              Enter Intelligence Console
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('login')}
            >
              Operator Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className={`relative z-10 border-t py-10 px-6 text-center text-xs font-mono ${
        isDark ? 'border-graphite-800 text-graphite-500' : 'border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 MachineMind AI Systems Inc. Industrial Reliability Engine v2.4
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:underline cursor-pointer transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:underline cursor-pointer transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              Terms of Service
            </button>
            <span className="hover:underline cursor-pointer">Security Whitepaper</span>
            <span className="hover:underline cursor-pointer">API Documentation</span>
            <span className="hover:underline cursor-pointer">System Status</span>
          </div>
        </div>
      </footer>

      {/* Compliance & Legal Modals */}
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsConditionsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
};
