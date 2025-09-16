import { ShapeComponents, type ShapeComponentProps } from "./types";

function Shape({ type, width, height, ...svgAttributes }: ShapeComponentProps) {
  const ShapeComponent = ShapeComponents[type];

  // The component still needs numbers to work, so we'll return null if they aren't provided.
  if (!ShapeComponent || !width || !height) {
    return null;
  }

  // Ensure width and height are numbers before calculation
  const numericWidth = Number(width);
  const numericHeight = Number(height);

  const strokeWidth = svgAttributes.strokeWidth
    ? +svgAttributes.strokeWidth
    : 0;

  const innerWidth = numericWidth - 2 * strokeWidth;
  const innerHeight = numericHeight - 2 * strokeWidth;

  return (
    // The SVG will scale to fill its parent, while the viewBox maintains the aspect ratio.
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${numericWidth} ${numericHeight}`}
      className="shape-svg"
    >
      <g
        transform={`translate(${svgAttributes.strokeWidth ?? 0}, ${
          svgAttributes.strokeWidth ?? 0
        })`}
      >
        <ShapeComponent
          width={innerWidth}
          height={innerHeight}
          {...svgAttributes}
        />
      </g>
    </svg>
  );
}

export default Shape;
