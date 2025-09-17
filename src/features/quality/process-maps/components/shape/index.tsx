// Shape.tsx
import { SVGAttributes, CSSProperties, memo } from "react";
import { getShapeById, type ShapeType } from "./types"; // your file with shapes[], shapeMap, ShapeType, etc.

/**
 * Attributes we want to apply to the painter (paths, rects, etc.),
 * NOT to the outer <svg>. We exclude width/height/viewBox since we manage those.
 */
type PaintAttrs = Omit<
  SVGAttributes<SVGElement>,
  "width" | "height" | "viewBox" | "className" | "style"
>;

export type ShapeComponentProps = {
  type: ShapeType;
  width: number;
  height: number;
  /** Optional title for <svg><title>…</title></svg> */
  title?: string;
  /** Forwarded to the outer <svg> only */
  svgClassName?: string;
  svgStyle?: CSSProperties;
} & PaintAttrs;

function ShapeBase({
  type,
  width,
  height,
  title,
  svgClassName,
  svgStyle,
  ...paintAttrs
}: ShapeComponentProps) {
  const def = getShapeById(type);
  if (!def) return null;

  const ShapeComponent = def.Component;
  if (!width || !height) return null;

  // Coerce strokeWidth to a number safely
  const strokeWidth =
    paintAttrs.strokeWidth !== undefined
      ? Number(paintAttrs.strokeWidth) || 0
      : 0;

  // Keep inner box non-negative even if someone passes a huge strokeWidth
  const innerWidth = Math.max(0, width - 2 * strokeWidth);
  const innerHeight = Math.max(0, height - 2 * strokeWidth);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      className={svgClassName}
      style={svgStyle}
      role="img"
      aria-label={def.meta.label}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* useful for tooltips/AT; falls back to meta.label */}
      <title>{title ?? def.meta.label}</title>
      <g transform={`translate(${strokeWidth}, ${strokeWidth})`}>
        <ShapeComponent
          width={innerWidth}
          height={innerHeight}
          {...paintAttrs}
        />
      </g>
    </svg>
  );
}

const Shape = memo(ShapeBase);
export default Shape;
