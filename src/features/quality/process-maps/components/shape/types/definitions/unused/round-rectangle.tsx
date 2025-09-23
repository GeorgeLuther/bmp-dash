import { type SvgProps } from "../../rawShapes";

function RoundRect({ width, height, ...svgAttributes }: SvgProps) {
  const rounding = Math.min(12, 0.2 * Math.min(width, height));

  return (
    <rect
      x={0}
      y={0}
      rx={rounding}
      width={width}
      height={height}
      {...svgAttributes}
    />
  );
}

export default RoundRect;
