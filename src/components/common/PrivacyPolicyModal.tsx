import React from 'react';
import { Shield, X, Lock, Database, EyeOff, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-2xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
        isDark ? 'bg-graphite-900 border-graphite-700 text-graphite-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'border-graphite-800 bg-graphite-950/40' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Enterprise Privacy & Data Governance
              </h3>
              <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                ISO/IEC 27001:2022 & GDPR Industrial Telemetry Standard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-graphite-400 hover:text-white hover:bg-graphite-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono leading-relaxed">
          <section className="space-y-2">
            <h4 className={`text-sm font-sans font-bold flex items-center gap-2 ${isDark ? 'text-cyan-electric' : 'text-cyan-800'}`}>
              <Lock className="w-4 h-4" /> 1. Industrial Telemetry Ingestion & Cryptography
            </h4>
            <p className={isDark ? 'text-graphite-300' : 'text-slate-700'}>
              MachineMind AI processes high-frequency vibration, thermal gradient, and acoustic emission signals strictly within customer VPC or on-premise edge runtimes. All telemetry streams in transit are encrypted via TLS 1.3 (ChaCha20-Poly1305), and persistent state models are stored with AES-256 GCM envelope encryption.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className={`text-sm font-sans font-bold flex items-center gap-2 ${isDark ? 'text-cyan-electric' : 'text-cyan-800'}`}>
              <Database className="w-4 h-4" /> 2. Personal Credentials & Access Tiers
            </h4>
            <p className={isDark ? 'text-graphite-300' : 'text-slate-700'}>
              Authentication credentials for plant engineers and operators are salted and hashed using Argon2id/Bcrypt. Personal identifying attributes (full name, email, terminal location) are never shared with third-party advertising or non-operational vendors.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className={`text-sm font-sans font-bold flex items-center gap-2 ${isDark ? 'text-cyan-electric' : 'text-cyan-800'}`}>
              <EyeOff className="w-4 h-4" /> 3. Machine Learning Model Training Boundaries
            </h4>
            <p className={isDark ? 'text-graphite-300' : 'text-slate-700'}>
              Physical vibration spectra and Bayesian causal fault networks are trained exclusively on anonymized operational assets. Proprietary facility production quotas and process recipes are strictly isolated from cross-tenant neural networks.
            </p>
          </section>

          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-cyan-50 border-cyan-200 text-cyan-900'
          }`}>
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span className="text-[11px]">
              Compliance audit verified under SOC 2 Type II and ISO 27001 Annex A.8.24 standards.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex justify-end ${
          isDark ? 'border-graphite-800 bg-graphite-950/40' : 'border-slate-200 bg-slate-50'
        }`}>
          <Button variant="primary" size="sm" onClick={onClose}>
            Acknowledge & Close
          </Button>
        </div>
      </div>
    </div>
  );
};
