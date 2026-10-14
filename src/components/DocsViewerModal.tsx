import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Database, 
  FileCheck2, 
  Cloud, 
  Copy, 
  Check,
  ExternalLink
} from 'lucide-react';

interface DocsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsViewerModal: React.FC<DocsViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeDoc, setActiveDoc] = useState<'readme' | 'database' | 'traceability' | 'deployment'>('readme');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Assignment Documentation & Architecture</h3>
              <p className="text-xs text-slate-400">
                Official documentation required by Jajal Medical Software Developer Practical Assignment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex items-center space-x-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveDoc('readme')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
              activeDoc === 'readme'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>README.md</span>
          </button>

          <button
            onClick={() => setActiveDoc('database')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
              activeDoc === 'database'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>docs/database.md (ERD)</span>
          </button>

          <button
            onClick={() => setActiveDoc('traceability')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
              activeDoc === 'traceability'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>docs/traceability.md (RTM)</span>
          </button>

          <button
            onClick={() => setActiveDoc('deployment')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
              activeDoc === 'deployment'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>docs/deployment.md (AWS)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] text-sm text-slate-800 leading-relaxed space-y-6">
          {activeDoc === 'readme' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Jajal Medical Case Management Web App</h2>
                <p className="text-xs text-slate-500">Medical implant case tracking platform from draft to completion.</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider text-teal-700">
                  Dummy Login Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-xs text-slate-900 block truncate">Dr. Simran Sanket Kale</span>
                    <span className="text-[11px] text-teal-700 font-semibold block">Admin</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 truncate">simran.kale@jajalmedical.com</span>
                    <span className="text-xs font-mono text-slate-800 block">admin123</span>
                    <span className="text-[10px] text-teal-600 font-medium block mt-1">Full CRUD + Delete</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-xs text-slate-900 block truncate">Dr. Anjali Rathord</span>
                    <span className="text-[11px] text-blue-700 font-semibold block">Viewer</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 truncate">anjali.rathord@jajalmedical.com</span>
                    <span className="text-xs font-mono text-slate-800 block">viewer123</span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-1">Read only (Delete 403)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-xs text-slate-900 block truncate">Varun Rivanker</span>
                    <span className="text-[11px] text-purple-700 font-semibold block">Engineer</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 truncate">varun.rivanker@jajalmedical.com</span>
                    <span className="text-xs font-mono text-slate-800 block">engineer123</span>
                    <span className="text-[10px] text-purple-600 font-medium block mt-1">Create/Edit (Delete 403)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-xs text-slate-900 block truncate">Dr. Viraj Santosh Tamse</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">Chief Arthroplasty</span>
                    <span className="text-[11px] text-slate-600 block mt-0.5 truncate">viraj.tamse@jajalmedical.com</span>
                    <span className="text-xs font-mono text-slate-800 block">viraj123</span>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-1">Joint Replacement Lead</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider text-teal-700">
                  Setup Steps
                </h3>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
{`# 1. Clone & install
git clone https://github.com/jajal-medical/case-management.git
cd case-management && npm install

# 2. Configure environment
cp .env.example .env

# 3. Start development server
npm run dev

# 4. Run automated feature tests
npm test`}
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider text-teal-700">
                  Automated Tests Covered
                </h3>
                <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                  <li><strong>Test 1</strong>: Valid login succeeds with 200 OK and Bearer token</li>
                  <li><strong>Test 2</strong>: Invalid login is rejected with 422 Unprocessable Entity</li>
                  <li><strong>Test 3</strong>: Guest cannot open case pages or APIs (401 / redirect)</li>
                  <li><strong>Test 4</strong>: Admin can create a case (201 Created with auto-generated ID)</li>
                  <li><strong>Test 5</strong>: Creating a case with a duplicate Case Number fails (422)</li>
                  <li><strong>Test 6</strong>: Viewer cannot delete a case (403 Forbidden)</li>
                  <li><strong>Bonus Test 7</strong>: Engineer can create/edit cases but cannot delete (403 Forbidden)</li>
                </ul>
              </div>
            </div>
          )}

          {activeDoc === 'database' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Database Schema & Relational Model</h2>
                <p className="text-xs text-slate-500">MySQL schema, foreign keys, unique indexes, and seed records.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
{`USERS (Table)
  id               BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
  name             VARCHAR(255) NOT NULL
  email            VARCHAR(255) NOT NULL UNIQUE
  password         VARCHAR(255) NOT NULL
  role             ENUM('admin', 'viewer', 'engineer') DEFAULT 'viewer'
  created_at       TIMESTAMP
  updated_at       TIMESTAMP
       │
       │ 1-to-Many Relationship
       │ cases.created_by FOREIGN KEY REFERENCES users(id)
       ▼
CASES (Table)
  id               BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT
  case_number      VARCHAR(64) NOT NULL UNIQUE  <-- UNIQUE INDEX
  patient_reference VARCHAR(64) NOT NULL
  surgeon_name     VARCHAR(255) NOT NULL
  implant_type     VARCHAR(255) NOT NULL
  status           ENUM('Draft','Planning','In Review','Approved','Completed','Cancelled') <-- INDEX
  priority         ENUM('Low','Medium','High')
  surgery_date     DATE NULLABLE
  created_by       BIGINT UNSIGNED NOT NULL FOREIGN KEY
  hospital         VARCHAR(255) NULLABLE
  notes            TEXT NULLABLE
  created_at       TIMESTAMP
  updated_at       TIMESTAMP`}
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900 text-sm">Key Architectural Highlights:</h4>
                <p>• <strong>Index on case_number:</strong> Enforces unique constraint preventing duplicate case filings across concurrent surgical coordinators.</p>
                <p>• <strong>Index on status:</strong> Accelerates dashboard pipeline counts (`Approved`, `Planning`, `Completed`) and status filtering.</p>
                <p>• <strong>Foreign Key:</strong> Links each implant case to the authenticating user who created it for medical audit trails.</p>
              </div>
            </div>
          )}

          {activeDoc === 'traceability' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Medical Software Requirement Traceability Matrix (RTM)</h2>
                <p className="text-xs text-slate-500">IEC 62304 / ISO 13485 verification alignment linking input requirements to implementation and tests.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 divide-y divide-slate-200">
                  <thead className="bg-slate-50 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Requirement (Input)</th>
                      <th className="p-3">Implementation (Output)</th>
                      <th className="p-3">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-mono font-bold text-teal-700">REQ-001</td>
                      <td className="p-3 font-medium">Admin shall be able to create a case</td>
                      <td className="p-3 font-mono text-slate-600">CaseController@store + create form</td>
                      <td className="p-3 text-emerald-700 font-semibold">Feature test: admin creates case (TEST-004)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-teal-700">REQ-002</td>
                      <td className="p-3 font-medium">Case Number shall be unique</td>
                      <td className="p-3 font-mono text-slate-600">Unique DB index + Form Request rule</td>
                      <td className="p-3 text-emerald-700 font-semibold">Feature test: duplicate rejected (TEST-005)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-teal-700">REQ-003</td>
                      <td className="p-3 font-medium">Only Admin shall delete cases</td>
                      <td className="p-3 font-mono text-slate-600">CasePolicy@delete</td>
                      <td className="p-3 text-emerald-700 font-semibold">Feature test: viewer gets 403 (TEST-006)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-teal-700">REQ-004</td>
                      <td className="p-3 font-medium">Unauthenticated access prohibited</td>
                      <td className="p-3 font-mono text-slate-600">authMiddleware (Sanctum tokens)</td>
                      <td className="p-3 text-emerald-700 font-semibold">Feature test: guest gets 401 (TEST-003)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-teal-700">REQ-005</td>
                      <td className="p-3 font-medium">Engineer role permissions (Bonus)</td>
                      <td className="p-3 font-mono text-slate-600">CasePolicy role checks</td>
                      <td className="p-3 text-emerald-700 font-semibold">Feature test: engineer create ok, delete 403 (TEST-007)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-teal-700">REQ-006</td>
                      <td className="p-3 font-medium">Surgery date public holiday indicator</td>
                      <td className="p-3 font-mono text-slate-600">Nager.Date API client + 3s timeout</td>
                      <td className="p-3 text-emerald-700 font-semibold">Integration test + graceful fallback</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeDoc === 'deployment' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-xl font-bold text-slate-900">AWS Production Hosting Architecture</h2>
                <p className="text-xs text-slate-500">Comprehensive AWS design: EC2, RDS MySQL, S3, Security Groups, IAM, and HTTPS.</p>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
{`AWS Architecture:
Surgeons -> Route 53 (DNS) -> ACM (SSL/TLS 1.3)
         -> Application Load Balancer (ALB) [Public Subnet, port 443]
         -> Auto-Scaling Group EC2 (t4g.small) [Private Subnet, port 3000]
         -> AWS RDS MySQL 8.0 (Multi-AZ) [Isolated DB Subnet, port 3306]
         -> AWS S3 (KMS Encrypted) for DICOM / surgical attachments`}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Security Groups Matrix</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><code>alb-sg</code>: Inbound 443 from 0.0.0.0/0</li>
                    <li><code>ec2-sg</code>: Inbound 3000 restricted to <code>alb-sg</code></li>
                    <li><code>rds-sg</code>: Inbound 3306 restricted to <code>ec2-sg</code></li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Secrets & Encryption</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Database passwords stored in AWS Secrets Manager</li>
                    <li>S3 bucket encrypted with AWS KMS (HIPAA compliance)</li>
                    <li>HSTS and TLS 1.3 strictly enforced</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Source files located in <code>/README.md</code> and <code>/docs/*</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
