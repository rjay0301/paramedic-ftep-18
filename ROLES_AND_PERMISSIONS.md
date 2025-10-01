# User Roles and Permissions

This document defines the three user roles in the system and their respective capabilities.

---

## Role Hierarchy

```
Admin > Coordinator > Student
```

---

## 1. STUDENT Role

### Overview
Students are paramedic trainees progressing through a structured training program with multiple phases and forms to complete.

### Capabilities

#### Dashboard & Progress
- View personal dashboard with training phase overview
- Track completion progress across all phases
- View completed and pending forms
- See overall progress percentage

#### Form Management
- Create, edit, and submit forms for assigned training phases
- Save form drafts for later completion
- View submission history and status
- Cannot edit forms after submission

#### Training Phases Access
Students complete forms in these phases:
1. **Observational Phase** - Initial observation forms
2. **Instructional Phase** - Shift logs and case summaries
3. **Independent Phase** - Independent practice documentation
4. **Rural Ambulance** - Rural placement documentation
5. **Final Evaluation** - Comprehensive assessment
6. **Declarations & Reflective Practice** - Additional requirements

#### Assignments
- View assigned tasks and assignments
- Submit assignment responses
- Track assignment completion status

#### Profile Management
- View and edit personal profile information
- Update FTP (Field Training Preceptor) details
- Update hub and contact information
- Cannot change role or status

### Data Access
- **Own data only**: Students can only view and modify their own records
- Cannot access other students' data
- Cannot view coordinator or admin functions

### Database Tables (Student Access)
- `students` - Own record only
- `form_submissions` - Own submissions only
- `form_drafts` - Own drafts only
- `assignments` - Own assignments only
- `instructional_case_summaries` - Own summaries only
- `addendum_forms` - Own forms only
- `student_progress` - Own progress only

---

## 2. COORDINATOR Role

### Overview
Coordinators oversee student training, monitor progress, and manage student records within their supervision.

### Capabilities

#### Student Management
- View list of all students
- Access individual student profiles
- View student progress and completion status
- Monitor form submission status across all students
- Cannot delete students (admin only)

#### Student Data Access
- View all student forms and submissions
- View student phase progress
- Access student contact information
- View FTP assignments and hub information
- Generate progress reports

#### Dashboard
- Coordinator-specific dashboard with:
  - Student overview and statistics
  - Recent submissions and activities
  - Progress tracking across cohorts
  - Phase completion summaries

#### PDF Generation
- Generate comprehensive student progress PDFs
- Export student training records
- Create phase-specific reports

#### Monitoring
- Track student activity and engagement
- View submission timestamps
- Monitor training phase completion
- Identify students needing support

### Limitations
- Cannot modify student submissions
- Cannot change student roles or status
- Cannot access admin functions
- Cannot delete users or records

### Database Tables (Coordinator Access)
- `students` - View all
- `coordinators` - Own record only
- `form_submissions` - View all
- `student_progress` - View all
- `assignments` - View all
- `instructional_case_summaries` - View all
- `student_submissions` - View all

---

## 3. ADMIN Role

### Overview
Administrators have full system access with capabilities to manage users, roles, system configuration, and all data.

### Capabilities

#### User Management
- Create new users (students, coordinators, admins)
- Approve pending user registrations
- Assign and change user roles
- Activate or deactivate user accounts
- Delete users and all associated data

#### System Administration
- Access admin dashboard with system-wide analytics
- View all users across all roles
- Manage user status (pending, active, inactive)
- Override role assignments

#### Database Management
- View and manage all database records
- Access database records manager
- View table schemas and relationships
- Execute administrative functions

#### Audit & Monitoring
- View audit logs of all system changes
- Track user actions and modifications
- Monitor system-wide activity
- View role change history

#### Analytics & Reporting
- System-wide progress analytics
- User registration and approval metrics
- Training phase completion statistics
- Student progress across all cohorts

#### Full Data Access
- Access all student records
- View all coordinator data
- Modify any record (with proper controls)
- Export system data

### Special Functions
- User role assignment via `assign_user_role()` function
- User deletion via `delete_user()` function
- Database management functions
- System configuration changes

