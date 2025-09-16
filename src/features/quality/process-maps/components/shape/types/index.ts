import { SVGAttributes } from 'react';
import type { Node } from '@xyflow/react';

import Process from './process';
import InOut from './in-out';
import StartEnd from './start-end';
import Setup from './setup';
import Decision from './decision';
import Action from './action';
import Document from './document';
import Data from './data';

// here we register all the shapes that are available
// you can add your own here
export const ShapeComponents = {
  process: Process,
  'in-out': InOut,
  'start-end': StartEnd,
  setup: Setup,
  action: Action,
  document: Document,
  data: Data, 
};

export const shapes = [Decision] as const; // add more here
export const shapeMap = Object.fromEntries(
  (shapes as readonly ShapeDef[]).map(s => [s.id, s])
) as Record<string, ShapeDef>;

export type ShapeDef = {
  id: ShapeType;                          // the canonical id
  meta: ShapeMeta;                        // descriptive facts (no id needed)
  Component: (p: ShapeProps) => JSX.Element; // dumb SVG painter
};

export type ShapeType = keyof typeof ShapeComponents;

export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

export type ShapeComponentProps = Partial<ShapeProps> & { type: ShapeType };

// add to the existing file
export type ShapeMeta = {
  label: string;
  description: string;
  defaultColor: string;   // for previews / fallback
  aspectRatio: number;    // width / height for preview boxes
};

export type ShapeNode = Node<{
  type: ShapeType;
  color: string;
}>;
