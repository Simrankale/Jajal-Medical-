import { Router, Request, Response, NextFunction } from 'express';
import { db, StoredUser } from './db.ts';
import { CasePolicy } from './policy.ts';
import { CaseStatus, CasePriority, MedicalCase } from '../types/index.ts';

export const apiRouter = Router();

// Extend Request type to hold authenticated user
export interface AuthenticatedRequest extends Request {
  user?: StoredUser;
  token?: string;
}

// Authentication middleware mirroring Laravel Sanctum Bearer tokens
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthenticated. Bearer token required.',
    });
  }

  const token = authHeader.substring(7).trim();
  const user = db.findUserByToken(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthenticated or invalid token.',
    });
  }

  req.user = user;
  req.token = token;
  next();
}

// Validation helper for Form Request classes
const ALLOWED_STATUSES: CaseStatus[] = ['Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled'];
const ALLOWED_PRIORITIES: CasePriority[] = ['Low', 'Medium', 'High'];

function validateCaseInput(data: any, existingCaseId?: number): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};

  // Case Number: Required, unique
  if (!data.case_number || typeof data.case_number !== 'string' || !data.case_number.trim()) {
    errors.case_number = ['The Case Number field is required.'];
  } else {
    const trimmed = data.case_number.trim();
    // Unique check (ignoring current case on update)
    const existing = db.findCaseByNumber(trimmed);
    if (existing && (!existingCaseId || existing.id !== existingCaseId)) {
      errors.case_number = [`The Case Number '${trimmed}' has already been taken.`];
    }
  }

  // Patient Reference: Required
  if (!data.patient_reference || typeof data.patient_reference !== 'string' || !data.patient_reference.trim()) {
    errors.patient_reference = ['The Patient Reference field is required (e.g. PT-1001).'];
  }

  // Surgeon Name: Required
  if (!data.surgeon_name || typeof data.surgeon_name !== 'string' || !data.surgeon_name.trim()) {
    errors.surgeon_name = ['The Surgeon Name field is required.'];
  }

  // Implant Type: Required
  if (!data.implant_type || typeof data.implant_type !== 'string' || !data.implant_type.trim()) {
    errors.implant_type = ['The Implant Type field is required.'];
  }

  // Status: Required, one of the list
  if (!data.status || !ALLOWED_STATUSES.includes(data.status)) {
    errors.status = [`The selected status is invalid. Allowed: ${ALLOWED_STATUSES.join(', ')}`];
  }

  // Priority: Required, one of the list
  if (!data.priority || !ALLOWED_PRIORITIES.includes(data.priority)) {
    errors.priority = [`The selected priority is invalid. Allowed: ${ALLOWED_PRIORITIES.join(', ')}`];
  }

  // Surgery Date: Optional, valid date format (YYYY-MM-DD)
  if (data.surgery_date) {
    const dateStr = String(data.surgery_date).trim();
    const timestamp = Date.parse(dateStr);
    if (isNaN(timestamp)) {
      errors.surgery_date = ['The surgery date is not a valid date format (expected YYYY-MM-DD).'];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------

// POST /api/login: Get an API token (Anyone)
apiRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(422).json({
      success: false,
      message: 'The given data was invalid.',
      errors: {
        ...(!email ? { email: ['The email field is required.'] } : {}),
        ...(!password ? { password: ['The password field is required.'] } : {}),
      },
    });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(422).json({
      success: false,
      message: 'These credentials do not match our records.',
      errors: {
        email: ['These credentials do not match our records.'],
      },
    });
  }

  // Generate Sanctum-style API token
  const token = `sanctum_token_${user.role}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  db.addApiToken(user.id, token);

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    },
    message: 'User authenticated successfully.',
  });
});

// POST /api/logout: Revoke the token (Logged-in users)
apiRouter.post('/logout', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (req.user && req.token) {
    db.removeApiToken(req.user.id, req.token);
  }

  return res.status(200).json({
    success: true,
    data: null,
    message: 'Token revoked successfully. You have been logged out.',
  });
});

// GET /api/user: Current user info
apiRouter.get('/user', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    data: {
      id: req.user!.id,
      name: req.user!.name,
      email: req.user!.email,
      role: req.user!.role,
    },
    message: 'Current user profile retrieved.',
  });
});

// -------------------------------------------------------------
// DASHBOARD STATS
// -------------------------------------------------------------

apiRouter.get('/stats', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!CasePolicy.canViewAny(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. You do not have permission to view stats.',
    });
  }

  const stats = db.getStats();
  return res.status(200).json({
    success: true,
    data: stats,
    message: 'Dashboard metrics retrieved successfully.',
  });
});

// -------------------------------------------------------------
// CASE CRUD ENDPOINTS
// -------------------------------------------------------------

// GET /api/cases: List cases (paginated) (Admin, Viewer, Engineer)
apiRouter.get('/cases', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!CasePolicy.canViewAny(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. You do not have permission to view cases.',
    });
  }

  const page = parseInt(req.query.page as string, 10) || 1;
  const perPage = parseInt(req.query.per_page as string, 10) || 10;
  const search = (req.query.search as string) || '';
  const status = (req.query.status as string) || '';
  const priority = (req.query.priority as string) || '';
  const sortBy = (req.query.sortBy as string) || 'id';
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  const result = db.getCases({
    page,
    per_page: perPage,
    search,
    status,
    priority,
    sortBy,
    sortOrder,
  });

  return res.status(200).json({
    success: true,
    data: result,
    message: 'Cases retrieved successfully.',
  });
});

// POST /api/cases: Create a case (Admin, Engineer)
apiRouter.post('/cases', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!CasePolicy.canCreate(req.user)) {
    return res.status(403).json({
      success: false,
      message: 'This action is unauthorized. Only Admins and authorized roles can create cases.',
    });
  }

  // Form Request validation
  const validation = validateCaseInput(req.body);
  if (!validation.isValid) {
    return res.status(422).json({
      success: false,
      message: 'The given data was invalid.',
      errors: validation.errors,
    });
  }

  const newCase = db.createCase({
    case_number: req.body.case_number,
    patient_reference: req.body.patient_reference,
    surgeon_name: req.body.surgeon_name,
    implant_type: req.body.implant_type,
    status: req.body.status,
    priority: req.body.priority,
    surgery_date: req.body.surgery_date || null,
    created_by: req.user!.id,
    hospital: req.body.hospital,
    notes: req.body.notes,
  });

  return res.status(201).json({
    success: true,
    data: newCase,
    message: 'Medical case created successfully.',
  });
});

// GET /api/cases/:id: Get one case (Admin, Viewer, Engineer)
apiRouter.get('/cases/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(404).json({
      success: false,
      message: 'Case not found.',
    });
  }

  const caseItem = db.findCaseById(id);
  if (!caseItem) {
    return res.status(404).json({
      success: false,
      message: 'Case not found.',
    });
  }

  if (!CasePolicy.canView(req.user, caseItem)) {
    return res.status(403).json({
      success: false,
      message: 'This action is unauthorized.',
    });
  }

  return res.status(200).json({
    success: true,
    data: caseItem,
    message: 'Case details retrieved successfully.',
  });
});

// PUT /api/cases/:id: Update a case (Admin, Engineer)
apiRouter.put('/cases/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(404).json({
      success: false,
      message: 'Case not found.',
    });
  }

  const caseItem = db.findCaseById(id);
  if (!caseItem) {
    return res.status(404).json({
      success: false,
      message: 'Case not found.',
    });
  }

  if (!CasePolicy.canUpdate(req.user, caseItem)) {
    return res.status(403).json({
      success: false,
      message: 'This action is unauthorized. Only Admins and Engineers can edit cases.',
    });
  }

  // Form Request validation (ignoring current case for unique case_number)
  const validation = validateCaseInput(req.body, id);
  if (!validation.isValid) {
    return res.status(422).json({
      success: false,
      message: 'The given data was invalid.',
      errors: validation.errors,
    });
  }

  const updated = db.updateCase(id, {
    case_number: req.body.case_number.trim(),
    patient_reference: req.body.patient_reference.trim(),
    surgeon_name: req.body.surgeon_name.trim(),
    implant_type: req.body.implant_type.trim(),
    status: req.body.status,
    priority: req.body.priority,
    surgery_date: req.body.surgery_date || null,
    hospital: req.body.hospital,
    notes: req.body.notes,
  });

  return res.status(200).json({
    success: true,
    data: updated,
    message: 'Medical case updated successfully.',
  });
});

// DELETE /api/cases/:id: Delete a case (Admin only!)
// Page 2 specification: "Delete must work for Admin only. Hiding the button is not enough: the server must also block a Viewer who tries to delete."
apiRouter.delete('/cases/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(404).json({
      success: false,
      message: 'Case not found.',
    });
  }

  const caseItem = db.findCaseById(id);
  if (!caseItem) {
    return res.status(404).json({
      success: false,
      message: 'Case not found.',
    });
  }

  if (!CasePolicy.canDelete(req.user, caseItem)) {
    return res.status(403).json({
      success: false,
      message: 'This action is unauthorized. Only users with the Admin role can delete cases.',
    });
  }

  const deleted = db.deleteCase(id);
  if (!deleted) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete case.',
    });
  }

  return res.status(200).json({
    success: true,
    data: null,
    message: `Case ${caseItem.case_number} deleted successfully.`,
  });
});

// -------------------------------------------------------------
// BONUS: PUBLIC HOLIDAYS API (Nager.Date with timeout & fallback)
// Page 5 bonus task: "Call one public API with Laravel's HTTP client — for example, show today's public holidays from Nager.Date next to the Surgery Date field. Keep the URL in .env, set a timeout and handle failures gracefully."
// -------------------------------------------------------------

apiRouter.get('/holidays', async (req: Request, res: Response) => {
  const country = (req.query.country as string) || 'US';
  const year = req.query.year || new Date().getFullYear();
  const url = process.env.PUBLIC_HOLIDAYS_API_URL || `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

    const fetchRes = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!fetchRes.ok) {
      throw new Error(`API responded with status: ${fetchRes.status}`);
    }

    const holidays = await fetchRes.json();
    return res.status(200).json({
      success: true,
      data: holidays,
      message: 'Public holidays retrieved successfully from Nager.Date.',
    });
  } catch (err: any) {
    // Graceful fallback for offline / rate limits / timeouts
    const fallbackHolidays = [
      { date: `${year}-01-01`, localName: "New Year's Day", name: "New Year's Day", countryCode: country },
      { date: `${year}-05-25`, localName: "Memorial Day", name: "Memorial Day", countryCode: country },
      { date: `${year}-07-04`, localName: "Independence Day", name: "Independence Day", countryCode: country },
      { date: `${year}-09-07`, localName: "Labor Day", name: "Labor Day", countryCode: country },
      { date: `${year}-11-26`, localName: "Thanksgiving Day", name: "Thanksgiving Day", countryCode: country },
      { date: `${year}-12-25`, localName: "Christmas Day", name: "Christmas Day", countryCode: country },
    ];

    return res.status(200).json({
      success: true,
      data: fallbackHolidays,
      message: `Public holidays retrieved (cached fallback due to ${err.message || 'network timeout'}).`,
    });
  }
});

