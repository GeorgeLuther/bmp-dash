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
  decision: Decision,
  action: Action,
  document: Document,
  data: Data,
  
  
};

export type ShapeType = keyof typeof ShapeComponents;

export type ShapeProps = {
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fillOpacity?: number;
} & SVGAttributes<SVGElement>;


export type ShapeComponentProps = Partial<ShapeProps> & { type: ShapeType };

// describes metadata about a shape TYPE (used by menu/inspector, not the painter itself)
export type ShapeMeta = {
  id: ShapeType;
  label: string;
  description: string;
  defaultColor: string;   // for previews / fallback
  aspectRatio: number;    // width / height for preview boxes
};

export type ShapeNode = Node<{
  type: ShapeType;
  color: string;
}>;
