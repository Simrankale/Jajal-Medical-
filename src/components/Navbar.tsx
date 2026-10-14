import React from 'react';
import { useAuth, DUMMY_CREDENTIALS } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { 
  Activity, 
  Shield, 
  FlaskConical, 
  Terminal, 
  LogOut, 
  RotateCcw,
  UserCheck,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'cases';
  setCurrentTab: (tab: 'dashboard' | 'cases') => void;
  openTestRunner: () => void;
  openApiExplorer: () => void;
  onResetDatabase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openTestRunner,
  openApiExplorer,
  onResetDatabase,
}) => {
  const { user, logout, quickLogin, isAdmin } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'engineer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'viewer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Jajal Medical</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Case OS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Implant Lifecycle & Case Management</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('cases')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'cases'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Cases Explorer
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden md:block" />

            {/* Test Suite Trigger */}
            <button
              onClick={openTestRunner}
              title="Execute PHPUnit / Pest equivalent feature tests"
              className="hidden md:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
              <span>Feature Tests (6/6)</span>
            </button>

            {/* API Explorer */}
            <button
              onClick={openApiExplorer}
              title="Test REST API & Postman Collection"
              className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              <span>API & Postman</span>
            </button>
          </nav>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center space-x-2">
            {/* Quick Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${getRoleBadgeColor(
                  user?.role
                )}`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="font-semibold max-w-[160px] truncate">
                  {user?.name && !user.name.includes('Marcus')
                    ? user.name.split(' (')[0]
                    : 'Dr. Simran Sanket Kale'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                    Switch User Role / Persona
                  </div>
                  {(['admin', 'engineer', 'viewer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => quickLogin(r)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        user?.email === DUMMY_CREDENTIALS[r].email ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <p className="font-semibold text-slate-900">{DUMMY_CREDENTIALS[r].name.split(' (')[0]}</p>
                          <p className="text-[10px] text-teal-700 capitalize font-medium">Role: {r}</p>
                          <p className="text-[10px] text-slate-400">{DUMMY_CREDENTIALS[r].email}</p>
                        </div>
                      </div>
                      {user?.email === DUMMY_CREDENTIALS[r].email && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      )}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const { login } = useAuth();
                      login('viraj.tamse@jajalmedical.com', 'viraj123');
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      user?.email === 'viraj.tamse@jajalmedical.com' ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-900">Dr. Viraj Santosh Tamse</p>
                        <p className="text-[10px] text-emerald-700 font-medium">Role: Chief Arthroplasty (Admin)</p>
                        <p className="text-[10px] text-slate-400">viraj.tamse@jajalmedical.com</p>
                      </div>
                    </div>
                    {user?.email === 'viraj.tamse@jajalmedical.com' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    )}
                  </button>
                  {isAdmin && (
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        onClick={onResetDatabase}
                        className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                        <span>Reset Seed Data (24 cases)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
