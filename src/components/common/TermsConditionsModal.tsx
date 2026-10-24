import React from 'react';
import { FileText, X, AlertTriangle, Cpu, Wrench, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({ isOpen, onClose }) => {
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
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Enterprise Terms & Service Agreement
              </h3>
              <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                Apex Industrial Dynamics Enterprise AI License v2.4
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
              <Cpu className="w-4 h-4" /> 1. Platform Scope & SLA Commitment
            </h4>
            <p className={isDark ? 'text-graphite-300' : 'text-slate-700'}>
              MachineMind AI delivers autonomous predictive maintenance, real-time vibration analytics, and Bayesian root cause determination backed by a 99.98% runtime SLA for critical plant telemetry ingestion gateways.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className={`text-sm font-sans font-bold flex items-center gap-2 text-amber-500`}>
              <AlertTriangle className="w-4 h-4" /> 2. Physical Maintenance & Safety Mandate (LOTO)
            </h4>
            <p className={isDark ? 'text-graphite-300' : 'text-slate-700'}>
              AI-generated repair strategies and digital twin simulations are decision-support recommendations. Certified field engineers must independently verify electrical isolation (Lockout/Tagout 6.6kV vacuum breakers) and follow OSHA/ISO 10816 safety protocols before physical contact with rotating machinery.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className={`text-sm font-sans font-bold flex items-center gap-2 ${isDark ? 'text-cyan-electric' : 'text-cyan-800'}`}>
              <Wrench className="w-4 h-4" /> 3. Digital Twin Co-Simulation Boundaries
            </h4>
            <p className={isDark ? 'text-graphite-300' : 'text-slate-700'}>
              Finite element stress margins (FEA) and Monte Carlo RUL forecasts reflect mathematical physics approximations. Operational parameters exceeding rated nameplate tolerances must be approved by the plant Chief Reliability Engineer.
            </p>
          </section>

          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-500" />
            <span className="text-[11px]">
              By authenticating to MachineMind AI, your organization certifies compliance with IEEE 1451 industrial smart sensor protocols.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex justify-end ${
          isDark ? 'border-graphite-800 bg-graphite-950/40' : 'border-slate-200 bg-slate-50'
        }`}>
          <Button variant="primary" size="sm" onClick={onClose}>
            I Understand & Agree
          </Button>
        </div>
      </div>
    </div>
  );
};
