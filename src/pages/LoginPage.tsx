import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { Cpu, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Check, Sun, Moon } from 'lucide-react';
import { Button } from '../components/common/Button';
import { PrivacyPolicyModal } from '../components/common/PrivacyPolicyModal';
import { TermsConditionsModal } from '../components/common/TermsConditionsModal';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { navigate } = useNavigation();
  const { theme, toggleTheme, isDark } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your enterprise email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('overview');
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoFill = () => {
    setEmail('elena.vance@machinemind.ai');
    setPassword('ApexReliability2026!');
    setErrorMessage('');
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

      {/* Background accents */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-electric/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand header */}
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
              OPERATIONS ACCESS GATEWAY
            </span>
          </div>
        </div>

        <h2 className={`text-center text-2xl font-bold tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Sign in to Enterprise Console
        </h2>
        <p className={`mt-2 text-center text-xs font-mono ${
          isDark ? 'text-graphite-400' : 'text-slate-500'
        }`}>
          Secured with 256-bit Hardware Security Module (HSM) Token
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className={`backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border ${
          isDark ? 'bg-graphite-900/90 border-graphite-800' : 'bg-white border-slate-200'
        }`}>
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-500 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-2 font-semibold ${
                isDark ? 'text-graphite-300' : 'text-slate-700'
              }`}>
                Enterprise Email
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isDark ? 'text-graphite-500' : 'text-slate-400'
                }`}>
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-xs font-mono uppercase tracking-wider font-semibold ${
                  isDark ? 'text-graphite-300' : 'text-slate-700'
                }`}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('forgot-password')}
                  className={`text-xs font-mono font-semibold ${
                    isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-700 hover:text-cyan-800'
                  }`}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isDark ? 'text-graphite-500' : 'text-slate-400'
                }`}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white placeholder-graphite-500 focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3.5 flex items-center ${
                    isDark ? 'text-graphite-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                />
                <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
                  Persist session for 30 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Platform
            </Button>
          </form>

          {/* Quick Demo Autofill Pill */}
          <div className={`mt-6 pt-5 border-t text-center ${isDark ? 'border-graphite-800' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={handleDemoFill}
              className={`text-xs font-mono inline-flex items-center gap-1.5 p-2 rounded-lg border transition-colors ${
                isDark 
                  ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/30' 
                  : 'text-cyan-800 hover:text-cyan-900 bg-cyan-50 border-cyan-300 font-semibold'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Autofill Demo Credentials (Dr. Vance)</span>
            </button>
          </div>
        </div>

        {/* Register prompt */}
        <div className={`mt-6 text-center text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
          New plant or facility deployment?{' '}
          <button
            onClick={() => navigate('register')}
            className={`hover:underline font-semibold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}
          >
            Create Enterprise Account
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-mono text-graphite-500">
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className="hover:underline hover:text-cyan-600 dark:hover:text-cyan-400"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="hover:underline hover:text-cyan-600 dark:hover:text-cyan-400"
          >
            Terms & Conditions
          </button>
        </div>
      </div>

      {/* Compliance & Legal Modals */}
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsConditionsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
};
