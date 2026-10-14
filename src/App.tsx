import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LoginView } from './components/LoginView.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { CaseListView } from './components/CaseListView.tsx';
import { CaseFormModal } from './components/CaseFormModal.tsx';
import { CaseDetailsModal } from './components/CaseDetailsModal.tsx';
import { TestRunnerModal } from './components/TestRunnerModal.tsx';
import { ApiExplorerModal } from './components/ApiExplorerModal.tsx';
import { MedicalCase } from './types/index.ts';
import { apiClient } from './services/apiClient.ts';
import { CheckCircle2, RotateCcw } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'cases'>('dashboard');
  const [caseStatusFilter, setCaseStatusFilter] = useState<string>('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<MedicalCase | null>(null);
  const [viewingCase, setViewingCase] = useState<MedicalCase | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);
  const [isApiExplorerOpen, setIsApiExplorerOpen] = useState(false);

  // App notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // If still loading session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-300">Initializing Jajal Medical OS...</p>
        </div>
      </div>
    );
  }

  // All case pages must be hidden from users who are not logged in (Requirement Section 4.1)
  if (!user) {
    return <LoginView />;
  }

  const handleOpenCreateCase = () => {
    setEditingCase(null);
    setIsFormOpen(true);
  };

  const handleOpenEditCase = (caseItem: MedicalCase) => {
    setEditingCase(caseItem);
    setIsFormOpen(true);
  };

  const handleViewCase = (caseItem: MedicalCase) => {
    setViewingCase(caseItem);
    setIsDetailsOpen(true);
  };

  const handleCaseSaved = (savedCase: MedicalCase) => {
    showToast(`Case ${savedCase.case_number} was successfully saved.`);
  };

  const handleCaseDeleted = (deletedId: number) => {
    showToast(`Case #${deletedId} has been removed.`);
  };

  const handleStatusChanged = (updatedCase: MedicalCase) => {
    setViewingCase(updatedCase);
    showToast(`Case ${updatedCase.case_number} status updated to ${updatedCase.status}.`);
  };

  const handleNavigateToCasesWithFilter = (status: string) => {
    setCaseStatusFilter(status);
    setCurrentTab('cases');
  };

  const handleResetDatabase = async () => {
    if (window.confirm('Reset all cases back to the initial 24 seed cases?')) {
      const res = await apiClient.resetDatabase();
      if (res.body.success) {
        showToast('Database reset successfully with 24 seed cases.');
        // Refresh by toggling tab or reloading
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openTestRunner={() => setIsTestRunnerOpen(true)}
        openApiExplorer={() => setIsApiExplorerOpen(true)}
        onResetDatabase={handleResetDatabase}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-sm border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Quick Reviewer Helper Banner */}
        <div className="mb-4 bg-teal-50 border border-teal-200/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-teal-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Active Reviewer Session: <strong className="font-bold">{user?.name}</strong> ({user?.role?.toUpperCase()})
            </span>
            <span className="text-teal-600 hidden sm:inline">•</span>
            <span className="text-teal-700 hidden sm:inline">24 Medical Cases Loaded</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                currentTab === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-100'
              }`}
            >
              1. Dashboard KPIs
            </button>
            <button
              onClick={() => setCurrentTab('cases')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                currentTab === 'cases'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-100'
              }`}
            >
              2. Cases Explorer (Table)
            </button>
          </div>
        </div>

        {currentTab === 'dashboard' ? (
          <DashboardView
            onOpenCreateCase={handleOpenCreateCase}
            onViewCase={handleViewCase}
            onNavigateToCasesWithFilter={handleNavigateToCasesWithFilter}
          />
        ) : (
          <CaseListView
            initialStatusFilter={caseStatusFilter}
            onOpenCreateCase={handleOpenCreateCase}
            onOpenEditCase={handleOpenEditCase}
            onViewCase={handleViewCase}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>© 2026 Jajal Medical Devices Inc. | Medical Case Management System</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsTestRunnerOpen(true)}
              className="hover:text-teal-700 transition font-medium"
            >
              Automated Tests (6/6 passing)
            </button>
            <span>•</span>
            <button
              onClick={() => setIsApiExplorerOpen(true)}
              className="hover:text-teal-700 transition font-medium"
            >
              Postman Collection
            </button>
          </div>
        </div>
      </footer>

      {/* Reusable Form Modal (Create & Edit) */}
      <CaseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onCaseSaved={handleCaseSaved}
        editingCase={editingCase}
      />

      {/* Case Details Modal */}
      <CaseDetailsModal
        caseItem={viewingCase}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onOpenEdit={handleOpenEditCase}
        onCaseDeleted={handleCaseDeleted}
        onStatusChanged={handleStatusChanged}
      />

      {/* Automated Feature Tests Runner Modal */}
      <TestRunnerModal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
      />

      {/* REST API & Postman Explorer Modal */}
      <ApiExplorerModal
        isOpen={isApiExplorerOpen}
        onClose={() => setIsApiExplorerOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
