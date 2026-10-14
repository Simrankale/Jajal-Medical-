import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiClient } from '../services/apiClient.ts';
import { 
  X, 
  Terminal, 
  Download, 
  Send, 
  Copy, 
  Check, 
  ShieldAlert, 
  Code2, 
  Clock,
  Layers
} from 'lucide-react';

interface ApiExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiEndpointDef {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  purpose: string;
  whoCanCall: string;
  defaultPayload?: any;
}

const ENDPOINTS: ApiEndpointDef[] = [
  {
    method: 'GET',
    path: '/api/cases?page=1&per_page=10&status=All',
    purpose: 'List cases (paginated, filtered)',
    whoCanCall: 'Admin, Engineer, Viewer',
  },
  {
    method: 'GET',
    path: '/api/cases/1',
    purpose: 'Get single case details',
    whoCanCall: 'Admin, Engineer, Viewer',
  },
  {
    method: 'POST',
    path: '/api/cases',
    purpose: 'Create new medical implant case',
    whoCanCall: 'Admin, Engineer',
    defaultPayload: {
      case_number: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
      patient_reference: 'PT-9941-SK',
      surgeon_name: 'Dr. Simran Sanket Kale',
      implant_type: 'Titanium Acetabular Cup 54mm',
      status: 'Planning',
      priority: 'High',
      surgery_date: '2026-11-20',
      hospital: 'St. Jude Regional Orthopedic Center',
      notes: 'Porous titanium plasma spray surface verified by Dr. Simran Sanket Kale.',
    },
  },
  {
    method: 'PUT',
    path: '/api/cases/1',
    purpose: 'Update an existing case',
    whoCanCall: 'Admin, Engineer',
    defaultPayload: {
      case_number: 'CASE-0001',
      patient_reference: 'PT-9812-SK',
      surgeon_name: 'Dr. Simran Sanket Kale',
      implant_type: 'Titanium Porous Acetabular Hip Cup 54mm',
      status: 'Approved',
      priority: 'High',
      surgery_date: '2026-10-24',
      hospital: 'St. Jude Regional Orthopedic Center',
      notes: 'Surgical trajectory verified with 3D anatomical planning template.',
    },
  },
  {
    method: 'DELETE',
    path: '/api/cases/1',
    purpose: 'Delete case (Admin only: Viewer gets 403)',
    whoCanCall: 'Admin only',
  },
  {
    method: 'GET',
    path: '/api/stats',
    purpose: 'Dashboard KPIs and priority statistics',
    whoCanCall: 'Admin, Engineer, Viewer',
  },
  {
    method: 'GET',
    path: '/api/holidays?country=US&year=2026',
    purpose: 'Bonus: Public holiday calendar from Nager.Date',
    whoCanCall: 'Anyone',
  },
  {
    method: 'POST',
    path: '/api/login',
    purpose: 'Authenticate & obtain Bearer token',
    whoCanCall: 'Anyone',
    defaultPayload: {
      email: 'simran.kale@jajalmedical.com',
      password: 'admin123',
    },
  },
];