### Database Tables (Admin Access)
- **Full access to all tables**
- `profiles` - All records
- `students` - All records
- `coordinators` - All records
- `audit_logs` - All records
- `form_submissions` - All records
- `student_progress` - All records
- `assignments` - All records
- All other tables with full permissions

---

## Role Assignment & Status

### User Status Flow
```
1. User Registration → Status: 'pending'
2. Admin Approval → Status: 'active'
3. Can be deactivated → Status: 'inactive'
```

### Role Assignment
- Default role on registration: **Student**
- Role changes require **Admin** approval
- Role changes are logged in `role_change_logs` table
- Users can have only one role at a time

### Authentication & Authorization
- All routes protected with role-based access control
- Row Level Security (RLS) enforces data access at database level
- JWT tokens contain role information
- Session management with automatic token refresh

---

## Security Model

### Row Level Security (RLS)
Every table has RLS enabled with policies that enforce:

1. **Students**: Can only access their own data
2. **Coordinators**: Can view all student data, manage only their own profile
3. **Admins**: Can access and manage all data

### Policy Examples

#### Student Data Access
```sql
-- Students can view only their own submissions
CREATE POLICY "Students can view their form submissions"
ON form_submissions
FOR SELECT TO authenticated
USING (auth.uid() IN (
  SELECT profile_id FROM students WHERE id = form_submissions.student_id
));
```

#### Coordinator Data Access
```sql
-- Coordinators can view all student progress
CREATE POLICY "Coordinators can view all student progress"
ON student_progress
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role = 'coordinator'
));
```

#### Admin Data Access
```sql
-- Admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON audit_logs
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role = 'admin'
));
```

---

## Common Operations by Role

### Form Submission Process

**Student:**
1. Creates form draft
2. Completes form fields
3. Submits form
4. Views submission status

**Coordinator:**
1. Monitors student submissions
2. Views submitted forms
3. Tracks completion rates
4. Generates reports

**Admin:**
1. All coordinator capabilities
2. Can modify submission status
3. Can delete submissions if needed
4. Access submission audit trail

### User Account Management

**Student:**
- Update own profile information
- Cannot change role or status

**Coordinator:**
- View student profiles
- Cannot modify student accounts

**Admin:**
- Create new user accounts
- Approve pending registrations
- Assign roles
- Activate/deactivate accounts
- Delete users completely

---

## Database Schema Summary

### Core User Tables
- `profiles` - Base user information and role
- `students` - Student-specific data
- `coordinators` - Coordinator-specific data

### Training & Progress Tables
- `training_phases` - Phase definitions
- `student_submissions` - Phase-based submissions
- `form_submissions` - Form submission tracking
- `student_progress` - Progress metrics

### Form & Content Tables
- `form_drafts` - Auto-saved form drafts
- `form_revisions` - Form revision history
- `assignments` - Student assignments
- `instructional_case_summaries` - Case documentation
- `addendum_forms` - Additional forms

### Administrative Tables
- `audit_logs` - System activity logs (admin only)
- `hubs` - Training hub information

### Views
- `student_overall_progress` - Aggregated student progress
- `student_phase_progress` - Phase-specific progress
- `admin_user_view` - Admin user management view

---

## Key Distinctions

### Student vs Coordinator
- **Students** focus on completing their own training
- **Coordinators** focus on monitoring all students
- Students have no access to other students' data
- Coordinators cannot modify student data, only view

### Coordinator vs Admin
- **Coordinators** can view but not modify student records
- **Admins** can create, modify, and delete any record
- Coordinators cannot manage user accounts
- Admins have full system control and audit access

### Data Isolation
- Students: Isolated to own data
- Coordinators: Read access to all student data
- Admins: Full access to all data

---

## Security Best Practices

1. **Principle of Least Privilege**: Users only have permissions necessary for their role
2. **Defense in Depth**: Security enforced at multiple layers (API, RLS, application)
3. **Audit Trail**: All administrative actions are logged
4. **Data Isolation**: RLS policies prevent unauthorized data access
5. **Role-Based Access**: Routes and components restricted by role
