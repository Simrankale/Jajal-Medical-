import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiClient } from '../services/apiClient.ts';
import { MedicalCase, CaseStatus } from '../types/index.ts';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  ShieldAlert, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  Activity,
  AlertCircle,
  Tag,
  Share2
} from 'lucide-react';

interface CaseDetailsModalProps {
  caseItem: MedicalCase | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEdit: (caseItem: MedicalCase) => void;
  onCaseDeleted: (deletedCaseId: number) => void;
  onStatusChanged: (updatedCase: MedicalCase) => void;
}

export const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({
  caseItem,
  isOpen,
  onClose,
  onOpenEdit,
  onCaseDeleted,
  onStatusChanged,
}) => {
  const { user, isAdmin, canEdit, canDelete } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  if (!isOpen || !caseItem) return null;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete case ${caseItem.case_number}?`)) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.deleteCase(caseItem.id);
      if (res.status === 403) {
        setErrorMessage(res.body.message || 'Forbidden: 403. Only Admins can delete cases.');
        return;
      }
      if (res.body.success) {
        onCaseDeleted(caseItem.id);
        onClose();
      } else {
        setErrorMessage(res.body.message || 'Failed to delete case.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickStatusChange = async (newStatus: CaseStatus) => {
    setStatusUpdating(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.updateCase(caseItem.id, {
        ...caseItem,
        status: newStatus,
      });

      if (res.status === 200 && res.body.data) {
        onStatusChanged(res.body.data);
      } else if (res.status === 403) {
        setErrorMessage(res.body.message || 'Forbidden: You do not have permission to change status.');
      } else {
        setErrorMessage(res.body.message || 'Failed to update status.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Not scheduled';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatTimestamp = (isoStr?: string) => {
    if (!isoStr) return 'N/A';
    try {
      return new Date(isoStr).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Planning':
        return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'In Review':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Completed':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-teal-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold tracking-tight">{caseItem.case_number}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(caseItem.status)}`}>
                  {caseItem.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">Patient Ref: {caseItem.patient_reference}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Warning */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Security Gate Block: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Main Specifications Card */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Surgical & Implant Specifications
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Implant Device Model</span>
                <span className="font-semibold text-slate-900">{caseItem.implant_type}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Operating Surgeon</span>
                <span className="font-semibold text-slate-900">{caseItem.surgeon_name}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Surgical Center</span>
                <span className="font-medium text-slate-800">
                  {caseItem.hospital || 'General Hospital'}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Priority Classification</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-800">
                  {caseItem.priority} Priority
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Scheduled Surgery Date</span>
                <span className="font-semibold text-slate-900 flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600 inline" />
                  <span>{formatDate(caseItem.surgery_date)}</span>
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Database Record ID</span>
                <span className="font-mono text-xs text-slate-700">#{caseItem.id} (Auto-generated PK)</span>
              </div>
            </div>

            {caseItem.notes && (
              <div className="pt-3 border-t border-slate-200/60">
                <span className="text-xs text-slate-400 block mb-1">Clinical / Engineering Notes</span>
                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {caseItem.notes}
                </p>
              </div>
            )}
          </div>

          {/* Audit & Traceability Info (Who created it and when as required by Page 2 section 4.5) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Audit Trail & Timestamps</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Created By (Foreign Key)</span>
                <div className="font-semibold text-slate-800 mt-1 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>{caseItem.creator?.name || `User ID #${caseItem.created_by}`}</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Role: <span className="capitalize font-medium text-slate-600">{caseItem.creator?.role || 'authorized user'}</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Created Timestamp</span>
                <span className="font-mono text-slate-700 mt-1 block">
                  {formatTimestamp(caseItem.created_at)}
                </span>
                <span className="text-slate-400 block text-[11px] mt-2">Last Updated</span>
                <span className="font-mono text-slate-700 block">
                  {formatTimestamp(caseItem.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Status Workflow Changer (Admin & Engineer) */}
          {canEdit && (
            <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-200/60">
              <span className="text-xs font-bold text-teal-900 block mb-2">
                Workflow Status Transition (Authorized Role)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled'] as CaseStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleQuickStatusChange(st)}
                    disabled={statusUpdating || caseItem.status === st}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                      caseItem.status === st
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white border border-teal-200 text-teal-800 hover:bg-teal-100/70'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {/* Delete button: strictly visible to Admin only as required by assignment */}
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Case'}</span>
              </button>
            )}
            {!canDelete && (
              <span className="text-[11px] text-slate-400 italic">
                Deletion restricted to Admin role
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              Close
            </button>
            {canEdit && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEdit(caseItem);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition flex items-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Case</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
