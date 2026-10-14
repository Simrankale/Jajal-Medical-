import { MedicalCase, User, CaseStatus, CasePriority, DashboardStats } from '../types/index.ts';

// Dummy users as specified in assignment (Admin, Viewer, and bonus Engineer)
export interface StoredUser extends User {
  passwordHash: string; // Plain dummy match for demo purposes
  apiTokens: string[];
  aliases?: string[];
}

export const INITIAL_USERS: StoredUser[] = [
  {
    id: 1,
    name: 'Dr. Simran Sanket Kale (Chief Medical Admin)',
    email: 'simran.kale@jajalmedical.com',
    role: 'admin',
    passwordHash: 'admin123',
    apiTokens: ['token_admin_demo_secret_2026', 'token_simran_demo_2026'],
    aliases: ['admin@jajalmedical.com', 'simran@jajalmedical.com'],
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 2,
    name: 'Dr. Anjali Rathord (Clinical Reviewer)',
    email: 'anjali.rathord@jajalmedical.com',
    role: 'viewer',
    passwordHash: 'viewer123',
    apiTokens: ['token_viewer_demo_secret_2026', 'token_anjali_demo_2026'],
    aliases: ['viewer@jajalmedical.com', 'anjali@jajalmedical.com'],
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 3,
    name: 'Varun Rivanker (Lead Biomedical Engineer)',
    email: 'varun.rivanker@jajalmedical.com',
    role: 'engineer',
    passwordHash: 'engineer123',
    apiTokens: ['token_engineer_demo_secret_2026', 'token_varun_demo_2026'],
    aliases: ['engineer@jajalmedical.com', 'varun@jajalmedical.com'],
    createdAt: '2026-01-20T11:15:00Z',
  },
  {
    id: 4,
    name: 'Dr. Viraj Santosh Tamse (Chief Joint Arthroplasty Surgeon)',
    email: 'viraj.tamse@jajalmedical.com',
    role: 'admin',
    passwordHash: 'viraj123',
    apiTokens: ['token_viraj_demo_secret_2026'],
    aliases: ['viraj@jajalmedical.com'],
    createdAt: '2026-01-25T14:00:00Z',
  },
];

