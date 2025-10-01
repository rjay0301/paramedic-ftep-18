# Administrator User Guide

**Field Training Education Portal (FTEP)**

Complete administrative guide for system administrators managing the FTEP platform.

---

## Table of Contents

1. [Administrator Role](#administrator-role)
2. [Getting Started](#getting-started)
3. [Admin Dashboard](#admin-dashboard)
4. [User Management](#user-management)
5. [System Configuration](#system-configuration)
6. [Database Management](#database-management)
7. [Analytics & Reporting](#analytics--reporting)
8. [Security & Compliance](#security--compliance)
9. [Troubleshooting](#troubleshooting)
10. [System Maintenance](#system-maintenance)

---

## Administrator Role

### Your Responsibilities

As an administrator, you have full system control and responsibility for:

**User Management**
- Create, approve, and manage all user accounts
- Assign and change user roles
- Activate/deactivate accounts
- Delete users and associated data
- Reset passwords

**System Operations**
- Monitor system health
- Ensure data integrity
- Manage database records
- Review audit logs
- System configuration

**Security**
- Maintain security policies
- Review access controls
- Monitor for breaches
- Manage authentication
- Ensure compliance

**Support**
- Technical support escalation
- System troubleshooting
- Data recovery
- Issue resolution

### Administrator Capabilities

✅ **Full Access**
- All user profiles and data
- All student submissions
- All coordinator functions
- Database records
- System settings
- Audit logs
- Analytics

✅ **User Management**
- Create any user type
- Approve registrations
- Assign/change roles
- Activate/deactivate accounts
- Delete users

✅ **Data Management**
- View all records
- Database management
- Data export
- Backup management
- Data cleanup

✅ **System Control**
- Configuration changes
- Security settings
- Integration management
- System maintenance

---

## Getting Started

### First Admin Setup

**Initial Admin Account Creation:**

1. **First User Automatically Becomes Admin**
   - When the system is first deployed
   - The first user to sign up gets admin access
   - They must activate their account

2. **Or Created via Database**
   ```sql
   UPDATE profiles
   SET role = 'admin', status = 'active'
   WHERE email = 'admin@example.com';
   ```

3. **Login**
   - Use admin email and password
   - Directed to Admin Dashboard
   - Full system access granted

### Admin Profile Setup

1. Click your name (top right)
2. Select "Profile"
3. Update information:
   - Full name
   - Contact email
   - Additional details
4. Click "Save Changes"

---

## Admin Dashboard

### Dashboard Overview

Your admin dashboard provides comprehensive system oversight:

**System Health Cards**
- Total Users (all roles)
- Active Students
- Pending Approvals
- System Alerts

**User Statistics**
- Users by role breakdown
- New registrations
- Active vs. inactive
- Role distribution

**Activity Monitoring**
- Recent user activity
- Form submissions
- System events
- Error logs

**Quick Actions**
- Approve pending users
- Create new users
- View audit logs
- System settings
- Database manager

### Navigation

**Top Navigation**
- Admin Dashboard
- Users Management
- Analytics
- Database
- Settings
- Your Profile
- Logout

**Side Navigation**
- Dashboard
- Users
- Analytics
- Audit Logs
- Database Records
- Student Progress Monitor
- System Settings

---

## User Management

### Viewing All Users

**Access User List:**
1. Click "Users" in navigation
2. See all users across all roles
3. View comprehensive information:
   - Name and email
   - Role (admin/coordinator/student)
   - Status (pending/active/inactive)
   - Created date
   - Last login

**List Features:**
- Search by name/email
- Filter by role
- Filter by status
- Sort any column
- Bulk actions

### Creating New Users

**Create User Manually:**

1. Click "Create User" button
2. Fill out form:
   - Email (required, unique)
   - Password (temporary)
   - Full name
   - Role (student/coordinator/admin)
   - Initial status
3. Click "Create"
4. User receives email notification
5. User must change password on first login

**Best Practices:**
- Use organizational emails
- Assign correct role immediately
- Set status appropriately
- Document reason in notes

### Approving Pending Users

**Handle New Registrations:**

1. **View Pending Approvals**
   - Dashboard shows count
   - Click "Pending Approvals"
   - See all awaiting approval

2. **Review Application**
   - Email address
   - Name
   - Registration date
   - Any additional info

3. **Approve User**
   - Click "Approve" button
   - Select role (usually student)
   - User becomes active
   - Email notification sent

4. **Reject User** (if needed)
   - Click "Reject"
   - Provide reason
   - User notified
   - Can reapply later

**Approval Workflow:**
```
User Signs Up → Status: Pending
↓
Admin Reviews
↓
Approve → Status: Active, Role Assigned
↓
User Can Login
```

### Changing User Roles

**Assign or Change Role:**

1. Navigate to user profile
2. Click "Change Role" or "Edit"
3. Select new role:
   - Student
   - Coordinator
   - Admin
4. Confirm change
5. System automatically:
   - Updates permissions
   - Creates role-specific records
   - Adjusts access levels

**Important Notes:**
- Role changes are logged
- User receives notification
- Access changes immediately
- Be careful with admin role
- Document reason for change

### Activating/Deactivating Users

**Change User Status:**

**Deactivate User:**
1. Go to user profile
2. Click "Deactivate"
3. Confirm action
4. User cannot login
5. Data preserved
6. Can reactivate later

**Reactivate User:**
1. Find deactivated user
2. Click "Activate"
3. Confirm action
4. User can login again

**Use Cases:**
- Temporary leave
- Suspended users
- Graduated students
- Transferred users
- Policy violations

### Deleting Users

**Permanent Deletion:**

⚠️ **WARNING: This is permanent and cannot be undone!**

**When to Delete:**
- Duplicate accounts
- Test accounts
- Fraudulent accounts
- Upon formal request
- Data cleanup (with policy)

**Deletion Process:**

1. Navigate to user profile
2. Click "Delete User"
3. Confirmation dialog appears
4. Type "DELETE" to confirm
5. All data permanently removed:
   - Profile deleted
   - Student/coordinator record deleted
   - All form submissions deleted
   - All progress data deleted
   - Cascade deletion automatic

**What Gets Deleted:**
- User profile
- Authentication credentials
- Role-specific records (student/coordinator)
- All form submissions
- All form drafts
- All progress data
- All audit log entries for that user

**Best Practice:**
- Export data before deletion
- Document deletion reason
- Verify with stakeholders
- Consider deactivation instead
- Keep audit trail

### Password Management

**Reset User Password:**

1. Navigate to user profile
2. Click "Reset Password"
3. Temporary password generated
4. User notified via email
5. Must change on next login

**Password Policies:**
- Minimum 8 characters
- Must change temporary passwords
- No password reuse (recommended)
- Regular update reminders

---

## System Configuration

### Application Settings

**Access Settings:**
1. Click "Settings" in navigation
2. View/edit configuration

**Available Settings:**

**General Settings**
- Application name
- Organization name
- Contact information
- Support email

**User Settings**
- Default role for new users
- Auto-approve students (not recommended)
- Password requirements
- Session timeout

**Training Settings**
- Total forms required (default: 74)
- Phase requirements
- Completion criteria
- Timeline expectations

**Email Settings**
- Notification preferences
- Email templates
- Sender information

**Security Settings**
- Two-factor authentication (if available)
- Session management
- IP restrictions (if needed)
- Audit log retention

### Integration Management

**Supabase Configuration:**
- Database connection verified
- Row Level Security active
- Edge functions deployed
- Authentication configured

**Monitoring Integrations:**
- Error tracking setup (if configured)
- Analytics integration (if configured)
- Backup systems (if configured)

---

## Database Management

### Database Records Manager

**Access Database Manager:**
1. Click "Database Records"
2. View all tables and records

**Available Tables:**
- profiles
- students
- coordinators
- training_phases
- student_submissions
- form_submissions
- form_drafts
- assignments
- instructional_case_summaries
- addendum_forms
- student_progress
- audit_logs
- hubs

**Operations:**

**View Records**
- Select table
- Browse records
- Filter and search
- Export data

**Table Information**
- Record count
- Column structure
- Relationships
- Indexes

### Data Integrity

**Regular Checks:**

1. **Verify Consistency**
   - Student records match profiles
   - Progress calculations accurate
   - Orphaned records identified
   - Relationship integrity

2. **Clean Up**
   - Remove orphaned data
   - Archive old records
   - Optimize queries
   - Rebuild indexes (if needed)

3. **Backup Verification**
   - Daily backups running
   - Test restore capability
   - Document recovery procedures

### Database Maintenance

**Weekly Tasks:**
- Review database size
- Check query performance
- Monitor connection pool
- Review slow queries

**Monthly Tasks:**
- Comprehensive data audit
- Archive old data (if policy)
- Optimize tables
- Update statistics

**Best Practices:**
- Never modify data directly without backup
- Test queries in development first
- Document all manual changes
- Keep audit trail

---

## Analytics & Reporting

### System Analytics

**Overview Metrics:**
- Total users (by role)
- Active users (last 30 days)
- System usage trends
- Storage utilization

**User Analytics:**
- New registrations per month
- Role distribution
- Active vs. inactive
- Geographic distribution (if captured)
- Login frequency

**Training Analytics:**
- Overall completion rate
- Average time to completion
- Phase completion rates
- Submission frequency
- Quality metrics (if available)

**Performance Metrics:**
- Page load times
- Error rates
- Database query performance
- System uptime

### Student Progress Monitor

**Comprehensive View:**

1. Click "Student Progress Monitor"
2. See all students
3. Progress indicators
4. Filter and sort options

**Progress Metrics:**
- Individual completion percentages
- Time in program
- Forms completed
- Phases completed
- On track vs. behind schedule

**Identify Trends:**
- High performers
- At-risk students
- Common bottlenecks
- Completion predictions
- Success factors

### Generating Reports

**System Reports:**

**User Reports**
- All users by role
- Active users
- Pending approvals
- Inactive accounts
- Role distribution

**Training Reports**
- Program completion rates
- Average timelines
- Phase-by-phase analysis
- Cohort comparisons
- Trend analysis

**Compliance Reports**
- All active students
- Completion status
- Outstanding requirements
- Audit trail
- Certification readiness

**Custom Reports:**
- Define parameters
- Select data points
- Choose date ranges
- Export formats
- Schedule recurring reports

---

## Security & Compliance

### Audit Logs

**Access Audit Logs:**
1. Click "Audit Logs"
2. View all system actions
3. Filter and search

**Logged Events:**
- User creation
- Role changes
- Login attempts
- Data modifications
- Permission changes
- User deletions
- Configuration changes

**Log Information:**
- Timestamp
- User who performed action
- Action type
- Affected records
- Old vs. new values
- IP address (if captured)
- Result (success/failure)

**Using Audit Logs:**
- Security investigations
- Compliance verification
- Troubleshooting
- User activity tracking
- Policy enforcement

### Security Best Practices

**Account Security:**
- Use strong admin passwords
- Change default credentials
- Enable 2FA if available
- Limit admin accounts
- Regular password updates

**Access Control:**
- Principle of least privilege
- Regular access reviews
- Remove unused accounts
- Monitor for suspicious activity

**Data Protection:**
- Regular backups
- Encrypted connections
- Secure data at rest
- HIPAA compliance (no patient names)
- Regular security audits

**Monitoring:**
- Review audit logs weekly
- Monitor failed login attempts
- Check for unusual patterns
- Alert on security events
- Document incidents

### Compliance

**Data Privacy:**
- HIPAA compliance ensured
- No PHI beyond necessary
- Student data protected
- Access controls enforced
- Audit trails maintained

**Record Retention:**
- Define retention policy
- Archive old records
- Secure deletion procedures
- Compliance with regulations

**Incident Response:**
- Have response plan
- Know escalation path
- Document incidents
- Review and improve

---

## Troubleshooting

### Common Issues

**User Can't Login**

**Diagnose:**
1. Check user status (must be 'active')
2. Verify email correct
3. Check role assigned
4. Review audit logs for failed attempts
5. Check for account lockout

**Resolve:**
- Activate account if pending
- Reset password
- Verify email
- Clear lockouts
- Check browser issues

**Database Connectivity Issues**

**Diagnose:**
1. Check Supabase dashboard
2. Verify project not paused
3. Check connection limits
4. Review error logs

**Resolve:**
- Restart project if paused
- Upgrade plan if limits reached
- Check network configuration
- Contact Supabase support

**Missing Data / Sync Issues**

**Diagnose:**
1. Check database records
2. Review recent changes
3. Check RLS policies
4. Verify permissions

**Resolve:**
- Manual data verification
- RLS policy adjustment
- Permission fixes
- Data recovery from backup

**Performance Issues**

**Diagnose:**
1. Check database query performance
2. Review slow query logs
3. Check concurrent users
4. Review error rates

**Resolve:**
- Optimize slow queries
- Add indexes
- Upgrade resources
- Cache frequently accessed data

### Error Messages

**"Permission Denied"**
- User lacks proper role
- RLS policy blocking
- Check user permissions
- Verify role assignment

**"Database Error"**
- Connection issue
- Query timeout
- Invalid data
- Check logs for details

**"Authentication Failed"**
- Incorrect credentials
- Account inactive
- Session expired
- Token invalid

### Getting Help

**Internal Resources:**
- System documentation
- Deployment guide
- Role permissions guide
- Troubleshooting guide

**External Support:**
- Supabase support (database)
- Hosting provider (if not Lovable)
- Development team (for bugs)
- Community forums

---

## System Maintenance

### Daily Tasks

- [ ] Check pending approvals
- [ ] Review error logs
- [ ] Monitor system health
- [ ] Check for alerts
- [ ] Review support tickets

### Weekly Tasks

- [ ] Review audit logs
- [ ] Check database performance
- [ ] Review user activity
- [ ] Generate status reports
- [ ] Update documentation
- [ ] Security review

### Monthly Tasks

- [ ] Comprehensive system audit
- [ ] Performance optimization
- [ ] Update dependencies
- [ ] Backup verification
- [ ] Security assessment
- [ ] Policy review
- [ ] Training sessions (if needed)

### Quarterly Tasks

- [ ] Full system review
- [ ] Capacity planning
- [ ] Disaster recovery test
- [ ] Security audit
- [ ] Compliance review
- [ ] Feature assessment
- [ ] Budget review

### Backup & Recovery

**Backup Strategy:**
- Daily automated backups (Supabase)
- Point-in-time recovery available
- Test restores quarterly
- Document recovery procedures

**Recovery Procedures:**
1. Identify issue
2. Determine recovery point
3. Initiate restore
4. Verify data integrity
5. Communicate with users
6. Document incident

### Updates & Upgrades

**System Updates:**
- Review release notes
- Test in staging first
- Schedule maintenance window
- Notify users
- Perform update
- Verify functionality
- Monitor for issues

**Dependency Updates:**
- Review security advisories
- Test compatibility
- Update gradually
- Monitor for regressions

---

## Best Practices

### User Management

**Do:**
- ✓ Verify user identity before approval
- ✓ Assign correct roles immediately
- ✓ Document role changes
- ✓ Regular access reviews
- ✓ Remove unused accounts
- ✓ Monitor for suspicious activity

**Don't:**
- ✗ Share admin credentials
- ✗ Approve without verification
- ✗ Grant admin role lightly
- ✗ Delete users without backup
- ✗ Ignore security alerts

### Security

**Do:**
- ✓ Use strong passwords
- ✓ Enable 2FA if available
- ✓ Review audit logs regularly
- ✓ Keep software updated
- ✓ Follow principle of least privilege
- ✓ Document security incidents

**Don't:**
- ✗ Use default passwords
- ✗ Share admin access
- ✗ Ignore security warnings
- ✗ Skip backups
- ✗ Postpone critical updates

### Data Management

**Do:**
- ✓ Regular backups
- ✓ Test recovery procedures
- ✓ Monitor data integrity
- ✓ Archive old data per policy
- ✓ Document changes
- ✓ Export before major changes

**Don't:**
- ✗ Modify production data directly
- ✗ Skip backup verification
- ✗ Delete without confirmation
- ✗ Ignore data anomalies

---

## Administrator Checklist

### New System Deployment

- [ ] Initial admin account created
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] Environment variables set
- [ ] Security settings configured
- [ ] Backup system verified
- [ ] Monitoring configured
- [ ] Documentation reviewed
- [ ] Test accounts created
- [ ] Support contacts established

### Ongoing Operations

**Daily:**
- [ ] Check system health
- [ ] Review pending approvals
- [ ] Check error logs
- [ ] Monitor critical alerts

**Weekly:**
- [ ] User access review
- [ ] Audit log review
- [ ] Performance check
- [ ] Security review
- [ ] Support ticket review

**Monthly:**
- [ ] Full system audit
- [ ] Generate reports
- [ ] Update documentation
- [ ] Review policies
- [ ] Training updates
- [ ] Compliance check

**Quarterly:**
- [ ] Disaster recovery test
- [ ] Security assessment
- [ ] Capacity planning
- [ ] Budget review
- [ ] Strategy review

---

## Emergency Procedures

### System Outage

1. **Assess situation**
2. **Check hosting provider status**
3. **Review error logs**
4. **Contact technical support**
5. **Communicate with users**
6. **Document incident**
7. **Implement fix**
8. **Verify resolution**
9. **Post-mortem review**

### Data Breach

1. **Identify scope**
2. **Contain breach**
3. **Notify stakeholders**
4. **Follow legal requirements**
5. **Preserve evidence**
6. **Remediate vulnerability**
7. **Review and prevent**

### Data Loss

1. **Stop all operations**
2. **Assess damage**
3. **Initiate recovery**
4. **Restore from backup**
5. **Verify data integrity**
6. **Resume operations**
7. **Document and review**

---

## FAQs

**Q: How many admin accounts should we have?**
A: Minimum of 2 for redundancy, maximum of 5 for security. Document all admin accounts.

**Q: Can I recover a deleted user?**
A: No, deletion is permanent. Always export data first. Consider deactivation instead.

**Q: How long are audit logs kept?**
A: Indefinitely by default. Set retention policy per your organization's requirements.

**Q: Can I bulk import users?**
A: Not currently. Users must be created individually or sign up themselves.

**Q: What if I accidentally delete important data?**
A: Restore from most recent backup. Contact Supabase support immediately.

**Q: How do I add a new coordinator?**
A: Create user account, assign 'coordinator' role. They get access to coordinator portal.

**Q: Can coordinators see other coordinators' data?**
A: Coordinators see all student data, not other coordinator records specifically.

**Q: What's the difference between inactive and deleted?**
A: Inactive: User can't login, data preserved. Deleted: Permanent removal, no recovery.

---

Your role as administrator is critical to system success. Through careful management, diligent monitoring, and proactive maintenance, you ensure a reliable, secure platform for paramedic education.

**Thank you for your stewardship of this important system!** 🚑
