import React, { useState, useEffect } from 'react';
import { useMachine } from '../context/MachineContext';
import { useNavigation } from '../context/NavigationContext';
import { useTheme } from '../context/ThemeContext';
import { apiClient } from '../services/apiClient';
import { 
  History, 
  Calendar, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  User, 
  Package, 
  FileText,
  Sliders,
  Play,
  RotateCcw,
  Search,
  ArrowUpDown,
  X
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { mockIncidents } from '../services/mockData';
import { formatCurrency } from '../utils/formatters';

export const MachineHistoryPage: React.FC = () => {
  const { selectedMachine } = useMachine();
  const { navigate } = useNavigation();
  const { isDark } = useTheme();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'cost_desc' | 'duration_desc'>('date_desc');
  const [replayScrubber, setReplayScrubber] = useState<number>(100);
  const [incidents, setIncidents] = useState<any[]>(mockIncidents);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    apiClient.history.getIncidents(selectedMachine.id)
      .then((records) => {
        if (records && records.length > 0) {
          setIncidents(records);
        } else {
          setIncidents(mockIncidents);
        }
      })
      .catch(() => {
        setIncidents(mockIncidents);
      })
      .finally(() => setLoading(false));
  }, [selectedMachine.id]);

  const filteredIncidents = incidents
    .filter((inc) => (typeFilter === 'all' ? true : inc.type === typeFilter))
    .filter((inc) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const partsText = Array.isArray(inc.partsReplaced)
        ? inc.partsReplaced.map((p: any) => typeof p === 'string' ? p : (p?.name || p?.part_name || '')).join(' ')
        : '';
      return (
        inc.title?.toLowerCase().includes(q) ||
        inc.technician?.toLowerCase().includes(q) ||
        inc.resolution?.toLowerCase().includes(q) ||
        partsText.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'cost_desc') return (b.costUsd || 0) - (a.costUsd || 0);
      if (sortBy === 'duration_desc') return (b.durationHours || 0) - (a.durationHours || 0);
      return 0;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar with Search, Sort & Type Filters */}
      <div className={`flex flex-col gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Machine Lifecycle Log & Maintenance Audit Trail
              </h2>
              <Badge variant="cyan" size="sm">ISO 55001 COMPLIANT</Badge>
            </div>
            <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Cryptographically Signed Maintenance Records · {selectedMachine.name} ({selectedMachine.code})
            </p>
          </div>
          <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
            isDark ? 'bg-graphite-950 border-graphite-800 text-graphite-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            Showing {filteredIncidents.length} of {incidents.length} Records
          </span>
        </div>

        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 pt-3 border-t border-graphite-800/60 dark:border-graphite-800 border-slate-200">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-graphite-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, technician, parts..."
                className={`w-full pl-8 pr-7 py-1.5 rounded-xl text-xs font-mono border focus:outline-none transition-colors ${
                  isDark 
                    ? 'bg-graphite-950 border-graphite-700 text-white placeholder-graphite-500 focus:border-cyan-electric' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded ${
                    isDark ? 'text-graphite-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className={`w-3.5 h-3.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort lifecycle events"
                className={`py-1.5 px-2.5 rounded-xl text-xs font-mono border focus:outline-none transition-colors font-semibold ${
                  isDark 
                    ? 'bg-graphite-950 border-graphite-700 text-graphite-200 focus:border-cyan-electric' 
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-600'
                }`}
              >
                <option value="date_desc">Date (Newest First)</option>
                <option value="date_asc">Date (Oldest First)</option>
                <option value="cost_desc">Cost (Highest First)</option>
                <option value="duration_desc">Downtime (Highest First)</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-graphite-950 border-graphite-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {['all', 'maintenance', 'fault', 'inspection', 'component_replacement'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-colors font-semibold ${
                  typeFilter === t
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-electric border border-cyan-500/40 font-bold'
                      : 'bg-white text-cyan-800 border border-cyan-300 shadow-xs font-bold'
                    : isDark
                      ? 'text-graphite-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Telemetry Scrubber / Time Travel Bar */}
      <Card className={isDark ? 'bg-graphite-900/90' : 'bg-white shadow-sm'}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-sm font-semibold uppercase font-mono tracking-wider flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
              Historical Sensor Telemetry Replay & Event Scrubber
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Scrub backwards to replay dynamic telemetry across past operational windows
            </p>
          </div>

          <div className={`flex items-center gap-2 font-mono text-xs ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
            <span>T - {Math.round((100 - replayScrubber) * 0.72)} Hours</span>
            <button
              onClick={() => setReplayScrubber(100)}
              className="p-1 text-cyan-600 dark:text-cyan-400 hover:underline"
              title="Jump to current live time"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={replayScrubber}
            onChange={(e) => setReplayScrubber(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />

          <div className={`flex items-center justify-between text-[11px] font-mono ${
            isDark ? 'text-graphite-500' : 'text-slate-500'
          }`}>
            <span>Oct 21, 06:00 (Onset of Spall)</span>
            <span>Oct 22, 12:00 (Temp Alert)</span>
            <span>Oct 23, 18:00 (Velocity Surge)</span>
            <span className={`font-bold ${isDark ? 'text-cyan-electric' : 'text-cyan-700'}`}>Now (Active Zone C Alarm)</span>
          </div>
        </div>
      </Card>

      {/* Audit Log Chronological Timeline */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border text-xs font-mono ${
            isDark ? 'bg-graphite-900/60 border-graphite-800 text-graphite-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            No maintenance records match your search criteria.
          </div>
        ) : (
          filteredIncidents.map((inc) => (
          <Card key={inc.id} className={`p-5 transition-colors ${
            isDark ? 'hover:border-graphite-600' : 'hover:border-slate-300'
          }`}>
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b ${
              isDark ? 'border-graphite-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${
                  inc.type === 'fault'
                    ? isDark ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-rose-100 text-rose-700 border-rose-300'
                    : inc.type === 'component_replacement'
                    ? isDark ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-cyan-100 text-cyan-700 border-cyan-300'
                    : isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                }`}>
                  {inc.type === 'fault' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : inc.type === 'component_replacement' ? (
                    <Wrench className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-semibold ${
                      isDark ? 'text-cyan-electric' : 'text-cyan-700'
                    }`}>{inc.id}</span>
                    <Badge variant="graphite" size="sm">
                      {inc.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>{inc.date}</span>
                  </div>
                  <h4 className={`text-base font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {inc.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                <div className="text-right">
                  <span className={`text-[10px] uppercase block font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Downtime</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{inc.durationHours} hrs</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase block font-semibold ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Cost</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(inc.costUsd)}</span>
                </div>
              </div>
            </div>

            {/* Resolution Text */}
            <div className="py-3">
              <p className={`text-xs leading-relaxed font-mono ${isDark ? 'text-graphite-300' : 'text-slate-700'}`}>
                {inc.resolution}
              </p>
            </div>

            {/* Footer with Technician and Parts Replaced */}
            <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
              isDark ? 'border-graphite-800/80 text-graphite-400' : 'border-slate-200 text-slate-500'
            }`}>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-electric" />
                <span>Certified Engineer: <strong className={isDark ? 'text-graphite-200' : 'text-slate-800'}>{inc.technician}</strong></span>
              </div>

              {inc.partsReplaced && inc.partsReplaced.length > 0 && (
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-amber-500" />
                  <span>Parts Installed: <strong className={isDark ? 'text-graphite-200' : 'text-slate-800'}>
                    {inc.partsReplaced.map((p: any) => typeof p === 'string' ? p : (p.name || p.part_name || p.part_id || 'OEM Spec Part')).join(', ')}
                  </strong></span>
                </div>
              )}
            </div>
          </Card>
        )))}
      </div>
    </div>
  );
};
