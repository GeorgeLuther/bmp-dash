// src/features/auth/user/useUser.ts
import { useContext } from "react";
import { Ctx } from "./UserContext";

export default function useUser() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUser must be used within a UserProvider");
  return v;
}
