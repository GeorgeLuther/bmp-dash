// src/features/quality/process-maps/hooks/useYDoc.ts
import { useEffect, useMemo } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { HocuspocusProvider } from "@hocuspocus/provider";

type UseYDoc = {
  doc: Y.Doc;
  awareness: Awareness;
  provider: HocuspocusProvider | null;
};

export function useYDoc(room: string): UseYDoc {
  const doc = useMemo(() => new Y.Doc(), []);
  const awareness = useMemo(() => new Awareness(doc), [doc]);

  // Connect only if a server URL is set
  const provider = useMemo(() => {
    const url = import.meta.env.VITE_COLLAB_URL as string | undefined;
    return url ? new HocuspocusProvider({ url, name: room, document: doc, awareness }) : null;
  }, [room, doc, awareness]);

  useEffect(() => () => {
    provider?.destroy();
    doc.destroy();
  }, [provider, doc]);

  return { doc, awareness, provider };
}
