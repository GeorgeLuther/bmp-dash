// process-maps/components/shape/types/rawShapes.ts
import type { SVGAttributes } from "react";

/* --- Shared Props --- */
export type SvgProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

/* --- Raw Meta (author can provide as much/little as they want for now) --- */
export type RawShapeMeta = {
  label?: string;
  description?: string;

  defaultFill?: string;
  defaultOpacity?: number;

  defaultStroke?: string;
  defaultStrokeOpacity?: number;
  defaultStrokeWidth?: number;

  gridAspect?: { cols: number; rows: number }; // default aspect ratio in RF canvas grid units 
  //[extra: string]: unknown; // passthrough for future metadata
};

/* --- Raw Def (must have id + Component, may require some basic meta in future version) --- */
export type RawShapeDef = {
  id: string;
  meta?: RawShapeMeta;
  Component: (p: SvgProps) => JSX.Element;
};

/* --- Import all the raw defs --- */
import Process from "./definitions/process";
import InOut from "./definitions/in-out";
import StartEnd from "./definitions/start-end";
import Setup from "./definitions/setup";
import Decision from "./definitions/decision";
import Action from "./definitions/action";
import Document from "./definitions/document";
import Data from "./definitions/data";

/* --- Collect into one array (no normalization yet) --- */
export const rawShapes = [
  Process,
  InOut,
  StartEnd,
  Setup,
  Decision,
  Action,
  Document,
  Data,
] as const satisfies readonly RawShapeDef[];
