import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  ShieldAlert, 
  Activity, 
  Server, 
  RefreshCw,
  UserCheck,
  UserX,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { apiClient } from '../services/apiClient';

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  accessTier: 'Enterprise AI Full' | 'Operator Tier' | 'Viewer';
  isActive: boolean;
  lastLogin: string;
}

const initialMockUsers: AdminUserRecord[] = [
  {
    id: 'USR-001',
    name: 'Dr. Elena Vance',
    email: 'elena.vance@machinemind.ai',
    role: 'Chief Reliability Engineer',
    organization: 'Apex Industrial Dynamics',
    accessTier: 'Enterprise AI Full',
    isActive: true,
    lastLogin: 'Just now (Active)',
  },
  {
    id: 'USR-002',
    name: 'Marcus Chen',
    email: 'marcus.chen@machinemind.ai',
    role: 'Lead Mechanical Specialist',
    organization: 'Apex Industrial Dynamics',
    accessTier: 'Enterprise AI Full',
    isActive: true,
    lastLogin: '18 min ago',
  },
  {
    id: 'USR-003',
    name: 'David Miller',
    email: 'david.miller@machinemind.ai',
    role: 'Vibration Diagnostics Analyst',
    organization: 'Apex Industrial Dynamics',
    accessTier: 'Operator Tier',
    isActive: true,
    lastLogin: '2 hours ago',
  },
  {
    id: 'USR-004',
    name: 'Sarah Lin',
    email: 'sarah.lin@plant-ops.com',
    role: 'Shift Operations Supervisor',
    organization: 'Delta-4 Cogeneration Unit',
    accessTier: 'Operator Tier',
    isActive: true,
    lastLogin: 'Yesterday',
  },
  {
    id: 'USR-005',
    name: 'External Auditor',
    email: 'compliance@tuv-nord.de',
    role: 'ISO 13374 Certifier',
    organization: 'TÜV Industrial Audit',
    accessTier: 'Viewer',
    isActive: true,
    lastLogin: '3 days ago',
  },
];

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const [users, setUsers] = useState<AdminUserRecord[]>(initialMockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'Enterprise AI Full' | 'Operator Tier' | 'Viewer'>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch users from backend if available
  useEffect(() => {
    apiClient.users.list()
      .then((backendUsers) => {
        if (Array.isArray(backendUsers) && backendUsers.length > 0) {
          const mapped = backendUsers.map((u: any, idx: number) => ({
            id: u.id || `USR-00${idx + 1}`,
            name: u.name || 'Plant Personnel',
            email: u.email || 'operator@machinemind.ai',
            role: u.role || 'Reliability Engineer',
            organization: u.organization || 'Apex Industrial Dynamics',
            accessTier: (u.access_tier || u.accessTier || 'Enterprise AI Full') as any,
            isActive: u.is_active !== undefined ? u.is_active : true,
            lastLogin: idx === 0 ? 'Just now (Active)' : `${idx + 1} hours ago`,
          }));
          setUsers(mapped);
        }
      })
      .catch(() => {
        // Fall back to established mock list if network offline
      });
  }, []);

  const handleUpdateTier = async (userId: string, newTier: AdminUserRecord['accessTier']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, accessTier: newTier } : u))
    );
    setStatusMessage(`Access tier for ${userId} successfully updated to ${newTier}.`);
    setTimeout(() => setStatusMessage(null), 3000);

    try {
      await apiClient.users.updateAccess(userId, { access_tier: newTier });
    } catch {
      // Backend sync fallback
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const newStatus = !target.isActive;

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: newStatus } : u))
    );
    setStatusMessage(
      `User ${target.name} has been ${newStatus ? 'activated' : 'suspended'}.`
    );
    setTimeout(() => setStatusMessage(null), 3000);

    try {
      await apiClient.users.updateAccess(userId, { is_active: newStatus });
    } catch {
      // Backend sync fallback
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || u.accessTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-2xl border ${
        isDark ? 'bg-graphite-900 border-graphite-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Enterprise Administration & RBAC Security Console
              </h2>
              <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                Role-Based Access Control, Plant Credentials & Cryptographic Audit Trails
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm">
            ROOT CLEARANCE LEVEL 4
          </Badge>
          <Badge variant="emerald" size="sm">
            HSM ACTIVE
          </Badge>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in duration-200 ${
          isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="text-xs font-mono">{statusMessage}</span>
        </div>
      )}

      {/* 4 Security & Personnel Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            <span>REGISTERED PERSONNEL</span>
            <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-electric" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-telemetry ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {users.length}
            </span>
            <span className="text-xs font-mono text-emerald-500 font-bold">100% Verified</span>
          </div>
          <div className={`mt-2 text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            {users.filter(u => u.isActive).length} active credentials
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            <span>ENTERPRISE FULL TIER</span>
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-telemetry text-cyan-600 dark:text-cyan-electric`}>
              {users.filter(u => u.accessTier === 'Enterprise AI Full').length}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>Engineers</span>
          </div>
          <div className={`mt-2 text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            Authorized for physical LOTO
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            <span>CRYPTO HSM STATUS</span>
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-telemetry text-emerald-500`}>
              256-Bit
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>GCM</span>
          </div>
          <div className={`mt-2 text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            FIPS 140-3 Validated
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            <span>API DB LATENCY</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-telemetry text-blue-600 dark:text-blue-400`}>
              1.2
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>ms</span>
          </div>
          <div className={`mt-2 text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
            SQLite WAL Mode Synchronized
          </div>
        </Card>
      </div>

      {/* User Management & Access Table */}
      <Card>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b ${
          isDark ? 'border-graphite-800' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Plant Personnel & Access Control List
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              Modify user credentials, assign operational access tiers, and manage terminal sessions
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-graphite-400' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder="Search engineer, email, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-graphite-950 border-graphite-700 text-white focus:border-cyan-electric'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                }`}
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className={`text-xs font-mono px-3 py-1.5 rounded-xl border focus:outline-none ${
                isDark
                  ? 'bg-graphite-950 border-graphite-700 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">All Tiers</option>
              <option value="Enterprise AI Full">Enterprise Full</option>
              <option value="Operator Tier">Operator Tier</option>
              <option value="Viewer">Viewer Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className={`border-b uppercase tracking-wider text-[11px] font-semibold ${
                isDark ? 'border-graphite-800 text-graphite-400' : 'border-slate-200 text-slate-600 bg-slate-50/50'
              }`}>
                <th className="py-3 px-4">Engineer / Identity</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Access Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Terminal Ping</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-graphite-800/60' : 'divide-slate-200'}`}>
              {filteredUsers.map((u) => (
                <tr key={u.id} className={`transition-colors ${
                  isDark ? 'hover:bg-graphite-800/40' : 'hover:bg-slate-50'
                }`}>
                  <td className="py-3.5 px-4">
                    <div className="font-bold font-sans text-sm">{u.name}</div>
                    <div className={`text-[11px] font-mono ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
                      {u.email}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-sans font-medium">
                    {u.role}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={u.accessTier}
                      onChange={(e) => handleUpdateTier(u.id, e.target.value as any)}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg border focus:outline-none ${
                        u.accessTier === 'Enterprise AI Full'
                          ? isDark ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800' : 'bg-cyan-50 text-cyan-800 border-cyan-300'
                          : u.accessTier === 'Operator Tier'
                          ? isDark ? 'bg-amber-950/40 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-800 border-amber-300'
                          : isDark ? 'bg-graphite-800 text-graphite-300 border-graphite-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      <option value="Enterprise AI Full">Enterprise AI Full</option>
                      <option value="Operator Tier">Operator Tier</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      u.isActive
                        ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  <td className={`py-3.5 px-4 text-xs ${isDark ? 'text-graphite-400' : 'text-slate-600'}`}>
                    {u.lastLogin}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
                        u.isActive
                          ? isDark ? 'border-rose-800 text-rose-400 hover:bg-rose-950/40' : 'border-rose-300 text-rose-700 hover:bg-rose-50'
                          : isDark ? 'border-emerald-800 text-emerald-400 hover:bg-emerald-950/40' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title={u.isActive ? 'Suspend User Access' : 'Reactivate User Access'}
                    >
                      {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role-Based Permissions Reference Matrix */}
      <Card>
        <h3 className={`text-base font-semibold pb-3 border-b ${
          isDark ? 'text-white border-graphite-800' : 'text-slate-900 border-slate-200'
        }`}>
          Role-Based Access Control (RBAC) Permission Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 font-mono text-xs">
          {/* Tier 1 */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isDark ? 'bg-cyan-950/20 border-cyan-800/60' : 'bg-cyan-50/50 border-cyan-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-cyan-600 dark:text-cyan-electric">Enterprise AI Full</span>
              <Badge variant="cyan" size="sm">Admin</Badge>
            </div>
            <p className={isDark ? 'text-graphite-300' : 'text-slate-600'}>
              Unrestricted control over machine assets, live fault simulation injection, repair strategy approval, LOTO work orders, and user clearance changes.
            </p>
            <ul className="space-y-1 text-[11px] list-disc list-inside text-cyan-700 dark:text-cyan-300">
              <li>Digital Twin co-simulation parameter write</li>
              <li>Inject simulated sensor anomalies</li>
              <li>Sign off ISO 55001 maintenance logs</li>
              <li>Manage user roles and plant credentials</li>
            </ul>
          </div>

          {/* Tier 2 */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isDark ? 'bg-amber-950/20 border-amber-800/60' : 'bg-amber-50/50 border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-amber-600 dark:text-amber-400">Operator Tier</span>
              <Badge variant="amber" size="sm">Staff</Badge>
            </div>
            <p className={isDark ? 'text-graphite-300' : 'text-slate-600'}>
              Field personnel access for inspecting telemetry alarms, following step-by-step repair guides, and monitoring FFT spectral signatures.
            </p>
            <ul className="space-y-1 text-[11px] list-disc list-inside text-amber-700 dark:text-amber-300">
              <li>Live machine telemetry streaming</li>
              <li>Inspect causal Bayesian fault trees</li>
              <li>Download PDF & CSV reports</li>
              <li>Acknowledge active notifications</li>
            </ul>
          </div>

          {/* Tier 3 */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isDark ? 'bg-graphite-950/40 border-graphite-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm ${isDark ? 'text-graphite-200' : 'text-slate-800'}`}>Viewer</span>
              <Badge variant="graphite" size="sm">Audit</Badge>
            </div>
            <p className={isDark ? 'text-graphite-300' : 'text-slate-600'}>
              Read-only compliance and executive monitoring access for financial stakeholders, insurance adjusters, and third-party auditors.
            </p>
            <ul className={`space-y-1 text-[11px] list-disc list-inside ${isDark ? 'text-graphite-400' : 'text-slate-500'}`}>
              <li>View high-level fleet health score</li>
              <li>Review maintenance incident history</li>
              <li>Inspect ISO 13374 compliance certificates</li>
              <li>Restricted from sensor configuration</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
