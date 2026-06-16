## Authentication Flow

### Platform Admin

Created manually during deployment.

```text
Developer
    ↓
Creates Platform Admin
```

---

### College Admin

```text
Platform Admin
    ↓
Creates College
    ↓
Creates College Admin
    ↓
Email Setup Link Sent
```

---

### HOD

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

## Week 2 Models

### 6. StudentProfile

| Field         | Type               | Constraints              |
| ------------- | ------------------ | ------------------------ |
| id            | Integer            | Primary Key, Auto        |
| user_id       | OneToOne FK → User | Not Null                 |
| department_id | FK → Department    | Not Null                 |
| college_id    | FK → College       | Not Null                 |
| roll_no       | String             | Unique within Department |
| semester      | Integer            | Not Null                 |
| batch_year    | Integer            | Not Null                 |
| is_active     | Boolean            | Default True             |
| created_at    | DateTime           | Auto                     |
| updated_at    | DateTime           | Auto                     |

---

### 7. Subject

| Field         | Type            | Constraints              |
| ------------- | --------------- | ------------------------ |
| id            | Integer         | Primary Key, Auto        |
| name          | String          | Not Null                 |
| code          | String          | Unique within Department |
| semester      | Integer         | Not Null                 |
| department_id | FK → Department | Not Null                 |
| credit_hours  | Integer         | Nullable                 |
| is_active     | Boolean         | Default True             |
| created_at    | DateTime        | Auto                     |

---

## Week 3 Models

### 8. Notice

| Field         | Type            | Constraints                     |
| ------------- | --------------- | ------------------------------- |
| id            | Integer         | Primary Key, Auto               |
| department_id | FK → Department | Not Null                        |
| title         | String          | Not Null                        |
| content       | Text            | Not Null                        |
| notice_type   | Enum            | GENERAL / EVENT / EXAM / URGENT |
| is_pinned     | Boolean         | Default False                   |
| created_by    | FK → User       | Not Null                        |
| created_at    | DateTime        | Auto                            |
| updated_at    | DateTime        | Auto                            |

---

### 9. Assignment

| Field         | Type            | Constraints       |
| ------------- | --------------- | ----------------- |
| id            | Integer         | Primary Key, Auto |
| department_id | FK → Department | Not Null          |
| subject_id    | FK → Subject    | Not Null          |
| title         | String          | Not Null          |
| description   | Text            | Not Null          |
| deadline      | DateTime        | Not Null          |
| attachment    | FileField       | Nullable          |
| created_by    | FK → User       | Not Null          |
| created_at    | DateTime        | Auto              |

---

## Week 4 Models

### 10. Mark

| Field       | Type                | Constraints                   |
| ----------- | ------------------- | ----------------------------- |
| id          | Integer             | Primary Key, Auto             |
| student_id  | FK → StudentProfile | Not Null                      |
| subject_id  | FK → Subject        | Not Null                      |
| semester    | Integer             | Not Null                      |
| exam_type   | Enum                | INTERNAL / MODEL / UNIVERSITY |
| max_mark    | Integer             | Not Null                      |
| scored_mark | Integer             | Not Null                      |
| grade       | String              | Nullable                      |
| status      | Enum                | DRAFT / PUBLISHED             |
| created_by  | FK → User           | Not Null                      |
| created_at  | DateTime            | Auto                          |
| updated_at  | DateTime            | Auto                          |

---

### 11. Attendance

| Field      | Type                | Constraints                 |
| ---------- | ------------------- | --------------------------- |
| id         | Integer             | Primary Key, Auto           |
| student_id | FK → StudentProfile | Not Null                    |
| subject_id | FK → Subject        | Not Null                    |
| date       | Date                | Not Null                    |
| status     | Enum                | PRESENT / ABSENT / ON_LEAVE |
| marked_by  | FK → User           | Not Null                    |
| created_at | DateTime            | Auto                        |

---

## Week 5 Models

### 12. Document

### 13. ExamSchedule

### 14. Complaint

### 15. Fee

### 16. FeePayment

### 17. FeeReminder

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
                   │      ├── Mark
                   │      ├── Attendance
                   │      ├── Document
                   │      └── FeePayment
                   │
                   ├── Subject
                   ├── Assignment
                   ├── Notice
                   ├── ExamSchedule
                   ├── Complaint
                   └── Fee
```

---

## Build Order

| Week   | Models                                                          |
| ------ | --------------------------------------------------------------- |
| Week 1 | User, College, CollegeAdminProfile, Department, HODProfile      |
| Week 2 | StudentProfile, Subject                                         |
| Week 3 | Notice, Assignment                                              |
| Week 4 | Mark, Attendance                                                |
| Week 5 | Complaint, Document, ExamSchedule, Fee, FeePayment, FeeReminder |

---

## Notes

* Use AbstractUser as base User model.
* Use email-based authentication.
* Use AccountSetupToken for password setup workflow.
* Use is_active for soft deletion.
* Attendance percentage is calculated dynamically.
* Complaint remains anonymous by default.
* FeePayment receipt numbers are auto-generated.
* Razorpay signature must be verified before marking payments as SUCCESS.
