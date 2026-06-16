# College Academic Portal - Database Design

---

## Roles

```text
PLATFORM_ADMIN
COLLEGE_ADMIN
HOD
STUDENT
```

---

## System Hierarchy

```text
Developer
    ↓
Creates Platform Admin

Platform Admin
    ↓
Creates Colleges
    ↓
Creates College Admins

College Admin
    ↓
Creates Departments
    ↓
Creates HODs

HOD
    ↓
Creates Students

Students
    ↓
Access Academic Services
```

---

## Role Responsibilities

### PLATFORM_ADMIN

Platform-level administrator responsible for managing the entire system.

Actions:

* Create Colleges
* Edit Colleges
* Activate/Deactivate Colleges
* Create College Admin Accounts
* View Platform Statistics
* Monitor All Colleges

Cannot:

* Manage student academics directly
* Mark attendance
* Publish marks

---

### COLLEGE_ADMIN

Administrator responsible for a single college.

Actions:

* Manage One College
* Create Departments
* Edit Departments
* Create HOD Accounts
* Deactivate HOD Accounts
* View College Reports
* Manage College-Level Fees
* Monitor Department Performance

Cannot:

* Create Colleges
* Manage Other Colleges
* Access Platform Settings

---

### HOD

Head of Department responsible for departmental academic operations.

Actions:

* Create Student Accounts
* Create Notices
* Create Assignments
* Mark Attendance
* Publish Marks
* Verify Documents
* Schedule Exams
* Manage Department Academics

Cannot:

* Create Colleges
* Create Departments
* Create HOD Accounts
* Access Other Departments

---

### STUDENT

End-user of the academic portal.

Actions:

* View Attendance
* View Marks
* View Notices
* View Assignments
* Upload Documents
* Submit Complaints
* Pay College Fees
* View Exam Schedules

Cannot:

* Manage Academic Records
* Modify Attendance
* Modify Marks
* Access Administrative Features

---

## Week 1 Models

---

### 1. User

Base authentication table for all user types.

| Field      | Type         | Constraints                                    |
| ---------- | ------------ | ---------------------------------------------- |
| id         | Integer      | Primary Key, Auto                              |
| email      | String       | Unique, Not Null                               |
| password   | String       | Nullable until password setup                  |
| first_name | String       | Not Null                                       |
| last_name  | String       | Not Null                                       |
| role       | Enum         | PLATFORM_ADMIN / COLLEGE_ADMIN / HOD / STUDENT |
| college_id | FK → College | Nullable (null for PLATFORM_ADMIN)             |
| is_active  | Boolean      | Default False                                  |
| created_at | DateTime     | Auto                                           |
| updated_at | DateTime     | Auto                                           |



---

### 2. College

| Field        | Type      | Constraints       |
| ------------ | --------- | ----------------- |
| id           | Integer   | Primary Key, Auto |
| name         | String    | Not Null          |
| email_domain | String    | Unique, Not Null  |
| location     | String    | Not Null          |
| logo         | FileField | Nullable          |
| is_active    | Boolean   | Default True      |
| created_at   | DateTime  | Auto              |
| updated_at   | DateTime  | Auto              |

---

### 3. CollegeAdminProfile

| Field      | Type               | Constraints       |
| ---------- | ------------------ | ----------------- |
| id         | Integer            | Primary Key, Auto |
| user_id    | OneToOne FK → User | Not Null          |
| college_id | FK → College       | Not Null          |
| phone      | String             | Nullable          |
| joined_at  | Date               | Nullable          |
| created_at | DateTime           | Auto              |

---

### 4. Department

| Field      | Type         | Constraints       |
| ---------- | ------------ | ----------------- |
| id         | Integer      | Primary Key, Auto |
| name       | String       | Not Null          |
| college_id | FK → College | Not Null          |
| is_active  | Boolean      | Default True      |
| created_at | DateTime     | Auto              |
| updated_at | DateTime     | Auto              |

---

### 5. HODProfile

| Field         | Type               | Constraints       |
| ------------- | ------------------ | ----------------- |
| id            | Integer            | Primary Key, Auto |
| user_id       | OneToOne FK → User | Not Null          |
| department_id | FK → Department    | Not Null          |
| college_id    | FK → College       | Not Null          |
| phone         | String             | Nullable          |
| joined_at     | Date               | Nullable          |
| created_at    | DateTime           | Auto              |

---