export const INITIAL_CASES: Omit<MedicalCase, 'creator'>[] = [
  {
    id: 1,
    case_number: 'CASE-0001',
    patient_reference: 'PT-9812-SK',
    surgeon_name: 'Dr. Simran Sanket Kale',
    implant_type: 'Titanium Porous Acetabular Hip Cup 54mm',
    status: 'Approved',
    priority: 'High',
    surgery_date: '2026-10-24',
    created_by: 1,
    created_at: '2026-10-01T09:15:00Z',
    updated_at: '2026-10-08T14:22:00Z',
    hospital: 'St. Jude Regional Orthopedic Center',
    notes: 'Custom 3D-printed trabecular titanium cup approved by Dr. Simran Sanket Kale for revision hip arthroplasty.',
  },
  {
    id: 2,
    case_number: 'CASE-0002',
    patient_reference: 'PT-4105-AR',
    surgeon_name: 'Dr. Anjali Rathord',
    implant_type: 'Cruciate-Retaining Total Knee Arthroplasty System',
    status: 'Planning',
    priority: 'Medium',
    surgery_date: '2026-11-02',
    created_by: 1,
    created_at: '2026-10-02T10:45:00Z',
    updated_at: '2026-10-05T11:00:00Z',
    hospital: 'Metro Health Surgical Pavilion',
    notes: 'Pre-op MRI and alignment kinematics planned by Dr. Anjali Rathord. Custom patient cutting guide scheduled.',
  },
  {
    id: 3,
    case_number: 'CASE-0003',
    patient_reference: 'ANON-7731-VR',
    surgeon_name: 'Varun Rivanker',
    implant_type: 'Thoracolumbar Pedicle Screw Fixation 6.5mm System',
    status: 'In Review',
    priority: 'High',
    surgery_date: '2026-10-28',
    created_by: 3,
    created_at: '2026-10-03T08:20:00Z',
    updated_at: '2026-10-09T16:30:00Z',
    hospital: 'Apex Neurological & Spine Institute',
    notes: 'T10-L2 stabilization construct designed by Biomedical Engineer Varun Rivanker.',
  },
  {
    id: 4,
    case_number: 'CASE-0004',
    patient_reference: 'PT-3329-VT',
    surgeon_name: 'Dr. Viraj Santosh Tamse',
    implant_type: 'Patient-Specific PEEK Craniofacial Mesh Prosthesis',
    status: 'Completed',
    priority: 'Medium',
    surgery_date: '2026-09-18',
    created_by: 4,
    created_at: '2026-09-01T14:00:00Z',
    updated_at: '2026-09-19T10:15:00Z',
    hospital: 'University Memorial Surgical Hospital',
    notes: 'Post-trauma cranial vault reconstruction successfully completed by Dr. Viraj Santosh Tamse.',
  },
  {
    id: 5,
    case_number: 'CASE-0005',
    patient_reference: 'REF-6502-SK',
    surgeon_name: 'Dr. Simran Sanket Kale',
    implant_type: 'Reverse Shoulder Glenoid Baseplate System 36mm',
    status: 'Draft',
    priority: 'Low',
    surgery_date: '2026-11-15',
    created_by: 1,
    created_at: '2026-10-04T12:00:00Z',
    updated_at: '2026-10-04T12:00:00Z',
    hospital: 'Mercy Orthopedic Institute',
    notes: 'Awaiting glenoid bone stock CT density verification.',
  },
  {
    id: 6,
    case_number: 'CASE-0006',
    patient_reference: 'PT-1184-AR',
    surgeon_name: 'Dr. Anjali Rathord',
    implant_type: 'Mandibular Reconstruction Titanium Plate 2.4mm',
    status: 'Approved',
    priority: 'High',
    surgery_date: '2026-10-21',
    created_by: 1,
    created_at: '2026-10-04T15:30:00Z',
    updated_at: '2026-10-10T09:40:00Z',
    hospital: 'Maxillofacial & Facial Trauma Specialty Center',
    notes: 'Pre-bent anatomic contour plate verified and certified by Dr. Anjali Rathord.',
  },
  {
    id: 7,
    case_number: 'CASE-0007',
    patient_reference: 'ANON-2091-VR',
    surgeon_name: 'Varun Rivanker',
    implant_type: 'Modular Bipolar Femoral Head 28mm Component',
    status: 'Planning',
    priority: 'Medium',
    surgery_date: '2026-11-08',
    created_by: 3,
    created_at: '2026-10-05T09:10:00Z',
    updated_at: '2026-10-07T14:20:00Z',
    hospital: 'St. Jude Regional Orthopedic Center',
    notes: 'Femoral canal rasping instruments modeled and packaged by Varun Rivanker.',
  },
  {
    id: 8,
    case_number: 'CASE-0008',
    patient_reference: 'PT-8802-VT',
    surgeon_name: 'Dr. Viraj Santosh Tamse',
    implant_type: 'Cervical Interbody Fusion PEEK Cage (Anterior)',
    status: 'In Review',
    priority: 'High',
    surgery_date: '2026-10-30',
    created_by: 4,
    created_at: '2026-10-05T16:00:00Z',
    updated_at: '2026-10-11T13:10:00Z',
    hospital: 'Apex Neurological & Spine Institute',
    notes: 'C5-C6 degenerative disc restoration. Lordotic angle 7 degrees confirmed.',
  },
  {
    id: 9,
    case_number: 'CASE-0009',
    patient_reference: 'REF-3341-SK',
    surgeon_name: 'Dr. Simran Sanket Kale',
    implant_type: 'Unicompartmental Fixed Bearing Knee System',
    status: 'Completed',
    priority: 'Low',
    surgery_date: '2026-09-29',
    created_by: 1,
    created_at: '2026-09-10T11:25:00Z',
    updated_at: '2026-09-30T17:00:00Z',
    hospital: 'Metro Health Surgical Pavilion',
    notes: 'Medial compartment osteoarthritis. Implant verified post-op by Dr. Simran Sanket Kale.',
  },
  {
    id: 10,
    case_number: 'CASE-0010',
    patient_reference: 'PT-5421-AR',
    surgeon_name: 'Dr. Anjali Rathord',
    implant_type: 'Total Ankle Arthroplasty Modular Talus Component',
    status: 'Cancelled',
    priority: 'Low',
    surgery_date: null,
    created_by: 1,
    created_at: '2026-09-15T13:40:00Z',
    updated_at: '2026-10-02T10:00:00Z',
    hospital: 'Coastline Orthopedic Clinic',
    notes: 'Patient elected non-surgical regenerative rehabilitation pathway.',
  },
  {
    id: 11,
    case_number: 'CASE-0011',
    patient_reference: 'PT-9014-VR',
    surgeon_name: 'Varun Rivanker',
    implant_type: 'Cementless Hydroxyapatite Coated Stem Size #4',
    status: 'Approved',
    priority: 'High',
    surgery_date: '2026-10-25',
    created_by: 3,
    created_at: '2026-10-06T10:00:00Z',
    updated_at: '2026-10-12T08:50:00Z',
    hospital: 'St. Jude Regional Orthopedic Center',
    notes: 'Gamma sterilization certification verified by biomedical engineer Varun Rivanker.',
  },
  {
    id: 12,
    case_number: 'CASE-0012',
    patient_reference: 'REF-1190-VT',
    surgeon_name: 'Dr. Viraj Santosh Tamse',
    implant_type: 'Semi-Constrained Radial Head Prosthesis 18mm',
    status: 'Planning',
    priority: 'Medium',
    surgery_date: '2026-11-12',
    created_by: 4,
    created_at: '2026-10-07T08:45:00Z',
    updated_at: '2026-10-08T11:20:00Z',
    hospital: 'Mercy Orthopedic Institute',
    notes: 'Mason type III radial head comminuted fracture restoration plan.',
  },
  {
    id: 13,
    case_number: 'CASE-0013',
    patient_reference: 'PT-6617-SK',
    surgeon_name: 'Dr. Simran Sanket Kale',
    implant_type: 'Expandable Vertebral Body Replacement Titanium Cage',
    status: 'In Review',
    priority: 'High',
    surgery_date: '2026-10-29',
    created_by: 1,
    created_at: '2026-10-07T14:15:00Z',
    updated_at: '2026-10-11T15:30:00Z',
    hospital: 'Apex Neurological & Spine Institute',
    notes: 'Pathological compression fracture stabilization construct.',
  },
  {
    id: 14,
    case_number: 'CASE-0014',
    patient_reference: 'ANON-8820-AR',
    surgeon_name: 'Dr. Anjali Rathord',
    implant_type: 'Posterior Stabilized Knee Tibial Baseplate #5',
    status: 'Approved',
    priority: 'Medium',
    surgery_date: '2026-11-04',
    created_by: 1,
    created_at: '2026-10-08T09:30:00Z',
    updated_at: '2026-10-12T16:00:00Z',
    hospital: 'Metro Health Surgical Pavilion',
    notes: 'Cross-linked polyethylene tibial insert thickness 12mm confirmed by Dr. Anjali Rathord.',
  },
  {
    id: 15,
    case_number: 'CASE-0015',
    patient_reference: 'PT-3498-VR',
    surgeon_name: 'Varun Rivanker',
    implant_type: 'Distal Radius Volar Anatomical Locking Plate 2.5mm',
    status: 'Completed',
    priority: 'Low',
    surgery_date: '2026-09-22',
    created_by: 3,
    created_at: '2026-09-12T10:00:00Z',
    updated_at: '2026-09-23T11:00:00Z',
    hospital: 'Maxillofacial & Trauma Center',
    notes: 'Manufactured and calibrated with 6 distal locking screws by Varun Rivanker.',
  },
  {
    id: 16,
    case_number: 'CASE-0016',
    patient_reference: 'PT-7213-VT',
    surgeon_name: 'Dr. Viraj Santosh Tamse',
    implant_type: 'Dual Mobility Anti-Dislocation Acetabular System 50mm',
    status: 'Planning',
    priority: 'High',
    surgery_date: '2026-11-10',
    created_by: 4,
    created_at: '2026-10-09T11:00:00Z',
    updated_at: '2026-10-09T11:00:00Z',
    hospital: 'St. Jude Regional Orthopedic Center',
    notes: 'High dislocation risk patient profile managed by Dr. Viraj Santosh Tamse.',
  },
  {
    id: 17,
    case_number: 'CASE-0017',
    patient_reference: 'REF-4491-SK',
    surgeon_name: 'Dr. Simran Sanket Kale',
    implant_type: 'Custom Orbital Floor Titanium Micro-Scaffold',
    status: 'Draft',
    priority: 'Medium',
    surgery_date: null,
    created_by: 1,
    created_at: '2026-10-10T14:30:00Z',
    updated_at: '2026-10-10T14:30:00Z',
    hospital: 'University Memorial Surgical Hospital',
    notes: '3D stereolithography model requested for intraoperative contour trial.',
  },
  {
    id: 18,
    case_number: 'CASE-0018',
    patient_reference: 'PT-8941-AR',
    surgeon_name: 'Dr. Anjali Rathord',
    implant_type: 'Revision Knee Augmentation Wedges & Stem Extender',
    status: 'In Review',
    priority: 'High',
    surgery_date: '2026-10-31',
    created_by: 1,
    created_at: '2026-10-10T16:45:00Z',
    updated_at: '2026-10-12T10:15:00Z',
    hospital: 'Metro Health Surgical Pavilion',
    notes: 'Bone stock loss evaluation required prior to final wedge sizing.',
  },
  {
    id: 19,
    case_number: 'CASE-0019',
    patient_reference: 'ANON-5012-VR',
    surgeon_name: 'Varun Rivanker',
    implant_type: 'Percutaneous Sacroiliac Joint Fusion Implants (3-pack)',
    status: 'Approved',
    priority: 'Low',
    surgery_date: '2026-11-06',
    created_by: 3,
    created_at: '2026-10-11T09:00:00Z',
    updated_at: '2026-10-12T12:00:00Z',
    hospital: 'Apex Neurological & Spine Institute',
    notes: 'Minimally invasive triangular titanium implant set designed by Varun Rivanker.',
  },
  {
    id: 20,
    case_number: 'CASE-0020',
    patient_reference: 'PT-2284-VT',
    surgeon_name: 'Dr. Viraj Santosh Tamse',
    implant_type: 'Direct Anterior Minimal-Incision Hip Broach Stem',
    status: 'Planning',
    priority: 'Medium',
    surgery_date: '2026-11-18',
    created_by: 4,
    created_at: '2026-10-11T13:20:00Z',
    updated_at: '2026-10-11T13:20:00Z',
    hospital: 'St. Jude Regional Orthopedic Center',
    notes: 'Standard 135-degree femoral neck offset selected by Dr. Viraj Santosh Tamse.',
  },
  {
    id: 21,
    case_number: 'CASE-0021',
    patient_reference: 'PT-6029-SK',
    surgeon_name: 'Dr. Simran Sanket Kale',
    implant_type: 'Anatomic Shoulder Humeral Head Component 48x16',
    status: 'Completed',
    priority: 'Medium',
    surgery_date: '2026-09-25',
    created_by: 1,
    created_at: '2026-09-14T08:30:00Z',
    updated_at: '2026-09-26T09:00:00Z',
    hospital: 'Mercy Orthopedic Institute',
    notes: 'Eccentric taper neck adapter implanted with excellent glenohumeral stability.',
  },
  {
    id: 22,
    case_number: 'CASE-0022',
    patient_reference: 'REF-7893-AR',
    surgeon_name: 'Dr. Anjali Rathord',
    implant_type: 'First MTP Joint Hemi-Arthroplasty Cobalt Chrome Implant',
    status: 'Draft',
    priority: 'Low',
    surgery_date: null,
    created_by: 1,
    created_at: '2026-10-12T11:00:00Z',
    updated_at: '2026-10-12T11:00:00Z',
    hospital: 'Coastline Orthopedic Clinic',
    notes: 'Pre-op gait analysis reviewed by Dr. Anjali Rathord.',
  },
  {
    id: 23,
    case_number: 'CASE-0023',
    patient_reference: 'PT-1992-VR',
    surgeon_name: 'Varun Rivanker',
    implant_type: 'Custom Mandibular Condyle Articulating Titanium Plate',
    status: 'In Review',
    priority: 'High',
    surgery_date: '2026-11-01',
    created_by: 3,
    created_at: '2026-10-12T14:10:00Z',
    updated_at: '2026-10-13T10:00:00Z',
    hospital: 'University Memorial Surgical Hospital',
    notes: 'High-wear biocompatible cobalt-chromium articulating head verified by Varun Rivanker.',
  },
  {
    id: 24,
    case_number: 'CASE-0024',
    patient_reference: 'ANON-9182-VT',
    surgeon_name: 'Dr. Viraj Santosh Tamse',
    implant_type: 'High-Flexion Cemented Knee Femoral Component Size #4',
    status: 'Planning',
    priority: 'Medium',
    surgery_date: '2026-11-20',
    created_by: 4,
    created_at: '2026-10-13T09:00:00Z',
    updated_at: '2026-10-13T09:00:00Z',
    hospital: 'Metro Health Surgical Pavilion',
    notes: 'Left lateral knee variant with 155-degree deep flexion kinematics planned by Dr. Viraj Santosh Tamse.',
  },
];

