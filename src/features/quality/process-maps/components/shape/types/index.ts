import { SVGAttributes } from 'react';
import type { Node } from '@xyflow/react';

import Process from './definitions/process';
import InOut from './definitions/in-out';
import StartEnd from './definitions/start-end';
import Setup from './definitions/setup';
import Decision from './definitions/decision';
import Action from './definitions/action';
import Document from './definitions/document';
import Data from './definitions/data';

// ----- TYPES -----
export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

export type ShapeMeta = {
  label: string;
  description: string;
  defaultColor: string;   // for previews / fallback
  aspectRatio: number;    // width / height for preview boxes
};

export type ShapeDef = {
  id: string;                          // the canonical id
  meta: ShapeMeta;                        // descriptive facts
  Component: (p: ShapeProps) => JSX.Element; // dumb SVG painter
};


// ----- REGISTRY -----
export const shapes = [
  Process,
  InOut,
  StartEnd,
  Setup,
  Decision,
  Action,
  Document,
  Data
] as const satisfies readonly ShapeDef[];

// valid ids are only the ones in 'shapes'
export type ShapeType = (typeof shapes)[number]["id"];

export const shapeMap = Object.fromEntries(
  shapes.map(s => [s.id, s])
) as Record<ShapeType, ShapeDef>;

export const getShapeById = (id: string) => shapeMap[id as ShapeType] || null;

// This is the data that is unique to each node instance on the canvas
export type ShapeNodeData = {
  type: ShapeType;
  color: string;
  label: string;
};

// This is the final, complete type for our custom node
export type ShapeNode = Node<ShapeNodeData>;