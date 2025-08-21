import { useTheme } from "@mui/material";
import {
  baseGeom,
  actionGeom,
  termGeom,
  docGeom,
  ioGeom,
  dbGeom,
} from "./shapeGeom";

export type ShapeId =
  | "action"
  | "process"
  | "terminator"
  | "decision"
  | "document"
  | "io"
  | "database";

export type BodyProps = {
  G?: number; // grid size; default 24
  strokeWidth?: number; // default 1
  fill?: string; // default theme.palette.primary.main
  stroke?: string; // default theme.palette.secondary.main
  className?: string;
  style?: React.CSSProperties;
};

const NS = { vectorEffect: "non-scaling-stroke" as const };
function useColors(fill?: string, stroke?: string) {
  const t = useTheme();
  return {
    f: fill ?? t.palette.primary.main,
    s: stroke ?? t.palette.secondary.main,
  };
}

// 1) Process (rounded rect)
export function ProcessBody({
  G = 24,
  strokeWidth = 1,
  fill,
  stroke,
  ...rest
}: BodyProps) {
  const { f, s } = useColors(fill, stroke);
  const { w, h, r } = baseGeom(G);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} {...rest}>
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={r}
        ry={r}
        fill={f}
        stroke={s}
        strokeWidth={strokeWidth}
        style={NS}
      />
    </svg>
  );
}

// 2) Action (right notch)
export function ActionBody({
  G = 24,
  strokeWidth = 1,
  fill,
  stroke,
  ...rest
}: BodyProps) {
  const { f, s } = useColors(fill, stroke);
  const { w, h, r, notch } = actionGeom(G);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} {...rest}>
      <path
        d={`M 0 ${r} Q 0 0 ${r} 0 H ${w - notch} L ${w} ${h / 2} L ${w - notch} ${h} H ${r} Q 0 ${h} 0 ${h - r} Z`}
        fill={f}
        stroke={s}
        strokeWidth={strokeWidth}
        style={NS}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 3) Terminator (capsule)
export function TerminatorBody({
  G = 24,
  strokeWidth = 1,
  fill,
  stroke,
  ...rest
}: BodyProps) {
  const { f, s } = useColors(fill, stroke);
  const { w, h, rx } = termGeom(G);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} {...rest}>
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={rx}
        ry={rx}
        fill={f}
        stroke={s}
        strokeWidth={strokeWidth}
        style={NS}
      />
    </svg>
  );
}

// 4) Decision (diamond)
export function DecisionBody({
  G = 24,
  strokeWidth = 1,
  fill,
  stroke,
  ...rest
}: BodyProps) {
  const { f, s } = useColors(fill, stroke);
  const { w, h } = baseGeom(G);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} {...rest}>
      <path
        d={`M ${w / 2} 0 L ${w} ${h / 2} L ${w / 2} ${h} L 0 ${h / 2} Z`}
        fill={f}
        stroke={s}
        strokeWidth={strokeWidth}
        style={NS}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 5) Document (wavy bottom)
export function DocumentBody({
  G = 24,
  strokeWidth = 1,
  fill,
  stroke,
  ...rest
}: BodyProps) {
  const { f, s } = useColors(fill, stroke);
  const { w, h, r, wave } = docGeom(G);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} {...rest}>
      <path
        d={`M 0 ${r} Q 0 0 ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - wave}
            C ${w * 0.75} ${h - wave * 2}, ${w * 0.25} ${h}, 0 ${h - wave} Z`}
        fill={f}
        stroke={s}
        strokeWidth={strokeWidth}
        style={NS}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 6) Input/Output (parallelogram)
export function IOBody({
  G = 24,
  strokeWidth = 1,
  fill,
  stroke,
  ...rest
}: BodyProps) {
  const { f, s } = useColors(fill, stroke);
  const { w, h, slant } = ioGeom(G);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} {...rest}>
      <path
        d={`M ${slant} 0 H ${w} L ${w - slant} ${h} H 0 Z`}
        fill={f}
        stroke={s}
        strokeWidth={strokeWidth}
        style={NS}
      />
    </svg>
  );
}

// 7) Database (cylinder)
export function DatabaseBody({
  G = 24,
  strokeWidth = 1,
  fill,
  stroke,
  ...rest
}: BodyProps) {
  const { f, s } = useColors(fill, stroke);
  const { w, h, rx, ry } = dbGeom(G);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} {...rest}>
      <path
        d={`M 0 ${ry} C 0 ${-ry / 2}, ${w} ${-ry / 2}, ${w} ${ry} V ${h - ry} C ${w} ${h - ry / 2}, 0 ${h - ry / 2}, 0 ${h - ry} Z`}
        fill={f}
        stroke={s}
        strokeWidth={strokeWidth}
        style={NS}
      />
      <path
        d={`M 0 ${ry} C 0 ${ry * 2}, ${w} ${ry * 2}, ${w} ${ry}`}
        fill="none"
        stroke={s}
        strokeWidth={strokeWidth}
        style={NS}
        opacity={0.4}
      />
    </svg>
  );
}

// Optional keyed access
export const SHAPE_BODIES = {
  action: ActionBody,
  process: ProcessBody,
  terminator: TerminatorBody,
  decision: DecisionBody,
  document: DocumentBody,
  io: IOBody,
  database: DatabaseBody,
} as const;
