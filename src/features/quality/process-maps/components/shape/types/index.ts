// process-maps/components/shape/types/index.ts
import { lighten } from "@mui/material/styles";
import { rawShapes, type RawShapeDef, type RawShapeMeta, type SvgProps } from "./rawShapes";

// ----- TYPES -----

/** 'Final', normalized shape def used by menu/canvas/minimap */
export type ShapeDef = {
  id: string;
  meta: {
    label: string;
    description: string;
    gridAspect: { cols: number, rows: number };
    defaultFill: string;
    defaultOpacity: number;
    defaultStroke: string;
    defaultStrokeOpacity: number;
    defaultStrokeWidth: number;
    [extra: string]: unknown;
  };
  Component: (p: SvgProps) => JSX.Element;
};

// ----- REGISTRY ----- 
export const shapes = rawShapes
  .map<ShapeDef | null>((def: RawShapeDef) => {
    if (!def?.id || typeof def.Component !== "function")  {
      console.error("Invalid shape def (needs id + Component):", def);
      return null;
    }

    const m: RawShapeMeta = def.meta ?? {};

    return {
      id: def.id,
      meta: {
        label: m.label ?? "Shape",
        description: m.description ?? "No description",
        gridAspect: { cols: m.gridAspect?.cols ?? 7, rows: m.gridAspect?.rows ?? 5 },
        defaultFill: m.defaultFill ?? "#a3a3a3",
        defaultOpacity: m.defaultOpacity ?? .8,
        defaultStroke: m.defaultStroke ?? lighten(m.defaultFill ?? "#525252", 0.35),
        defaultStrokeOpacity: m.defaultStrokeOpacity ?? 1,
        defaultStrokeWidth: m.defaultStrokeWidth ?? 2,
      },
      Component: def.Component,
    };
  })
  .filter((s): s is ShapeDef => s !== null) as readonly ShapeDef[];

export type ShapeType = (typeof shapes)[number]["id"];
export const shapeMap = Object.fromEntries(shapes.map(s => [s.id, s])) as Record<ShapeType, ShapeDef>;
export const getShapeById = (id: string): ShapeDef | null => (shapeMap as any)[id] ?? null;


  export type { SvgProps, RawShapeDef } from "./rawShapes";