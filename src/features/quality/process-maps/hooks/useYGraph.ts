// src/features/quality/process-maps/hooks/useYGraph.ts
import { useMemo, useEffect, useState } from "react";
import * as Y from "yjs";
import { Node, Edge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

export function useYGraph(doc: Y.Doc) {
  const yNodes = useMemo(() => doc.getArray<Node>("nodes"), [doc]);
  const yEdges = useMemo(() => doc.getArray<Edge>("edges"), [doc]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const sync = () => { setNodes(yNodes.toArray()); setEdges(yEdges.toArray()); };
    const obs = () => sync();
    yNodes.observe(obs); yEdges.observe(obs); sync();
    return () => { yNodes.unobserve(obs); yEdges.unobserve(obs); };
  }, [yNodes, yEdges]);

  const writeNodes = (next: Node[]) => {
    doc.transact(() => { yNodes.delete(0, yNodes.length); next.forEach(n => yNodes.push([n])); });
    setNodes(next);
  };
  const writeEdges = (next: Edge[]) => {
    doc.transact(() => { yEdges.delete(0, yEdges.length); next.forEach(e => yEdges.push([e])); });
    setEdges(next);
  };

  return {
    nodes, edges,
    onNodesChange: (ch: any) => writeNodes(applyNodeChanges(ch, nodes)),
    onEdgesChange: (ch: any) => writeEdges(applyEdgeChanges(ch, edges)),
    writeNodes, writeEdges,
  };
}
