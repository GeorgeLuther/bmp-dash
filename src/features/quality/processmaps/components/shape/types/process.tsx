import { type ShapeProps } from ".";

function Process({ width, height, ...svgAttributes }: ShapeProps) {
  return <rect x={0} y={0} width={width} height={height} {...svgAttributes} />;
}

export default Process;
