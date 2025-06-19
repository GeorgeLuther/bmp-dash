// PersonnelContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../supabase/client";
import { useSession } from "./SessionContext";

// --- Types ------------------------------------------------

export interface Personnel {
  id: string;
  nfc_id: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  agency?: string;
}

export interface UserRole {
  role_id: string;
  role_label: string;
  involvement_id: string;
  involvement_label: string;
  assigned_since: string;
}

interface PersonnelContextType {
  personnel: Personnel | null;
  roles: UserRole[]; // NEW
  loading: boolean;
}

// --- Context setup ---------------------------------------

const PersonnelContext = createContext<PersonnelContextType>({
  personnel: null,
  roles: [], // NEW
  loading: true,
});

export const usePersonnel = () => useContext(PersonnelContext);

// --- Provider --------------------------------------------

export const PersonnelProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]); // NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setPersonnel(null);
      setRoles([]); // CLEAR roles on logout
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      // 1) Load personnel record
      const { data: pData, error: pErr } = await supabase
        .from("v_current_user_personnel")
        .select("*")
        .single();

      if (pErr) {
        console.error("Error loading personnel:", pErr);
        setPersonnel(null);
      } else {
        setPersonnel(pData);
      }

      // 2) Load current user roles
      const { data: rData, error: rErr } = await supabase.from(
        "v_current_user_active_roles"
      ).select(`
          role_id,
          role_label,
          involvement_id,
          involvement_label,
          assigned_since
        `);

      if (rErr) {
        console.error("Error loading roles:", rErr);
        setRoles([]);
      } else {
        setRoles(rData || []);
        console.log("Loaded roles:", rData);
      }

      setLoading(false);
    };

    fetchData();
  }, [session]);

  return (
    <PersonnelContext.Provider value={{ personnel, roles, loading }}>
      {children}
    </PersonnelContext.Provider>
  );
};
