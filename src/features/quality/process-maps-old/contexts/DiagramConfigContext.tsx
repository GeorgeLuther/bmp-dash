import { createContext, useContext, type ReactNode } from "react";

export type DiagramConfig = { grid: number; readOnly: boolean };

const DiagramConfigContext = createContext<DiagramConfig | null>(null);

export function useDiagramConfig(): DiagramConfig {
  const ctx = useContext(DiagramConfigContext);
  if (!ctx)
    throw new Error(
      "useDiagramConfig must be used within DiagramConfigProvider"
    );
  return ctx;
}

export function DiagramConfigProvider({
  value,
  children,
}: {
  value: DiagramConfig;
  children: ReactNode;
}) {
  return (
    <DiagramConfigContext.Provider value={value}>
      {children}
    </DiagramConfigContext.Provider>
  );
}