// -------------------------------------------------------------
// TEST RUNNER ENDPOINT (Runs 6+ feature tests programmatically)
// -------------------------------------------------------------
import { runFeatureTests } from './tests.ts';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

apiRouter.post('/tests/run', async (_req: Request, res: Response) => {
  try {
    const results = await runFeatureTests();
    const passedCount = results.filter((r) => r.status === 'passed').length;
    return res.status(200).json({
      success: true,
      data: {
        total: results.length,
        passed: passedCount,
        failed: results.length - passedCount,
        results,
      },
      message: `Executed ${results.length} feature tests. ${passedCount} passed.`,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// -------------------------------------------------------------
// GITHUB INTEGRATION & ARCHIVE DOWNLOAD
// -------------------------------------------------------------

// GET /api/download/archive - Download project tarball
apiRouter.get('/download/archive', async (_req: Request, res: Response) => {
  const archivePath = '/tmp/jajal-medical-case-management.tar.gz';
  try {
    await execAsync(`tar -czf ${archivePath} --exclude=node_modules --exclude=.env .`);
    res.setHeader('Content-Disposition', 'attachment; filename="jajal-medical-case-management.tar.gz"');
    res.setHeader('Content-Type', 'application/gzip');
    const readStream = fs.createReadStream(archivePath);
    readStream.pipe(res);
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to generate archive: ' + err.message });
  }
});

// POST /api/github/push - Direct Git Push to GitHub
apiRouter.post('/github/push', async (req: Request, res: Response) => {
  const { username = 'Simrankale', repo = 'jajal-medical-case-management', token } = req.body || {};

  if (!token || typeof token !== 'string' || !token.trim()) {
    return res.status(422).json({
      success: false,
      message: 'GitHub Personal Access Token (PAT) is required to authenticate push to https://github.com/' + username,
      errors: { token: ['A personal access token with "repo" scope is required.'] },
    });
  }

  const cleanUser = username.trim();
  const cleanRepo = repo.trim().replace(/^\//, '');
  const cleanToken = token.trim();

  try {
    // 1. Stage and commit any outstanding changes
    await execAsync('git config user.name "Simran Sanket Kale" && git config user.email "simrankale0210@gmail.com"');
    await execAsync('git add . && git commit -m "Complete Jajal Medical assignment with CRUD, RBAC, tests, and documentation" || true');
    await execAsync('git branch -M main');

    // 2. Set authenticated remote origin
    const remoteUrl = `https://${cleanToken}@github.com/${cleanUser}/${cleanRepo}.git`;
    await execAsync('git remote remove origin 2>/dev/null || true');
    await execAsync(`git remote add origin ${remoteUrl}`);

    // 3. Push to main branch
    const { stdout, stderr } = await execAsync('git push -u origin main --force');

    // 4. Reset remote to public URL (remove token from stored git config for security)
    await execAsync(`git remote set-url origin https://github.com/${cleanUser}/${cleanRepo}.git`);

    const publicUrl = `https://github.com/${cleanUser}/${cleanRepo}`;
    return res.status(200).json({
      success: true,
      message: `Successfully pushed repository to ${publicUrl}!`,
      data: {
        repoUrl: publicUrl,
        output: stdout || stderr,
      },
    });
  } catch (err: any) {
    // Scrub token from error message if present
    const sanitizedError = (err.message || 'Git push failed').replace(cleanToken, '***TOKEN***');
    return res.status(500).json({
      success: false,
      message: sanitizedError,
      suggestion: 'Ensure the repository "' + cleanRepo + '" exists on your GitHub account (https://github.com/' + cleanUser + ') and your Personal Access Token has "repo" permissions.',
    });
  }
});


