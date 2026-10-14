# Medical Software Requirement & Traceability Matrix (RTM)

In compliance with **IEC 62304 / ISO 13485** medical device software lifecycle standards, each functional requirement must maintain bidirectional traceability linking the user requirement (input), the architectural implementation (output), and the automated verification evidence.

---

## 📊 Traceability Matrix

| ID | Requirement (Input) | Implementation (Output) | Verification (Automated & Manual) |
| :--- | :--- | :--- | :--- |
| **REQ-001** | Admin shall be able to create a case | `CaseController@store` + `CaseFormModal.tsx` + `db.createCase` | **Feature test `TEST-004`**: Admin posts valid case payload, receives HTTP `201 Created` with generated ID. |
| **REQ-002** | Case Number shall be unique | Unique DB index on `cases.case_number` + Form Request validation rule (`validateCaseInput`) | **Feature test `TEST-005`**: Creating a case with an existing case number fails with HTTP `422 Unprocessable Entity` and field error. |
| **REQ-003** | Only Admin shall delete cases | `CasePolicy@delete` authorization gate + server route blocking non-admin | **Feature test `TEST-006`**: Viewer attempts `DELETE /api/cases/:id` and is blocked by server with HTTP `403 Forbidden`. |
| **REQ-004** | Authentication requirement for case access | `authMiddleware` verifying Bearer tokens on all `/api/cases*` routes | **Feature test `TEST-003`**: Guest requests case endpoints without token, receives HTTP `401 Unauthenticated` / client redirect to login. |
| **REQ-005** | Credential validation on login | `AuthController@login` checking email and password against stored hash | **Feature tests `TEST-001` & `TEST-002`**: Valid login yields HTTP `200` + token; invalid login fails with HTTP `422`. |
| **REQ-006** | Case list filtering & pagination | `CaseController@index` with `page`, `per_page=10`, `status`, and `search` query parameters | Automated pagination tests + live UI table assertion ensuring 10 items per page with page jump controls. |
| **REQ-007** *(Bonus)* | Public holiday awareness during surgery scheduling | External HTTP client to Nager.Date API (`/api/holidays`) with 3s timeout & fallback cache | UI verification next to surgery date picker + fallback handling in API controller. |
| **REQ-008** *(Bonus)* | Engineer role creation/editing without delete rights | `CasePolicy@canCreate` (true), `CasePolicy@canDelete` (false) | **Feature test `TEST-007`**: Engineer creates case successfully, but delete request returns HTTP `403 Forbidden`. |

---

## 🛡️ Verification Methodology
- **Automated Feature Tests**: Ran against live endpoints verifying HTTP status codes (200, 201, 401, 403, 422), JSON payloads, and validation dictionaries.
- **Form-Level Feedback**: Client-side reactive validation mirrors server-side constraints to provide immediate accessibility guidance to clinical coordinators.
