# Database Documentation & Schema Design

## 📐 Entity Relationship Diagram (ERD)

```text
+-------------------------------------------------------------+
|                            USERS                            |
+-------------------------------------------------------------+
| PK  | id             | BIGINT UNSIGNED AUTO_INCREMENT       |
|     | name           | VARCHAR(255) NOT NULL                |
| UQ  | email          | VARCHAR(255) NOT NULL UNIQUE         |
|     | password       | VARCHAR(255) NOT NULL (hashed)       |
|     | role           | ENUM('admin','engineer','viewer')    |
|     | remember_token | VARCHAR(100) NULLABLE                |
|     | created_at     | TIMESTAMP NULLABLE                   |
|     | updated_at     | TIMESTAMP NULLABLE                   |
+-------------------------------------------------------------+
                               |
                               | 1 : N (One User creates Many Cases)
                               | FK: cases.created_by -> users.id
                               v
+-------------------------------------------------------------+
|                            CASES                            |
+-------------------------------------------------------------+
| PK  | id                | BIGINT UNSIGNED AUTO_INCREMENT    |
| UQ  | case_number       | VARCHAR(64) NOT NULL UNIQUE       |
|     | patient_reference | VARCHAR(64) NOT NULL              |
|     | surgeon_name      | VARCHAR(255) NOT NULL             |
|     | implant_type      | VARCHAR(255) NOT NULL             |
| IDX | status            | ENUM('Draft','Planning','In Review'|
|     |                   |  'Approved','Completed','Cancelled')
|     | priority          | ENUM('Low','Medium','High')       |
|     | surgery_date      | DATE NULLABLE                     |
| FK  | created_by        | BIGINT UNSIGNED NOT NULL          |
|     | hospital          | VARCHAR(255) NULLABLE             |
|     | notes             | TEXT NULLABLE                     |
|     | created_at        | TIMESTAMP NULLABLE                |
|     | updated_at        | TIMESTAMP NULLABLE                |
+-------------------------------------------------------------+
```

---

## 📋 Tables & Column Specifications

### 1. `users` Table
Stores authenticated personnel authorized to interact with the medical case management system.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto Increment | Unique identifier |
| `name` | `VARCHAR(255)` | NOT NULL | User's full name (e.g. Dr. Simran Sanket Kale) |
| `email` | `VARCHAR(255)` | NOT NULL, UNIQUE INDEX | Work email for authentication |
| `password` | `VARCHAR(255)` | NOT NULL | Hashed password (Bcrypt/Argon2) |
| `role` | `ENUM('admin', 'viewer', 'engineer')` | NOT NULL, DEFAULT `'viewer'` | Access control role |
| `remember_token`| `VARCHAR(100)` | NULLABLE | Session remember token |
| `created_at` | `TIMESTAMP` | NULLABLE | Account creation timestamp |
| `updated_at` | `TIMESTAMP` | NULLABLE | Account update timestamp |

### 2. `cases` Table
Stores patient surgical implant tracking records.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Primary Key, Auto Increment | Unique case record ID |
| `case_number` | `VARCHAR(64)` | NOT NULL, **UNIQUE INDEX** | Formatted case identifier (e.g. `CASE-0001`) |
| `patient_reference`| `VARCHAR(64)`| NOT NULL | De-identified dummy patient code (e.g. `PT-9812-OR`) |
| `surgeon_name` | `VARCHAR(255)` | NOT NULL | Responsible operating surgeon |
| `implant_type` | `VARCHAR(255)` | NOT NULL | Medical implant specification or device model |
| `status` | `ENUM(...)` | NOT NULL, **INDEX** | `Draft`, `Planning`, `In Review`, `Approved`, `Completed`, `Cancelled` |
| `priority` | `ENUM(...)` | NOT NULL | `Low`, `Medium`, `High` |
| `surgery_date` | `DATE` | NULLABLE | Scheduled or completed surgery date |
| `created_by` | `BIGINT UNSIGNED` | NOT NULL, **FOREIGN KEY** (`users.id`) | Audit reference to creator user |
| `hospital` | `VARCHAR(255)` | NULLABLE | Operating surgical center or hospital |
| `notes` | `TEXT` | NULLABLE | Clinical or engineering notes |
| `created_at` | `TIMESTAMP` | NOT NULL | Timestamp when record was created |
| `updated_at` | `TIMESTAMP` | NOT NULL | Timestamp when record was last updated |

---

## ⚡ Indexes & Optimization

1. **`case_number_unique`**: Unique index on `cases.case_number` prevents race conditions when registering new implant cases.
2. **`cases_status_index`**: Standard index on `cases.status` accelerates dashboard count aggregations (`SELECT COUNT(*) ... WHERE status = 'Approved'`) and filtered case table queries.
3. **`cases_created_by_foreign`**: Foreign key with `ON DELETE RESTRICT` ensures referential integrity — users with associated case records cannot be accidentally deleted.

---

## 🌾 Seeder & Factory Implementation

The project includes seeders that populate:
- **4 Authorized Personas**:
  1. `Dr. Simran Sanket Kale` (Admin - Chief Medical Administrator)
  2. `Dr. Anjali Rathord` (Viewer - Clinical Reviewer)
  3. `Varun Rivanker` (Engineer - Lead Biomedical Engineer)
  4. `Dr. Viraj Santosh Tamse` (Admin - Chief Joint Arthroplasty Surgeon)
- **24 Cases**: Covering all 6 statuses and 3 priority levels with authentic medical device specifications (porous titanium hip stems, cruciate knee systems, PEEK cranial meshes, spinal fixation screws, maxillofacial plates), distributed across operating surgeons Dr. Simran Sanket Kale, Dr. Anjali Rathord, Varun Rivanker, and Dr. Viraj Santosh Tamse.
