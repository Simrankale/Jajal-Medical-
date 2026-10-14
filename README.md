# Jajal Medical - Medical Case Management System

A production-grade Medical Case Management web application designed for tracking orthopedic and medical device implant cases from draft to completion. Built according to the **Jajal Medical Software Developer Practical Assignment** specification.

---

## 🏥 Project Overview & Scenario
A specialized medical device company tracks implant cases (hip cups, knee systems, cranial meshes, spinal fixation rods, mandibular plates) from initial planning to surgical completion. 

The application enforces strict **Role-Based Access Control (RBAC)**, database integrity, Form Request validation, API token authentication, and compliance traceability.

### 🌟 Implemented Core & Bonus Features
- **Authentication**: Bearer token API authentication (Laravel Sanctum equivalent), session persistence, and instant test switcher.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access — View cases, Create/Edit cases, Change status, Delete cases.
  - **Viewer**: Read-only — View cases and dashboard only. Actions hidden in UI and strictly blocked on server (403 Forbidden).
  - **Engineer (Bonus Role)**: View, Create, and Edit cases + update statuses, but cannot delete (403 Forbidden).
- **Interactive Dashboard**: Real-time metrics for Total Cases, Planning, In Review, Approved, Completed, Cancelled, priority distributions, and quick actions.
- **Case List & Explorer**:
  - Server-side pagination (10 per page).
  - Search by Case Number or Surgeon Name.
  - Filter by Status (Draft, Planning, In Review, Approved, Completed, Cancelled).
  - **Bonus**: Filter by Priority (Low, Medium, High).
  - **Bonus**: Column sorting (Case #, Surgeon, Status, Priority, Surgery Date, Created Date).
  - RBAC-aware action buttons (View, Edit, Delete).
- **Create / Edit Case Form**:
  - Single reusable component for both Create and Edit.
  - Field-by-field validation error displays.
  - Unique Case Number check (ignoring current ID during edits).
  - **Bonus**: Real-time public holiday checker via **Nager.Date API** next to the Surgery Date field with graceful timeout and fallback.
- **Case Details View**: Comprehensive audit view showing patient reference, implant specifications, creator details, timestamps, and status advancement controls.
- **Automated Feature Tests**: 7 automated feature tests (covering all 6 mandatory tests + bonus role test) executable directly in the UI or via CLI `npm test`.
- **API Explorer & Postman Collection**: In-app live REST API tester + downloadable Postman / Thunder Client collection export.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend / API**: Node.js & Express RESTful API with full Sanctum-compliant response structures & status codes
- **Database Layer**: In-memory relational database store with foreign key constraints, unique indexing, and 24 realistic seed implant cases
- **Testing**: Automated Feature Test Suite with live browser assertion engine and CLI runner (`npm test`)

---

## 🔑 Test Login Credentials (Dummy Data)

| User / Persona | Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Dr. Simran Sanket Kale** | **Admin** | `simran.kale@jajalmedical.com` *(or `admin@jajalmedical.com`)* | `admin123` | Full Access: View, Create, Edit, Delete, Reset DB |
| **Dr. Anjali Rathord** | **Viewer** | `anjali.rathord@jajalmedical.com` *(or `viewer@jajalmedical.com`)* | `viewer123` | Read-only: View cases & dashboard (Delete Blocked `403`) |
| **Varun Rivanker** | **Engineer** *(Bonus)* | `varun.rivanker@jajalmedical.com` *(or `engineer@jajalmedical.com`)* | `engineer123` | View, Create, Edit, Status changes (Delete Blocked `403`) |
| **Dr. Viraj Santosh Tamse** | **Admin / Surgeon** | `viraj.tamse@jajalmedical.com` | `viraj123` | Joint Arthroplasty Lead & Admin CRUD |

*Note: You can also use the one-click quick login pills on the login screen or in the top navigation bar to switch personas instantly during testing.*

---

## 🚀 Setup & Installation Steps

### 1. Clone & Install
```bash
git clone https://github.com/jajal-medical/case-management.git
cd case-management
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key environment variables:
- `PORT=3000`
- `PUBLIC_HOLIDAYS_API_URL=https://date.nager.at/api/v3/PublicHolidays`

### 3. Start Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Feature Tests
Execute the automated test suite via CLI:
```bash
npm test
```
Or click the **"Run Automated Tests"** button inside the app navigation bar.

---

## 📡 REST API Endpoints

All responses follow the unified JSON structure:
`{ "success": boolean, "data": any, "message": string, "errors"?: Record<string, string[]> }`

| Method | Endpoint | Description | Who Can Call | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticate and obtain Bearer token | Anyone | 200, 422 |
| `POST` | `/api/logout` | Invalidate current Bearer token | Logged-in | 200, 401 |
| `GET` | `/api/cases` | List cases (paginated, filtered, sorted) | Admin, Engineer, Viewer | 200, 401 |
| `POST` | `/api/cases` | Create a new medical implant case | Admin, Engineer | 201, 401, 403, 422 |
| `GET` | `/api/cases/:id` | Retrieve single case by ID | Admin, Engineer, Viewer | 200, 401, 404 |
| `PUT` | `/api/cases/:id` | Update case (unique rule ignores current) | Admin, Engineer | 200, 401, 403, 404, 422 |
| `DELETE` | `/api/cases/:id` | Delete case | **Admin only** | 200, 401, 403, 404 |
| `GET` | `/api/stats` | Dashboard statistics & metrics | Admin, Engineer, Viewer | 200, 401 |
| `GET` | `/api/holidays` | Public holiday lookup (Nager.Date) | Anyone | 200 |
| `POST` | `/api/tests/run` | Execute automated test suite | Anyone | 200 |

---

## 🧪 Automated Feature Tests Implemented

1. **Test 1**: Valid login succeeds (`200 OK`, returns token and user payload).
2. **Test 2**: Invalid login is rejected (`422 Unprocessable Entity` with validation message).
3. **Test 3**: Guest cannot open case pages or APIs (`401 Unauthenticated`).
4. **Test 4**: Admin can create a case (`201 Created` with generated ID).
5. **Test 5**: Creating a case with a duplicate Case Number fails (`422 Unprocessable Entity`).
6. **Test 6**: Viewer cannot delete a case (`403 Forbidden` enforced on server).
7. **Bonus Test 7**: Engineer can create/edit cases but cannot delete (`403 Forbidden`).

---

## 📑 Medical Software Documentation
- **Database Schema & ERD**: See `docs/database.md`
- **Traceability Matrix**: See `docs/traceability.md`
- **AWS Cloud Deployment**: See `docs/deployment.md`
- **Postman API Collection**: See `docs/postman_collection.json`

---

## 💡 Assumptions and Known Limitations
1. **Dummy Data Only**: In compliance with medical privacy regulations (HIPAA/GDPR), only synthetic patient codes (e.g. `PT-9812-OR`) and dummy implant types are used.
2. **Token Expiry**: Demo tokens are kept active for the session duration; in a multi-tenant production environment, token refresh tokens and rotating keys would be implemented.
3. **Audit Trail**: Basic created/updated timestamps and creator references are stored; full FDA 21 CFR Part 11 electronic signature workflows can be added as a future module.
