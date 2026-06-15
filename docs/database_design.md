# College Academic Portal - Database Design

---

## Roles

```text
SUPER_ADMIN
HOD
STUDENT
```

---

## Week 1 Models

---

### 1. User

> Base authentication table for all user types.

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| email | String | Unique, Not Null |
| password | String | Not Null |
| first_name | String | Not Null |
| last_name | String | Not Null |
| role | Enum | SUPER_ADMIN / HOD / STUDENT |
| college_id | FK → College | Nullable (null for SUPER_ADMIN) |
| is_active | Boolean | Default True |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

> Extend Django's `AbstractUser` to get `first_name`, `last_name`, and auth fields out of the box.

---

### 2. College

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| name | String | Not Null |
| email_domain | String | Unique, Not Null |
| location | String | Not Null |
| logo | FileField | Nullable |
| is_active | Boolean | Default True |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

---

### 3. Department

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| name | String | Not Null |
| college_id | FK → College | Not Null, Cascade Delete |
| is_active | Boolean | Default True |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

---

### 4. HODProfile

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| user_id | OneToOne FK → User | Not Null |
| department_id | FK → Department | Not Null |
| college_id | FK → College | Not Null |
| phone | String | Nullable |
| joined_at | Date | Nullable |
| created_at | DateTime | Auto |

---

## Week 2 Models

---

### 5. StudentProfile

| Field | Type | Constraints |
|---|---|---|
| id | Integer | Primary Key, Auto |
| user_id | OneToOne FK → User | Not Null |
| department_id | FK → Department | Not Null |
| college_id | FK → College | Not Null |
| roll_no | String | Unique within Department |
| semester | Integer | Not Null |
| batch_year | Integer | Not Null |
| is_active | Boolean | Default True |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

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
> Formula: `(PRESENT count / total records) × 100`

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

> No `student_id` stored. Anonymity is preserved by default.

---

## Relationships Summary

```text
College
   └── Department
          ├── HODProfile → User (first_name, last_name, email)
          ├── StudentProfile → User (first_name, last_name, email)
          │      ├── Mark → Subject
          │      ├── Attendance → Subject
          │      └── Document
          ├── Subject
          │      └── Assignment
          ├── Notice
          ├── ExamSchedule → Subject
          └── Complaint
```

---

## Build Order

| Week | Models to Create |
|---|---|
| Week 1 | User, College, Department, HODProfile |
| Week 2 | StudentProfile, Subject |
| Week 3 | Notice, Assignment |
| Week 4 | Mark, Attendance |
| Week 5 | Complaint, Document, ExamSchedule |

---

## Notes

- Use `AbstractUser` as base for the User model to get `first_name`, `last_name`, and Django auth for free.
- `full_name` can be a property: `return f"{self.first_name} {self.last_name}"`
- `college_id` on User avoids joins when doing permission checks.
- All soft deletes use `is_active` flag, not actual deletion.
- Attendance percentage is never stored, always calculated.
- Complaint has no student reference — anonymous by design.