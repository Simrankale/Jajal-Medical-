import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiClient } from '../services/apiClient.ts';
import { DashboardStats, MedicalCase } from '../types/index.ts';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle, 
  Layers, 
  Calendar, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  AlertTriangle,
  FileCheck2,
  Hourglass,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  X,
  UserCheck,
  Stethoscope
} from 'lucide-react';

interface DashboardViewProps {
  onOpenCreateCase: () => void;
  onViewCase: (caseItem: MedicalCase) => void;
  onNavigateToCasesWithFilter: (statusFilter: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenCreateCase,
  onViewCase,
  onNavigateToCasesWithFilter,
}) => {
  const { user, canCreate } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCases, setRecentCases] = useState<MedicalCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Surgeon search state on Dashboard
  const [surgeonSearch, setSurgeonSearch] = useState('');
  const [surgeonSearchResults, setSurgeonSearchResults] = useState<MedicalCase[]>([]);
  const [isSearchingSurgeon, setIsSearchingSurgeon] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, casesRes] = await Promise.all([
        apiClient.getStats(),
        apiClient.getCases({ page: 1, per_page: 6, sortBy: 'id', sortOrder: 'desc' }),
      ]);

      if (statsRes.body.success && statsRes.body.data) {
        setStats(statsRes.body.data);
      }
      if (casesRes.body.success && casesRes.body.data) {
        setRecentCases(casesRes.body.data.cases);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reactive surgeon search on dashboard
  useEffect(() => {
    const trimmed = surgeonSearch.trim();
    if (!trimmed) {
      setSurgeonSearchResults([]);
      setIsSearchingSurgeon(false);
      return;
    }

    setIsSearchingSurgeon(true);
    const timer = setTimeout(async () => {
      try {
        const res = await apiClient.getCases({
          search: trimmed,
          per_page: 50,
          sortBy: 'id',
          sortOrder: 'desc',
        });
        if (res.body.success && res.body.data) {
          setSurgeonSearchResults(res.body.data.cases);
        }
      } finally {
        setIsSearchingSurgeon(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [surgeonSearch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Planning':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'In Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-100 text-rose-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800';
      case 'Low':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Actions Header */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Jajal Medical Implant Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.includes('Marcus') ? 'Dr. Simran Sanket Kale' : (user?.name?.replace(/ \([^)]*\)/, '') || 'Dr. Simran Sanket Kale')}
          </h1>
          <p className="mt-1 text-sm text-teal-100/80 max-w-xl">
            Live overview of implant patient cases, pre-operative planning, and surgical approvals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {canCreate && (
            <button
              onClick={onOpenCreateCase}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-lg shadow-teal-500/30 transition transform active:scale-95 text-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Case</span>
            </button>
          )}
          <button
            onClick={() => onNavigateToCasesWithFilter('All')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-xs transition text-sm"
          >
            <span>View All Cases</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Surgeon Search Bar Component on Dashboard */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200/70">
              <Stethoscope className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Surgeon Case Search</h3>
              <p className="text-xs text-slate-500">Search cases by operating surgeon name or case number</p>
            </div>
          </div>

          {surgeonSearch && (
            <button
              onClick={() => setSurgeonSearch('')}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear search</span>
            </button>
          )}
        </div>

        {/* Search input with live clear button */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={surgeonSearch}
            onChange={(e) => setSurgeonSearch(e.target.value)}
            placeholder="Type surgeon name (e.g. Simran Sanket Kale, Viraj Tamse, Anjali Rathord, Varun Rivanker)..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900 placeholder-slate-400 transition"
          />
          {surgeonSearch && (
            <button
              onClick={() => setSurgeonSearch('')}
              className="absolute right-3 top-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Surgeon Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 text-[11px]">Surgeons:</span>
          {[
            'Dr. Simran Sanket Kale',
            'Dr. Anjali Rathord',
            'Varun Rivanker',
            'Dr. Viraj Santosh Tamse',
          ].map((sName) => (
            <button
              key={sName}
              type="button"
              onClick={() => setSurgeonSearch(sName)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                surgeonSearch.toLowerCase().includes(sName.toLowerCase()) || surgeonSearch.toLowerCase() === sName.toLowerCase()
                  ? 'bg-teal-600 text-white font-bold shadow-xs ring-2 ring-teal-500/20'
                  : 'bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200/80'
              }`}
            >
              <UserCheck className="w-3 h-3 opacity-60" />
              <span>{sName}</span>
            </button>
          ))}
          {surgeonSearch && (
            <button
              type="button"
              onClick={() => setSurgeonSearch('')}
              className="px-2 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Reactive Surgeon Search Results Section (Rendered when searching) */}
      {surgeonSearch.trim() && (
        <div className="bg-white rounded-2xl border border-teal-200 shadow-md overflow-hidden animate-fade-in">
          <div className="px-6 py-4 bg-teal-50/70 border-b border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Search Results for Surgeon:
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-600 text-white">
                  "{surgeonSearch}"
                </span>
              </div>
              <p className="text-xs text-teal-700 mt-0.5">
                {isSearchingSurgeon ? (
                  'Searching records...'
                ) : (
                  `Found ${surgeonSearchResults.length} matching implant case${surgeonSearchResults.length === 1 ? '' : 's'}`
                )}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSurgeonSearch('')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition"
              >
                Close Search
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isSearchingSurgeon ? (
              <div className="p-8 text-center text-slate-400">
                <Search className="w-6 h-6 animate-pulse mx-auto mb-2 text-teal-600" />
                <p className="text-xs">Filtering cases for "{surgeonSearch}"...</p>
              </div>
            ) : surgeonSearchResults.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-semibold text-sm text-slate-800">No cases found for "{surgeonSearch}"</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try clicking one of the surgeon chips above (e.g. Dr. Simran Sanket Kale, Dr. Anjali Rathord, Varun Rivanker, or Dr. Viraj Santosh Tamse).
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm divide-y divide-slate-100">
                <thead className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Case #</th>
                    <th className="px-6 py-3">Patient Ref</th>
                    <th className="px-6 py-3">Surgeon</th>
                    <th className="px-6 py-3">Implant Device</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Priority</th>
                    <th className="px-6 py-3">Surgery Date</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {surgeonSearchResults.map((c) => (
                    <tr key={c.id} className="hover:bg-teal-50/30 transition">
                      <td className="px-6 py-3.5 font-bold text-slate-900">{c.case_number}</td>
                      <td className="px-6 py-3.5 text-slate-600 font-mono text-xs">{c.patient_reference}</td>
                      <td className="px-6 py-3.5 text-teal-800 font-semibold flex items-center space-x-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        <span>{c.surgeon_name}</span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 max-w-xs truncate">{c.implant_type}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityBadge(c.priority)}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 text-xs">
                        {c.surgery_date || <span className="text-slate-400 italic">Unscheduled</span>}
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onViewCase(c)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 5 Mandatory Dashboard Metric Cards (As specified in Assignment Section 4.2) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Cases */}
        <div 
          onClick={() => onNavigateToCasesWithFilter('All')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Cases</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoading ? '...' : stats?.total ?? 0}
            </span>
            <span className="text-xs text-teal-600 font-medium">All active</span>
          </div>
        </div>

        {/* Planning Cases */}
        <div 
          onClick={() => onNavigateToCasesWithFilter('Planning')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Planning</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoading ? '...' : stats?.planning ?? 0}
            </span>
            <span className="text-xs text-sky-600 font-medium">In design</span>
          </div>
        </div>

        {/* In Review Cases */}
        <div 
          onClick={() => onNavigateToCasesWithFilter('In Review')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">In Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoading ? '...' : stats?.in_review ?? 0}
            </span>
            <span className="text-xs text-amber-600 font-medium">Surgeon review</span>
          </div>
        </div>

        {/* Approved Cases */}
        <div 
          onClick={() => onNavigateToCasesWithFilter('Approved')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Approved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoading ? '...' : stats?.approved ?? 0}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Ready for OR</span>
          </div>
        </div>

        {/* Completed Cases */}
        <div 
          onClick={() => onNavigateToCasesWithFilter('Completed')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 cursor-pointer transition group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoading ? '...' : stats?.completed ?? 0}
            </span>
            <span className="text-xs text-indigo-600 font-medium">Implanted</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Distribution Progress */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Implant Pipeline Distribution</h3>
            <span className="text-xs text-slate-500">Live Case Tracking</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Planning', count: stats?.planning || 0, color: 'bg-sky-500', text: 'text-sky-700' },
              { label: 'In Review', count: stats?.in_review || 0, color: 'bg-amber-500', text: 'text-amber-700' },
              { label: 'Approved', count: stats?.approved || 0, color: 'bg-emerald-500', text: 'text-emerald-700' },
              { label: 'Completed', count: stats?.completed || 0, color: 'bg-indigo-500', text: 'text-indigo-700' },
              { label: 'Draft', count: stats?.draft || 0, color: 'bg-slate-400', text: 'text-slate-600' },
              { label: 'Cancelled', count: stats?.cancelled || 0, color: 'bg-rose-400', text: 'text-rose-600' },
            ].map((item) => {
              const total = stats?.total || 1;
              const pct = Math.round((item.count / total) * 100) || 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="text-slate-500">
                      {item.count} cases ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Priority Classification</h3>
            <p className="text-xs text-slate-500 mb-4">Triage urgency for surgical delivery</p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span className="text-xs font-semibold text-rose-900">High Priority</span>
                </div>
                <span className="text-lg font-bold text-rose-900">
                  {stats?.priority_counts.high ?? 0}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="text-xs font-semibold text-amber-900">Medium Priority</span>
                </div>
                <span className="text-lg font-bold text-amber-900">
                  {stats?.priority_counts.medium ?? 0}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-xs font-semibold text-slate-800">Low Priority</span>
                </div>
                <span className="text-lg font-bold text-slate-800">
                  {stats?.priority_counts.low ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Critical surgeries</span>
            <span className="font-semibold text-rose-600">
              {stats?.priority_counts.high ?? 0} requiring priority queue
            </span>
          </div>
        </div>
      </div>

      {/* Recent Cases Preview */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Implant Cases</h3>
            <p className="text-xs text-slate-500">Latest active cases submitted to the platform</p>
          </div>
          <button
            onClick={() => onNavigateToCasesWithFilter('All')}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
          >
            <span>Explore all cases</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-3">Case Number</th>
                <th className="px-6 py-3">Patient Ref</th>
                <th className="px-6 py-3">Operating Surgeon</th>
                <th className="px-6 py-3">Implant Device</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{c.case_number}</td>
                  <td className="px-6 py-3.5 text-slate-600 font-mono text-xs">{c.patient_reference}</td>
                  <td className="px-6 py-3.5 text-slate-700 font-medium">{c.surgeon_name}</td>
                  <td className="px-6 py-3.5 text-slate-600 truncate max-w-xs">{c.implant_type}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadge(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => onViewCase(c)}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
