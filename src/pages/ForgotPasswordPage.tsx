import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { Cpu, Mail, ArrowLeft, CheckCircle2, ShieldCheck, KeyRound, Sun, Moon } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ForgotPasswordPage: React.FC = () => {
  const { navigate } = useNavigation();
  const { theme, toggleTheme, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 px-6 sm:px-8 relative overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-graphite-950 text-graphite-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border transition-colors shadow-lg ${
            isDark 
              ? 'bg-graphite-900 border-graphite-800 text-graphite-300 hover:text-white' 
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
        </button>
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-cyan-electric/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div 
          onClick={() => navigate('landing')}
          className="flex items-center justify-center gap-3 cursor-pointer group mb-6"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-electric to-electric-blue flex items-center justify-center shadow-cyan-glow group-hover:scale-105 transition-transform">
            <Cpu className="w-6 h-6 text-graphite-950 font-bold" />
          </div>
          <div>
            <span className={`font-bold text-xl tracking-tight flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              MachineMind <span className="text-cyan-electric text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">AI</span>
            </span>
            <span className={`block text-[10px] font-mono tracking-wider ${
              isDark ? 'text-graphite-400' : 'text-slate-500'
            }`}>
              CREDENTIAL RECOVERY
            </span>
          </div>
        </div>

        <h2 className={`text-center text-2xl font-bold tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Reset Security Password
        </h2>
        <p className={`mt-2 text-center text-xs font-mono ${
          isDark ? 'text-graphite-400' : 'text-slate-500'
        }`}>
          Enter your registered enterprise email for identity verification
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className={`backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border ${
          isDark ? 'bg-graphite-900/90 border-graphite-800' : 'bg-white border-slate-200'
        }`}>
          {submitted ? (
            <div className="text-center py-4 space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-emerald-glow">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recovery Link Dispatched
              </h3>
              <p className={`text-xs font-mono leading-relaxed ${isDark ? 'text-graphite-300' : 'text-slate-600'}`}>
                We sent a cryptographic one-time reset link to <span className={isDark ? 'text-cyan-electric' : 'text-cyan-700 font-bold'}>{email}</span>. Valid for 15 minutes.
              </p>
              <div className="pt-4">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('login')}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Return to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className={`block text-xs font-mono uppercase tracking-wider mb-2 font-semibold ${
                  isDark ? 'text-graphite-300' : 'text-slate-700'
                }`}>
                  Enterprise Email Address
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                    isDark ? 'text-graphite-500' : 'text-slate-400'
                  }`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@plant-domain.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-graphite-950 border-graphite-700 text-white placeholder-graphite-500 focus:border-cyan-electric' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                    }`}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
                icon={<KeyRound className="w-4 h-4" />}
              >
                Send Password Reset Token
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className={`text-xs font-mono inline-flex items-center gap-1.5 transition-colors font-semibold ${
                    isDark ? 'text-graphite-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
