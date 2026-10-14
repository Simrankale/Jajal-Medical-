import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient.ts';
import { TestCaseResult } from '../types/index.ts';
import { 
  X, 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Terminal,
  ShieldCheck,
  Code2
} from 'lucide-react';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [tests, setTests] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const executeTests = async () => {
    setIsRunning(true);
    try {
      const res = await apiClient.runFeatureTests();
      if (res.body.success && res.body.data) {
        setTests(res.body.data.results);
        setSummary({
          total: res.body.data.total,
          passed: res.body.data.passed,
          failed: res.body.data.failed,
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      executeTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FlaskConical className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold">Automated Feature Test Suite</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-emerald-400 border border-slate-700">
                  PHPUnit / Pest Spec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verifying all 6 mandatory assignment requirements & bonus security policies
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={executeTests}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running Tests...' : 'Re-run Tests'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Summary Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-slate-600">
              Total Tests: <strong className="text-slate-900">{summary?.total ?? tests.length}</strong>
            </span>
            <span className="font-medium text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Passed: {summary?.passed ?? 0}</span>
            </span>
            {summary && summary.failed > 0 && (
              <span className="font-medium text-rose-700 flex items-center space-x-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Failed: {summary.failed}</span>
              </span>
            )}
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            Command Line: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">npm test</code>
          </div>
        </div>

        {/* Test Items List */}
        <div className="p-6 space-y-3 overflow-y-auto max-h-[60vh]">
          {tests.map((test, index) => {
            const isPassed = test.status === 'passed';
            const isExpanded = expandedTestId === test.id;

            return (
              <div
                key={test.id}
                className={`rounded-xl border transition-all ${
                  isPassed
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div
                  onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{test.id}</span>
                        <h4 className="text-sm font-bold text-slate-900">{test.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{test.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">
                      HTTP {test.actualStatus || test.expectedStatus}
                    </span>
                    {test.durationMs && (
                      <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                        {test.durationMs}ms
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-200/60 bg-white/60 space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-600 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>{test.assertionMessage}</span>
                    </div>

                    {test.responsePreview && (
                      <div>
                        <div className="flex items-center space-x-1 text-slate-400 text-[11px] mb-1 font-mono">
                          <Code2 className="w-3 h-3" />
                          <span>Sanctum JSON Response:</span>
                        </div>
                        <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-snug">
                          {test.responsePreview}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Requirement: All 6 feature tests from Assignment Section 7 passing with 100% compliance.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Close Runner
          </button>
        </div>
      </div>
    </div>
  );
};