class Database {
  private users: StoredUser[] = [];
  private cases: MedicalCase[] = [];
  private nextCaseId: number = 25;

  constructor() {
    this.reset();
  }

  public reset() {
    // Deep clone initial data
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    const rawCases: Omit<MedicalCase, 'creator'>[] = JSON.parse(JSON.stringify(INITIAL_CASES));
    
    this.cases = rawCases.map(c => {
      const creatorUser = this.users.find(u => u.id === c.created_by);
      return {
        ...c,
        creator: creatorUser ? {
          id: creatorUser.id,
          name: creatorUser.name,
          email: creatorUser.email,
          role: creatorUser.role,
        } : undefined,
      };
    });
    this.nextCaseId = Math.max(...this.cases.map(c => c.id), 0) + 1;
  }

  // User queries
  public findUserByEmail(email: string): StoredUser | undefined {
    const cleanEmail = email.trim().toLowerCase();
    return this.users.find(u => 
      u.email.toLowerCase() === cleanEmail || 
      (u.aliases && u.aliases.some(a => a.toLowerCase() === cleanEmail))
    );
  }

  public findUserById(id: number): StoredUser | undefined {
    return this.users.find(u => u.id === id);
  }

  public findUserByToken(token: string): StoredUser | undefined {
    return this.users.find(u => u.apiTokens.includes(token));
  }

