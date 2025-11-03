// src/features/auth/user/types.ts
export type UserStatus = 'loading' | 'forbidden' | 'ready';

export interface UserEmail {
  id: string;
  address: string;
  email_type: string;
  is_primary: boolean | null;
  is_verified: boolean;
  is_disabled: boolean;
  send_notifications: boolean;
}

export interface UserEmployment {
  status_id?: string | null;
  status_label?: string | null;
  is_employed?: boolean | null;
  is_active?: boolean | null;
  first_hired_at?: string | null;
  latest_hired_at?: string | null;
  end_at?: string | null;
}

export interface UserRole {
  role_id: string;
  role_label: string;
  involvement_id: string | null;
  involvement_label: string | null;
  proficiency_id: string | null;
  proficiency_label: string | null;
  assigned_since?: string | null;
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
  employment: UserEmployment;
  emails: UserEmail[];
  roles: UserRole[];
  departments: UserDepartment[];
}

export interface Capabilities {
  isTopManagement: boolean;
  canAdminPeople: boolean;
  canEditDocs: boolean;
}

export interface UserContextValue {
  status: UserStatus;
  user: CurrentUser | null;
  roles: UserRole[];
  capabilities: Capabilities;
  error: string | null;
  refresh: () => Promise<void>;
}
