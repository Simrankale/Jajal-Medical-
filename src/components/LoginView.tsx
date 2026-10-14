import React, { useState } from 'react';
import { useAuth, DUMMY_CREDENTIALS } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { Activity, Shield, AlertCircle, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, quickLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('simran.kale@jajalmedical.com');
  const [password, setPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = await login(email, password);
    if (!res.success) {
      setErrorMessage(res.message || 'These credentials do not match our records.');
    }
  };

  const handleSelectRole = (role: UserRole) => {
    const creds = DUMMY_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.pass);
    setErrorMessage(null);
  };

  const handleSelectViraj = () => {
    setEmail('viraj.tamse@jajalmedical.com');
    setPassword('viraj123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-xl shadow-teal-500/30 mb-4 ring-4 ring-teal-400/20">
          <Activity className="w-9 h-9 stroke-[2.2]" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Jajal Medical</h2>
        <p className="mt-2 text-sm text-slate-300">
          Implant Case Management & Surgical Tracking
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          {/* Quick Select Dummy Credentials (As requested in assignment) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Demo Role (1-Click Fill)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                  email === DUMMY_CREDENTIALS.admin.email
                    ? 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold block truncate">Simran Sanket Kale</span>
                <span className="block text-[10px] text-teal-700 font-medium">Role: Admin (Full Access)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('viewer')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                  email === DUMMY_CREDENTIALS.viewer.email
                    ? 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold block truncate">Anjali Rathord</span>
                <span className="block text-[10px] text-blue-700 font-medium">Role: Viewer (Read-only)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('engineer')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                  email === DUMMY_CREDENTIALS.engineer.email
                    ? 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold block truncate">Varun Rivanker</span>
                <span className="block text-[10px] text-purple-700 font-medium">Role: Biomedical Engineer</span>
              </button>

              <button
                type="button"
                onClick={handleSelectViraj}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                  email === 'viraj.tamse@jajalmedical.com'
                    ? 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="font-bold block truncate">Viraj Santosh Tamse</span>
                <span className="block text-[10px] text-emerald-700 font-medium">Role: Chief Arthroplasty (Admin)</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-700 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
              <div>
                <span className="font-semibold">Authentication failed: </span>
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@jajalmedical.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder-slate-400 outline-hidden transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder-slate-400 outline-hidden transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Case OS</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Direct Sign-in pills */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center mb-3">Or instant sign in with one click:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold transition"
              >
                Simran (Admin)
              </button>
              <button
                onClick={() => quickLogin('viewer')}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold transition"
              >
                Anjali (Viewer)
              </button>
              <button
                onClick={() => quickLogin('engineer')}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold transition"
              >
                Varun (Engineer)
              </button>
              <button
                onClick={handleSelectViraj}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold transition"
              >
                Viraj (Chief Surgeon)
              </button>
            </div>
          </div>
        </div>

        {/* Security & Assignment Compliance note */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          <span>Role-Based Sanctum Bearer Token Security & CSRF Shield</span>
        </div>
      </div>
    </div>
  );
};
