import * as React from "react";

type SvgProps = React.SVGProps<SVGSVGElement> & {
  strokeWidth?: number;
  radius?: number; // for rects
};

const baseProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  role: "img",
  "aria-hidden": true,
} as const;

/** Keeps strokes constant when scaled in canvas */
const noScale = { vectorEffect: "non-scaling-stroke" as const };

/** Rectangle (rounded) */
export function SvgRect({ strokeWidth = 1.75, radius = 3, ...rest }: SvgProps) {
  return (
    <svg {...baseProps} {...rest}>
      <rect
        x={4.5}
        y={5.5}
        width={15}
        height={13}
        rx={radius}
        ry={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        style={noScale}
      />
    </svg>
  );
}

/** Circle */
export function SvgCircle({ strokeWidth = 1.75, ...rest }: SvgProps) {
  return (
    <svg {...baseProps} {...rest}>
      <circle
        cx={12}
        cy={12}
        r={7.5}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        style={noScale}
      />
    </svg>
  );
}

/** Diamond (Decision) */
export function SvgDiamond({ strokeWidth = 1.75, ...rest }: SvgProps) {
  return (
    <svg {...baseProps} {...rest}>
      <path
        d="M12 3.5 L20.5 12 12 20.5 3.5 12 Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        style={noScale}
      />
    </svg>
  );
}

/** Document (for forms/procedures) */
export function SvgDocument({ strokeWidth = 1.75, ...rest }: SvgProps) {
  return (
    <svg {...baseProps} {...rest}>
      <path
        d="M7 4.5h7l3.5 3.5V19.5H7z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        style={noScale}
      />
      <path
        d="M14 4.5V8h3.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        style={noScale}
      />
      <path
        d="M9.25 11.25h5.5M9.25 14.25h5.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        style={noScale}
      />
    </svg>
  );
}

/** Database (for data sources/lookups) */
export function SvgDatabase({ strokeWidth = 1.75, ...rest }: SvgProps) {
  return (
    <svg {...baseProps} {...rest}>
      <ellipse
        cx={12}
        cy={6.5}
        rx={6.5}
        ry={2.75}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        style={noScale}
      />
      <path
        d="M5.5 6.5v8.5c0 1.5 2.9 2.75 6.5 2.75s6.5-1.25 6.5-2.75V6.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        style={noScale}
      />
      <path
        d="M5.6 10.5c1.1 1 3.4 1.6 6.4 1.6s5.3-.6 6.4-1.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        style={noScale}
      />
      <path
        d="M5.6 14.25c1.1 1 3.4 1.6 6.4 1.6s5.3-.6 6.4-1.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        style={noScale}
      />
    </svg>
  );
}
