import { StoredUser } from './db.ts';
import { MedicalCase } from '../types/index.ts';

/**
 * Authorization Policy mirroring Laravel's CasePolicy / Gates.
 * 
 * Rules defined in assignment:
 * - Admin: View (Yes), Create/Edit (Yes), Change Status (Yes), Delete (Yes)
 * - Viewer: View (Yes), Create/Edit (No), Change Status (No), Delete (No)
 * - Engineer (Bonus): View (Yes), Create/Edit (Yes), Change Status (Yes), Delete (No)
 */
export class CasePolicy {
  public static canViewAny(user?: StoredUser | null): boolean {
    if (!user) return false;
    return ['admin', 'viewer', 'engineer'].includes(user.role);
  }

  public static canView(user?: StoredUser | null, _caseItem?: MedicalCase): boolean {
    if (!user) return false;
    return ['admin', 'viewer', 'engineer'].includes(user.role);
  }

  public static canCreate(user?: StoredUser | null): boolean {
    if (!user) return false;
    return ['admin', 'engineer'].includes(user.role);
  }

  public static canUpdate(user?: StoredUser | null, _caseItem?: MedicalCase): boolean {
    if (!user) return false;
    return ['admin', 'engineer'].includes(user.role);
  }

  public static canChangeStatus(user?: StoredUser | null, _caseItem?: MedicalCase): boolean {
    if (!user) return false;
    return ['admin', 'engineer'].includes(user.role);
  }

  public static canDelete(user?: StoredUser | null, _caseItem?: MedicalCase): boolean {
    if (!user) return false;
    // Explicitly: Delete must work for Admin only.
    // Hiding the button is not enough: server must block Viewer and Engineer with 403.
    return user.role === 'admin';
  }
}