## Authentication Flow

### Platform Admin

<<<<<<< HEAD
---

### 6. Subject

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| name | String | Not Null |
| code | String | Unique within Department |
| semester | Integer | Not Null |
| department_id | FK → Department | Not Null |
| credit_hours | Integer | Nullable |
| is_active | Boolean | Default True |
| created_at | DateTime | Auto |

---

## Week 3 Models

---

### 7. Notice

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| department_id | FK → Department | Not Null |
| title | String | Not Null |
| content | Text | Not Null |
| notice_type | Enum | GENERAL / EVENT / EXAM / URGENT |
| is_pinned | Boolean | Default False |
| created_by | FK → User | Not Null |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

---

### 8. Assignment

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| department_id | FK → Department | Not Null |
| subject_id | FK → Subject | Not Null |
| title | String | Not Null |
| description | Text | Not Null |
| deadline | DateTime | Not Null |
| attachment | FileField | Nullable |
| created_by | FK → User | Not Null |
| created_at | DateTime | Auto |

---

## Week 4 Models

---

### 9. Mark

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| student_id | FK → StudentProfile | Not Null |
| subject_id | FK → Subject | Not Null |
| semester | Integer | Not Null |
| exam_type | Enum | INTERNAL / MODEL / UNIVERSITY |
| max_mark | Integer | Not Null |
| scored_mark | Integer | Not Null |
| grade | String | Nullable, Auto-calculated |
| status | Enum | DRAFT / PUBLISHED, Default DRAFT |
| created_by | FK → User | Not Null |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

---

### 10. Attendance

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| student_id | FK → StudentProfile | Not Null |
| subject_id | FK → Subject | Not Null |
| date | Date | Not Null |
| status | Enum | PRESENT / ABSENT / ON_LEAVE |
| marked_by | FK → User | Not Null |
| created_at | DateTime | Auto |

> Attendance percentage is calculated at query time.
> Formula: (PRESENT count / total records) x 100

---

## Week 5 Models

---

### 11. Document

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| student_id | FK → StudentProfile | Not Null |
| title | String | Not Null |
| file | FileField | Not Null |
| file_type | Enum | BONAFIDE / INTERNSHIP_LETTER / COURSE_CERTIFICATE / OTHER |
| is_verified | Boolean | Default False |
| uploaded_by | FK → User | Not Null |
| created_at | DateTime | Auto |

---

### 12. ExamSchedule

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| department_id | FK → Department | Not Null |
| subject_id | FK → Subject | Not Null |
| exam_type | Enum | INTERNAL / MODEL / UNIVERSITY |
| exam_date | Date | Not Null |
| exam_time | Time | Not Null |
| duration_minutes | Integer | Nullable |
| venue | String | Nullable |
| created_by | FK → User | Not Null |
| created_at | DateTime | Auto |

---

### 13. Complaint

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| department_id | FK → Department | Not Null |
| title | String | Not Null |
| message | Text | Not Null |
| category | Enum | FACILITIES / ACADEMIC / OTHER, Nullable |
| status | Enum | PENDING / SEEN / RESOLVED, Default PENDING |
| is_anonymous | Boolean | Default True |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

> No student_id stored. Anonymity is preserved by default.

---

### 14. Fee

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| title | String | Not Null |
| description | Text | Nullable |
| fee_type | Enum | PTA / LAB / ASSOCIATION / DEPARTMENT_FUND / EVENT / TOUR / WORKSHOP / SEMINAR / CLUB / PLACEMENT / SPORTS / LIBRARY_FINE / BUS / HOSTEL / OTHER |
| amount | Decimal | Not Null |
| late_fee | Decimal | Nullable |
| department_id | FK → Department | Not Null |
| college_id | FK → College | Not Null |
| semester | Integer | Nullable (null means all semesters) |
| due_date | Date | Not Null |
| is_active | Boolean | Default True |
| created_by | FK → User | Not Null |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

---

### 15. FeePayment

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| fee_id | FK → Fee | Not Null |
| student_id | FK → StudentProfile | Not Null |
| amount_paid | Decimal | Not Null |
| late_fee_applied | Boolean | Default False |
| razorpay_order_id | String | Unique, Not Null |
| razorpay_payment_id | String | Nullable, filled after success |
| razorpay_signature | String | Nullable, filled after success |
| payment_mode | Enum | UPI / CARD / NETBANKING / WALLET, Nullable |
| receipt_number | String | Unique, Auto-generated |
| status | Enum | PENDING / SUCCESS / FAILED / REFUNDED |
| paid_at | DateTime | Nullable |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