  public addApiToken(userId: number, token: string): void {
    const user = this.findUserById(userId);
    if (user && !user.apiTokens.includes(token)) {
      user.apiTokens.push(token);
    }
  }

  public removeApiToken(userId: number, token: string): void {
    const user = this.findUserById(userId);
    if (user) {
      user.apiTokens = user.apiTokens.filter(t => t !== token);
    }
  }

  // Case queries
  public getCases(params: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const perPage = Math.max(1, Number(params.per_page) || 10);
    const search = (params.search || '').trim().toLowerCase();
    const status = params.status;
    const priority = params.priority;
    const sortBy = params.sortBy || 'id';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';

    let filtered = [...this.cases];

    // Filter by search (Case Number or Surgeon Name)
    if (search) {
      filtered = filtered.filter(c => 
        c.case_number.toLowerCase().includes(search) || 
        c.surgeon_name.toLowerCase().includes(search) ||
        c.patient_reference.toLowerCase().includes(search) ||
        c.implant_type.toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (status && status !== 'All') {
      filtered = filtered.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by priority (Bonus task)
    if (priority && priority !== 'All') {
      filtered = filtered.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
    }

    // Sort
    filtered.sort((a, b) => {
      let valA: any = (a as any)[sortBy];
      let valB: any = (b as any)[sortBy];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB);
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    const startIndex = (page - 1) * perPage;
    const paginated = filtered.slice(startIndex, startIndex + perPage);

    return {
      cases: paginated,
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
    };
  }

  public findCaseById(id: number): MedicalCase | undefined {
    return this.cases.find(c => c.id === id);
  }

  public findCaseByNumber(caseNumber: string): MedicalCase | undefined {
    return this.cases.find(c => c.case_number.trim().toLowerCase() === caseNumber.trim().toLowerCase());
  }

  public createCase(data: {
    case_number: string;
    patient_reference: string;
    surgeon_name: string;
    implant_type: string;
    status: CaseStatus;
    priority: CasePriority;
    surgery_date?: string | null;
    created_by: number;
    hospital?: string;
    notes?: string;
  }): MedicalCase {
    const creatorUser = this.findUserById(data.created_by);
    const now = new Date().toISOString();
    
    const newCase: MedicalCase = {
      id: this.nextCaseId++,
      case_number: data.case_number.trim(),
      patient_reference: data.patient_reference.trim(),
      surgeon_name: data.surgeon_name.trim(),
      implant_type: data.implant_type.trim(),
      status: data.status,
      priority: data.priority,
      surgery_date: data.surgery_date || null,
      created_by: data.created_by,
      creator: creatorUser ? {
        id: creatorUser.id,
        name: creatorUser.name,
        email: creatorUser.email,
        role: creatorUser.role,
      } : undefined,
      created_at: now,
      updated_at: now,
      hospital: data.hospital || 'General Hospital',
      notes: data.notes || '',
    };

    this.cases.unshift(newCase);
    return newCase;
  }

  public updateCase(id: number, data: Partial<MedicalCase>): MedicalCase | undefined {
    const index = this.cases.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    const existing = this.cases[index];
    const updated: MedicalCase = {
      ...existing,
      ...data,
      id: existing.id, // Immutable
      created_by: existing.created_by, // Immutable
      creator: existing.creator,
      created_at: existing.created_at, // Immutable
      updated_at: new Date().toISOString(),
    };

    this.cases[index] = updated;
    return updated;
  }

  public deleteCase(id: number): boolean {
    const index = this.cases.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.cases.splice(index, 1);
    return true;
  }

  public getStats(): DashboardStats {
    const total = this.cases.length;
    let draft = 0;
    let planning = 0;
    let in_review = 0;
    let approved = 0;
    let completed = 0;
    let cancelled = 0;
    let low = 0;
    let medium = 0;
    let high = 0;

    for (const c of this.cases) {
      switch (c.status) {
        case 'Draft': draft++; break;
        case 'Planning': planning++; break;
        case 'In Review': in_review++; break;
        case 'Approved': approved++; break;
        case 'Completed': completed++; break;
        case 'Cancelled': cancelled++; break;
      }

      switch (c.priority) {
        case 'Low': low++; break;
        case 'Medium': medium++; break;
        case 'High': high++; break;
      }
    }

    return {
      total,
      draft,
      planning,
      in_review,
      approved,
      completed,
      cancelled,
      priority_counts: { low, medium, high },
    };
  }
}

export const db = new Database();
