// src/features/personnel/table/person.types.ts
export type Person = {
  id: string;

  // names
  first_name?: string | null;
  last_name?: string | null;
  preferred_name?: string | null;

  // status/context
  employment_status?: string | null;
  agency?: string | null;

  // org
  departments?: string[] | null;      // plural
  subdepartments?: string[] | null;   // optional

  // contact
  email_primary?: string | null;

  // dates (ISO strings)
  started_at?: string | null;
  hired_at?: string | null;
  created_at?: string | null;
};
