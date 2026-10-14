import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiClient } from '../services/apiClient.ts';
import { MedicalCase, CaseStatus, CasePriority, PublicHoliday } from '../types/index.ts';
import { 
  X, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  Info, 
  Save, 
  PlusCircle, 
  Check, 
  Clock,
  Building2,
  FileText
} from 'lucide-react';

interface CaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseSaved: (savedCase: MedicalCase) => void;
  editingCase?: MedicalCase | null;
}

const STATUS_OPTIONS: CaseStatus[] = [
  'Draft',
  'Planning',
  'In Review',
  'Approved',
  'Completed',
  'Cancelled',
];

const PRIORITY_OPTIONS: CasePriority[] = ['Low', 'Medium', 'High'];

export const CaseFormModal: React.FC<CaseFormModalProps> = ({
  isOpen,
  onClose,
  onCaseSaved,
  editingCase,
}) => {
  const { user } = useAuth();
  const isEditMode = Boolean(editingCase);

  // Form states
  const [caseNumber, setCaseNumber] = useState('');
  const [patientReference, setPatientReference] = useState('');
  const [surgeonName, setSurgeonName] = useState('');
  const [implantType, setImplantType] = useState('');
  const [status, setStatus] = useState<CaseStatus>('Planning');
  const [priority, setPriority] = useState<CasePriority>('Medium');
  const [surgeryDate, setSurgeryDate] = useState('');
  const [hospital, setHospital] = useState('');
  const [notes, setNotes] = useState('');

  // Field validation error states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Public holidays (Bonus feature: Nager.Date API)
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [holidayMatch, setHolidayMatch] = useState<PublicHoliday | null>(null);

  // Initialize form fields when opening or editing
  useEffect(() => {
    if (isOpen) {
      if (editingCase) {
        setCaseNumber(editingCase.case_number);
        setPatientReference(editingCase.patient_reference);
        setSurgeonName(editingCase.surgeon_name);
        setImplantType(editingCase.implant_type);
        setStatus(editingCase.status);
        setPriority(editingCase.priority);
        setSurgeryDate(editingCase.surgery_date || '');
        setHospital(editingCase.hospital || '');
        setNotes(editingCase.notes || '');
      } else {
        // Auto-generate fresh case number format CASE-XXXX for quick convenience
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        setCaseNumber(`CASE-${randomCode}`);
        setPatientReference(`PT-${Math.floor(1000 + Math.random() * 9000)}-SK`);
        setSurgeonName('Dr. Simran Sanket Kale');
        setImplantType('');
        setStatus('Planning');
        setPriority('Medium');
        setSurgeryDate('');
        setHospital('St. Jude Regional Orthopedic Center');
        setNotes('');
      }
      setFieldErrors({});
      setServerErrorMessage(null);
    }
  }, [isOpen, editingCase]);

  // Fetch Public Holidays for surgery scheduling awareness
  useEffect(() => {
    if (isOpen) {
      const year = new Date().getFullYear();
      apiClient.getHolidays(year, 'US').then((res) => {
        if (res.body.success && res.body.data) {
          setHolidays(res.body.data);
        }
      });
    }
  }, [isOpen]);

  // Check if chosen surgery date falls on a public holiday
  useEffect(() => {
    if (surgeryDate && holidays.length > 0) {
      const found = holidays.find((h) => h.date === surgeryDate);
      setHolidayMatch(found || null);
    } else {
      setHolidayMatch(null);
    }
  }, [surgeryDate, holidays]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setServerErrorMessage(null);

    const payload = {
      case_number: caseNumber,
      patient_reference: patientReference,
      surgeon_name: surgeonName,
      implant_type: implantType,
      status,
      priority,
      surgery_date: surgeryDate || null,
      hospital,
      notes,
    };

    try {
      let res;
      if (isEditMode && editingCase) {
        res = await apiClient.updateCase(editingCase.id, payload);
      } else {
        res = await apiClient.createCase(payload);
      }

      if (res.status === 200 || res.status === 201) {
        if (res.body.data) {
          onCaseSaved(res.body.data);
          onClose();
        }
      } else if (res.status === 422) {
        // Validation error
        if (res.body.errors) {
          setFieldErrors(res.body.errors);
        }
        setServerErrorMessage(res.body.message || 'Please correct the validation errors below.');
      } else if (res.status === 403) {
        setServerErrorMessage(res.body.message || 'Unauthorized action.');
      } else {
        setServerErrorMessage(res.body.message || 'Failed to save case.');
      }
    } catch (err: any) {
      setServerErrorMessage(err.message || 'Network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditMode ? `Edit Case: ${editingCase?.case_number}` : 'Create New Implant Case'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditMode
                ? 'Update surgical specifications and tracking status'
                : 'Register a new patient implant case into the management pipeline'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Server Error Banner */}
        {serverErrorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <span className="font-semibold">Submission Error: </span>
              {serverErrorMessage}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Case Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Case Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  placeholder="e.g. CASE-0001"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden font-mono uppercase ${
                    fieldErrors.case_number
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-slate-300 text-slate-900'
                  }`}
                />
              </div>
              {fieldErrors.case_number && (
                <p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.case_number[0]}</span>
                </p>
              )}
              <p className="text-[11px] text-slate-400 mt-0.5">Must be globally unique.</p>
            </div>

            {/* Patient Reference (Dummy code, not real name) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patient Reference <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={patientReference}
                onChange={(e) => setPatientReference(e.target.value)}
                placeholder="e.g. PT-9812-OR (dummy code)"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden font-mono ${
                  fieldErrors.patient_reference
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {fieldErrors.patient_reference && (
                <p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.patient_reference[0]}</span>
                </p>
              )}
              <p className="text-[11px] text-slate-400 mt-0.5">De-identified patient ID (HIPAA safe).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Surgeon Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operating Surgeon Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={surgeonName}
                onChange={(e) => setSurgeonName(e.target.value)}
                placeholder="e.g. Dr. Simran Sanket Kale"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden ${
                  fieldErrors.surgeon_name
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-300 text-slate-900'
                }`}
              />
              {fieldErrors.surgeon_name && (
                <p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.surgeon_name[0]}</span>
                </p>
              )}
              {/* Quick Surgeon Chips */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {[
                  'Dr. Simran Sanket Kale',
                  'Dr. Anjali Rathord',
                  'Varun Rivanker',
                  'Dr. Viraj Santosh Tamse',
                ].map((sName) => (
                  <button
                    key={sName}
                    type="button"
                    onClick={() => setSurgeonName(sName)}
                    className={`px-1.5 py-0.5 text-[10px] rounded border transition ${
                      surgeonName === sName
                        ? 'bg-teal-50 border-teal-400 text-teal-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sName.replace('Dr. ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Hospital / Clinic */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Surgical Center / Hospital
              </label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="e.g. St. Jude Regional Orthopedic Center"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden text-slate-900"
              />
            </div>
          </div>

          {/* Implant Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Implant Device Specification <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={implantType}
              onChange={(e) => setImplantType(e.target.value)}
              placeholder="e.g. Titanium Acetabular Hip Cup 54mm or PEEK Cranial Mesh"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden ${
                fieldErrors.implant_type
                  ? 'border-rose-400 bg-rose-50/30'
                  : 'border-slate-300 text-slate-900'
              }`}
            />
            {fieldErrors.implant_type && (
              <p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{fieldErrors.implant_type[0]}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden bg-white ${
                  fieldErrors.status
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-300 text-slate-900'
                }`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {fieldErrors.status && (
                <p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.status[0]}</span>
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority <span className="text-rose-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CasePriority)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden bg-white ${
                  fieldErrors.priority
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-300 text-slate-900'
                }`}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {fieldErrors.priority && (
                <p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.priority[0]}</span>
                </p>
              )}
            </div>

            {/* Surgery Date (With Nager.Date holiday checker - Bonus) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Surgery Date (Optional)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={surgeryDate}
                  onChange={(e) => setSurgeryDate(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden ${
                    fieldErrors.surgery_date
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-slate-300 text-slate-900'
                  }`}
                />
              </div>
              {fieldErrors.surgery_date && (
                <p className="mt-1 text-xs text-rose-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.surgery_date[0]}</span>
                </p>
              )}

              {/* Bonus feature: Nager.Date Public Holiday Indicator */}
              {holidayMatch && (
                <div className="mt-1.5 p-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
                  <span>
                    <strong>Nager.Date notice:</strong> Falls on{' '}
                    <strong>{holidayMatch.name}</strong> ({holidayMatch.countryCode}). OR staffing may be reduced.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Clinical / Engineering Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical & Engineering Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Porous titanium coating requested. CT slice thickness 0.5mm received."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden text-slate-900"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Assigned creator: <strong className="text-slate-600">{user?.name}</strong>
            </span>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Case' : 'Create Case'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