export const ApiExplorerModal: React.FC<ApiExplorerModalProps> = ({ isOpen, onClose }) => {
  const { user, token } = useAuth();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointDef>(ENDPOINTS[0]);
  const [requestPath, setRequestPath] = useState<string>(ENDPOINTS[0].path);
  const [requestBody, setRequestBody] = useState<string>(
    ENDPOINTS[0].defaultPayload ? JSON.stringify(ENDPOINTS[0].defaultPayload, null, 2) : ''
  );
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectEndpoint = (ep: ApiEndpointDef) => {
    setSelectedEndpoint(ep);
    setRequestPath(ep.path);
    setRequestBody(ep.defaultPayload ? JSON.stringify(ep.defaultPayload, null, 2) : '');
    setResponseStatus(null);
    setResponseBody(null);
  };

  const executeRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseBody(null);

    try {
      let options: RequestInit = {
        method: selectedEndpoint.method,
      };

      if (['POST', 'PUT'].includes(selectedEndpoint.method) && requestBody) {
        options.body = requestBody;
      }

      const res = await apiClient.request(requestPath, options);
      setResponseStatus(res.status);
      setResponseBody(JSON.stringify(res.body, null, 2));
    } catch (err: any) {
      setResponseStatus(500);
      setResponseBody(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPostmanCollection = () => {
    const postmanJson = {
      info: {
        name: 'Jajal Medical Case Management API',
        _postman_id: 'jajal-medical-v1',
        description: 'Exported from Jajal Medical Case Management platform',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: ENDPOINTS.map((ep) => ({
        name: `${ep.method} ${ep.path.split('?')[0]} - ${ep.purpose}`,
        request: {
          method: ep.method,
          header: [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Authorization', value: 'Bearer {{token}}' },
          ],
          ...(ep.defaultPayload
            ? {
                body: {
                  mode: 'raw',
                  raw: JSON.stringify(ep.defaultPayload, null, 2),
                },
              }
            : {}),
          url: {
            raw: `{{baseUrl}}${ep.path}`,
          },
        },
      })),
      variable: [
        { key: 'baseUrl', value: window.location.origin },
        { key: 'token', value: token || 'sanctum_token_admin_demo_secret_2026' },
      ],
    };

    const blob = new Blob([JSON.stringify(postmanJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jajal_medical_postman_collection.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyAsCurl = () => {
    let curl = `curl -X ${selectedEndpoint.method} "${window.location.origin}${requestPath}" \\\n`;
    curl += `  -H "Accept: application/json" \\\n`;
    curl += `  -H "Content-Type: application/json"`;
    if (token) {
      curl += ` \\\n  -H "Authorization: Bearer ${token}"`;
    }
    if (['POST', 'PUT'].includes(selectedEndpoint.method) && requestBody) {
      curl += ` \\\n  -d '${requestBody.replace(/\n/g, '')}'`;
    }

    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'POST':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PUT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (st: number) => {
    if (st >= 200 && st < 300) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (st === 401 || st === 403) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    if (st === 422) return 'text-purple-400 border-purple-500/40 bg-purple-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Terminal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold">REST API & Postman Explorer</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-indigo-300 border border-slate-700">
                  Sanctum Bearer Token Auth
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive API tester for all assignment endpoints with live request/response inspection
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={downloadPostmanCollection}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Postman JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout: Endpoints Sidebar + Tester Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Endpoints List (Left column) */}
          <div className="md:col-span-5 border-r border-slate-200 bg-slate-50/70 p-4 space-y-2 overflow-y-auto max-h-[70vh]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-2">
              Assignment Endpoints
            </span>

            {ENDPOINTS.map((ep, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectEndpoint(ep)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                  selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method
                    ? 'bg-white border-teal-500 shadow-sm ring-1 ring-teal-500/20'
                    : 'bg-white/80 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${getMethodBadge(ep.method)}`}>
                    {ep.method}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{ep.whoCanCall}</span>
                </div>
                <div className="font-mono text-slate-800 font-semibold truncate text-[11px]">{ep.path}</div>
                <div className="text-slate-500 text-[11px] mt-0.5 truncate">{ep.purpose}</div>
              </div>
            ))}
          </div>

          {/* Request / Response Panel (Right column) */}
          <div className="md:col-span-7 p-6 flex flex-col space-y-4 overflow-y-auto max-h-[70vh] bg-white">
            {/* Request Bar */}
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1.5 rounded-lg font-mono font-bold text-xs border ${getMethodBadge(selectedEndpoint.method)}`}>
                {selectedEndpoint.method}
              </span>
              <input
                type="text"
                value={requestPath}
                onChange={(e) => setRequestPath(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden bg-slate-50 text-slate-800"
              />
              <button
                onClick={executeRequest}
                disabled={isLoading}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 flex items-center space-x-1.5 transition disabled:opacity-50 shadow-xs"
              >
                <Send className="w-3 h-3" />
                <span>{isLoading ? 'Sending...' : 'Send'}</span>
              </button>
            </div>

            {/* Auth token status banner */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-600">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400">Authenticated Persona:</span>
                <strong className="capitalize text-slate-800">{user?.role || 'Guest'}</strong>
              </div>
              <button
                onClick={copyAsCurl}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied cURL' : 'Copy cURL'}</span>
              </button>
            </div>

            {/* Request Body (for POST/PUT) */}
            {['POST', 'PUT'].includes(selectedEndpoint.method) && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  JSON Request Body
                </label>
                <textarea
                  rows={6}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden bg-slate-900 text-slate-100"
                />
              </div>
            )}

            {/* Response Section */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">Response</span>
                {responseStatus && (
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getStatusColor(responseStatus)}`}>
                    Status: {responseStatus}
                  </span>
                )}
              </div>

              <div className="flex-1 min-h-[140px] p-3.5 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                {isLoading ? (
                  <div className="text-slate-400 animate-pulse">Awaiting API response...</div>
                ) : responseBody ? (
                  <pre>{responseBody}</pre>
                ) : (
                  <div className="text-slate-500 italic">Click "Send" to trigger this API endpoint live.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
