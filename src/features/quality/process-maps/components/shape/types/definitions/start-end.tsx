import { type RawShapeDef, type SvgProps } from "../rawShapes";

function StartEndSvg({ width, height, ...svgAttributes }: SvgProps) {
  const rx = Math.min(width / 2, height / 2); // full pill ends
  return (
    <rect
      x={0}
      y={0}
      width={width}
      height={height}
      rx={rx}
      {...svgAttributes}
    />
  );
}
const StartEnd: RawShapeDef = {
  id: "start-end",
  meta: {
    label: "Start / End",
    description: "Mark the beginning or end of a process.",
    defaultFill: "#9b9b9bff",
  },
  Component: StartEndSvg,
};

export default StartEnd;
