// Provides current signed-in user's personnel record via React Context

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../supabase/client"; // your Supabase client instance
import { useSession } from "./SessionContext"; // assumes you have a session context that tracks auth

// Interface for the personnel record (from your DB view/table)
export interface Personnel {
  id: string;
  nfc_id: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  agency?: string;

  // Add more fields later as needed
}

// Defines what the context provides to consumers
interface PersonnelContextType {
  personnel: Personnel | null; // actual data
  loading: boolean; // lets UI know if we're still fetching
}

// Create the actual React context
const PersonnelContext = createContext<PersonnelContextType>({
  personnel: null,
  loading: true,
});

// Hook to consume the context (what you use in components)
export const usePersonnel = () => useContext(PersonnelContext);

// Provider component to wrap your app
export const PersonnelProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession(); // get the Supabase session
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If there's no session (user not logged in), clear data
    if (!session) {
      setPersonnel(null);
      setLoading(false);
      return;
    }

    // Otherwise, fetch personnel info for the current user
    const fetchPersonnel = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("v_current_user_personnel") // this view filters by auth.uid()
        .select("*")
        .single(); // we expect exactly one row

      if (error) {
        console.error("Error loading personnel:", error);
        setPersonnel(null);
      } else {
        setPersonnel(data);
      }

      setLoading(false);
    };

    fetchPersonnel();
  }, [session]); // re-run when session changes

  return (
    <PersonnelContext.Provider value={{ personnel, loading }}>
      {children}
    </PersonnelContext.Provider>
  );
};