> Receipt number format: RCPT-{YEAR}-{AUTO_INCREMENT}
> Example: RCPT-2026-00142

---

### 16. FeeReminder

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| fee_id | FK → Fee | Not Null |
| sent_by | FK → User | Not Null |
| sent_at | DateTime | Auto |
| note | Text | Nullable |

---

## Relationships Summary

```text
College
   └── Department
          ├── HODProfile → User (first_name, last_name, email)
          ├── StudentProfile → User (first_name, last_name, email)
          │      ├── Mark → Subject
          │      ├── Attendance → Subject
          │      ├── Document
          │      └── FeePayment → Fee
          ├── Subject
          │      └── Assignment
          ├── Notice
          ├── ExamSchedule → Subject
          ├── Fee
          │      └── FeeReminder
          └── Complaint
=======
Created manually during deployment.

```text
Developer
    ↓
Creates Platform Admin
>>>>>>> fb11a70 (Update architecture and database design)
```

---

### College Admin

<<<<<<< HEAD
| Week | Models to Create |
|---|---|
| Week 1 | User, College, Department, HODProfile |
| Week 2 | StudentProfile, Subject |
| Week 3 | Notice, Assignment |
| Week 4 | Mark, Attendance |
<<<<<<< HEAD
| Week 5 | Complaint, Document, ExamSchedule |
=======
```text
Platform Admin
    ↓
Creates College
    ↓
Creates College Admin
    ↓
Email Setup Link Sent
```
>>>>>>> fb11a70 (Update architecture and database design)
=======
| Week 5 | Complaint, Document, ExamSchedule, Fee, FeePayment, FeeReminder |
>>>>>>> amal-feature

---

### HOD

<<<<<<< HEAD
<<<<<<< HEAD
- Use `AbstractUser` as base for the User model to get `first_name`, `last_name`, and Django auth for free.
- `full_name` can be a property: `return f"{self.first_name} {self.last_name}"`
- `college_id` on User avoids joins when doing permission checks.
- All soft deletes use `is_active` flag, not actual deletion.
- Attendance percentage is never stored, always calculated.
- Complaint has no student reference — anonymous by design.
=======
```text
College Admin
    ↓
Creates HOD
    ↓
Email Setup Link Sent
```

---

### Student

```text
HOD
    ↓
Creates Student
    ↓
Email Setup Link Sent
```

---

## Password Setup Flow

Passwords are never sent through email.

```text
Account Created
      ↓
Email Setup Link Sent
      ↓
User Creates Password
      ↓
Account Activated
```

Accounts remain inactive until password setup is completed.

---

## Updated Relationship Summary

```text
Platform Admin
    └── College
            ├── CollegeAdminProfile → User
            │
            └── Department
                   ├── HODProfile → User
                   ├── StudentProfile → User
                   │      ├── Mark → Subject
                   │      ├── Attendance → Subject
                   │      ├── Document
                   │      └── FeePayment → Fee
                   │
                   ├── Subject
                   │      └── Assignment
                   │
                   ├── Notice
                   ├── ExamSchedule
                   ├── Complaint
                   └── Fee
                          └── FeeReminder
```

---

## Updated Build Order

| Week   | Models to Create                                                |
| ------ | --------------------------------------------------------------- |
| Week 1 | User, College, CollegeAdminProfile, Department, HODProfile      |
| Week 2 | StudentProfile, Subject                                         |
| Week 3 | Notice, Assignment                                              |
| Week 4 | Mark, Attendance                                                |
| Week 5 | Complaint, Document, ExamSchedule, Fee, FeePayment, FeeReminder |
>>>>>>> fb11a70 (Update architecture and database design)
=======
- Use AbstractUser as base for the User model to get first_name, last_name, and Django auth for free.
- full_name can be a property: return f"{self.first_name} {self.last_name}"
- college_id on User avoids joins when doing permission checks.
- All soft deletes use is_active flag, not actual deletion.
- Attendance percentage is never stored, always calculated.
- Complaint has no student reference — anonymous by design.
- FeePayment receipt number is auto-generated on payment success.
- Razorpay signature must be verified using HMAC SHA256 before marking any payment as SUCCESS.
>>>>>>> amal-feature
