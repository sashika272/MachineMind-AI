import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { Cpu, Lock, Mail, User, Building2, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, Sun, Moon } from 'lucide-react';
import { Button } from '../components/common/Button';
import { PrivacyPolicyModal } from '../components/common/PrivacyPolicyModal';
import { TermsConditionsModal } from '../components/common/TermsConditionsModal';

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const { navigate } = useNavigation();
  const { theme, toggleTheme, isDark } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid enterprise email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must accept the Enterprise Data Security Agreement.');
      return;
    }

    const res = await register(fullName, email, password, organization);
    if (res.success) {
      navigate('overview');
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
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
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[350px] bg-electric-blue/10 blur-[130px] rounded-full pointer-events-none" />

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
              ENTERPRISE REGISTRATION
            </span>
          </div>
        </div>

        <h2 className={`text-center text-2xl font-bold tracking-tight ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Create Plant Engineering Account
        </h2>
        <p className={`mt-2 text-center text-xs font-mono ${
          isDark ? 'text-graphite-400' : 'text-slate-500'
        }`}>
          Connect your telemetry stream to autonomous physics models
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className={`backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border ${
          isDark ? 'bg-graphite-900/90 border-graphite-800' : 'bg-white border-slate-200'
        }`}>
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-500 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-graphite-300' : 'text-slate-700'
              }`}>
                Full Name
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isDark ? 'text-graphite-500' : 'text-slate-400'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="register-fullname"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Elena Vance"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white placeholder-graphite-500 focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-graphite-300' : 'text-slate-700'
              }`}>
                Work Email
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isDark ? 'text-graphite-500' : 'text-slate-400'
                }`}>
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena.vance@plant-ops.com"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white placeholder-graphite-500 focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-graphite-300' : 'text-slate-700'
              }`}>
                Industrial Facility / Organization
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isDark ? 'text-graphite-500' : 'text-slate-400'
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="register-org"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Apex Industrial Dynamics · Delta-4"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white placeholder-graphite-500 focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-graphite-300' : 'text-slate-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isDark ? 'text-graphite-500' : 'text-slate-400'
                }`}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 chars"
                  className={`w-full pl-10 pr-10 py-2 rounded-xl text-sm font-mono border focus:outline-none transition-colors ${
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

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-graphite-300' : 'text-slate-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isDark ? 'text-graphite-500' : 'text-slate-400'
                }`}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm font-mono border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-graphite-950 border-graphite-700 text-white placeholder-graphite-500 focus:border-cyan-electric' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                  }`}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-cyan-500 cursor-pointer"
                />
                <span className={`text-xs font-mono leading-relaxed ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className="text-cyan-600 dark:text-cyan-electric underline hover:text-cyan-500"
                  >
                    Enterprise Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="text-cyan-600 dark:text-cyan-electric underline hover:text-cyan-500"
                  >
                    Privacy Policy
                  </button>.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              loading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account & Initialize
            </Button>
          </form>
        </div>

        <div className={`mt-6 text-center text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
          Already registered?{' '}
          <button
            onClick={() => navigate('login')}
            className={`hover:underline font-semibold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}
          >
            Sign In to Existing Account
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
