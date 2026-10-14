import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiClient } from '../services/apiClient.ts';
import { MedicalCase, CaseStatus, CasePriority } from '../types/index.ts';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  RefreshCw,
  Tag
} from 'lucide-react';

interface CaseListViewProps {
  initialStatusFilter?: string;
  onOpenCreateCase: () => void;
  onOpenEditCase: (caseItem: MedicalCase) => void;
  onViewCase: (caseItem: MedicalCase) => void;
}

export const CaseListView: React.FC<CaseListViewProps> = ({
  initialStatusFilter = 'All',
  onOpenCreateCase,
  onOpenEditCase,
  onViewCase,
}) => {
  const { user, isAdmin, canCreate, canEdit, canDelete } = useAuth();
  
  // Query state
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Deletion state
  const [caseToDelete, setCaseToDelete] = useState<MedicalCase | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getCases({
        page,
        per_page: 10,
        search,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder,
      });

      if (res.body.success && res.body.data) {
        setCases(res.body.data.cases);
        setTotalPages(res.body.data.total_pages);
        setTotalItems(res.body.data.total);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [page, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Search debounce / submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCases();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!caseToDelete) return;
    setIsDeleting(true);
    setDeleteErrorMessage(null);

    try {
      const res = await apiClient.deleteCase(caseToDelete.id);
      if (res.status === 403) {
        setDeleteErrorMessage(res.body.message || 'Server blocked deletion: 403 Forbidden. Only Admins can delete cases.');
        return;
      }
      if (res.status === 200 && res.body.success) {
        setNotification({
          type: 'success',
          message: `Case ${caseToDelete.case_number} was successfully deleted.`,
        });
        setCaseToDelete(null);
        fetchCases();
      } else {
        setDeleteErrorMessage(res.body.message || 'Failed to delete case.');
      }
    } catch (err: any) {
      setDeleteErrorMessage(err.message || 'An unexpected error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

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
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-teal-600 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-teal-600 inline" />
    );
  };

  return (
    <div className="space-y-5">
      {/* Notifications */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-emerald-600 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Implant Cases Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Displaying {cases.length} of {totalItems} total medical implant cases (10 per page)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {canCreate && (
            <button
              onClick={onOpenCreateCase}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Case</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Case Number or Surgeon..."
            className="w-full pl-9 pr-20 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
          >
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs font-medium py-1.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-teal-500 outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Planning">Planning</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter (Bonus Task) */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-500 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs font-medium py-1.5 px-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-teal-500 outline-hidden"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setPriorityFilter('All');
              setSortBy('id');
              setSortOrder('desc');
              setPage(1);
            }}
            title="Reset Filters"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm divide-y divide-slate-200">
            <thead className="bg-slate-50/80 text-slate-600 text-xs font-semibold tracking-wider select-none">
              <tr>
                <th
                  onClick={() => handleSort('case_number')}
                  className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 transition"
                >
                  <div className="flex items-center">
                    <span>Case #</span>
                    {renderSortIcon('case_number')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('patient_reference')}
                  className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 transition"
                >
                  <div className="flex items-center">
                    <span>Patient Ref</span>
                    {renderSortIcon('patient_reference')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('surgeon_name')}
                  className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 transition"
                >
                  <div className="flex items-center">
                    <span>Surgeon</span>
                    {renderSortIcon('surgeon_name')}
                  </div>
                </th>
                <th className="px-6 py-3.5">Implant Device</th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 transition"
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('priority')}
                  className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 transition"
                >
                  <div className="flex items-center">
                    <span>Priority</span>
                    {renderSortIcon('priority')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('surgery_date')}
                  className="px-6 py-3.5 cursor-pointer hover:bg-slate-100 transition"
                >
                  <div className="flex items-center">
                    <span>Surgery Date</span>
                    {renderSortIcon('surgery_date')}
                  </div>
                </th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600 mb-2" />
                    <span>Loading medical cases...</span>
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No cases match your search criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the status/priority filter or search query</p>
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition group">
                    <td className="px-6 py-3.5 font-bold text-slate-900 group-hover:text-teal-700 transition">
                      {c.case_number}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-mono text-xs">
                      {c.patient_reference}
                    </td>
                    <td className="px-6 py-3.5 text-slate-800 font-medium">
                      {c.surgeon_name}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 max-w-xs truncate" title={c.implant_type}>
                      {c.implant_type}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getPriorityBadge(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 text-xs">
                      {c.surgery_date ? (
                        <span>{c.surgery_date}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unscheduled</span>
                      )}
                    </td>
                    
                    {/* View / Edit / Delete buttons shown according to roles */}
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* View: Visible to all roles (Admin, Engineer, Viewer) */}
                        <button
                          onClick={() => onViewCase(c)}
                          title="View Case Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit: Visible to Admin and Engineer only (hidden for Viewer) */}
                        {canEdit && (
                          <button
                            onClick={() => onOpenEditCase(c)}
                            title="Edit Case"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete: Visible to Admin only (strictly hidden for Viewer and Engineer) */}
                        {canDelete && (
                          <button
                            onClick={() => setCaseToDelete(c)}
                            title="Delete Case (Admin Only)"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (10 per page as required in Assignment Section 4.3) */}
        <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Showing Page <span className="font-semibold text-slate-800">{page}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalPages}</span> ({totalItems} cases)
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Page number indicators */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 text-xs font-semibold rounded-lg transition ${
                  p === page
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {caseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Confirm Case Deletion</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to permanently delete case{' '}
                <span className="font-bold text-slate-800">{caseToDelete.case_number}</span>?
              </p>
              <p className="text-xs text-rose-600 font-medium mt-1">
                This action is audited and cannot be undone.
              </p>
            </div>

            {deleteErrorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{deleteErrorMessage}</span>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCaseToDelete(null);
                  setDeleteErrorMessage(null);
                }}
                disabled={isDeleting}
                className="flex-1 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2 text-sm font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Case'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
