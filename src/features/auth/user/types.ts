//features/auth/user/types.ts
export type UserStatus = 'loading' | 'forbidden' | 'ready';

export interface UserEmail {
  id: string;
  address: string;
  email_type: 'Work' | 'Personal' | 'Shared' | 'Placeholder' | 'Archived' | 'Temporary';
  is_primary: boolean | null;         // DB allows null
  is_verified: boolean;
  is_disabled: boolean;
  send_notifications: boolean;
}

export interface UserEmployment {
  status_id?: string;
  status_label?: string;
  is_employed?: boolean;
  is_active?: boolean;
}

export interface UserRole {
  role_id: string;
  role_label: string;
  involvement_id: string | null;
  involvement_label: string | null;
  proficiency_id: string | null;
  proficiency_label: string | null;
  assigned_since?: string;            // timestamptz ISO
}

export interface UserDepartment {
  department_id: string;
  department_label: string;
}

export interface CurrentUser {
  personnel_id: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  preferred_name: string | null;
  emails: UserEmail[];               // from v_current_user_context
  employment: UserEmployment;        // object, may be {}
  roles: UserRole[];                 // from v_current_user_context or v_current_user_active_roles
  departments: UserDepartment[];     // from v_current_user_context
}

export interface Capabilities {
  isTopManagement: boolean;
  canAdminPeople: boolean;
  canEditDocs: boolean;
}

export interface UserContextValue {
  status: UserStatus;
  user: CurrentUser | null;
  roles: UserRole[];                 // duplicate list for convenience
  capabilities: Capabilities;
  error: string | null;
  refresh: () => Promise<void>;
}
