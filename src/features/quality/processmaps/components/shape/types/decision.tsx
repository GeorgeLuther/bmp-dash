import { type ShapeProps } from ".";
import { generatePath } from "./utils";

function Decision({ width, height, ...svgAttributes }: ShapeProps) {
  const decisionPath = generatePath([
    [0, height / 2],
    [width / 2, 0],
    [width, height / 2],
    [width / 2, height],
  ]);

  return <path d={decisionPath} {...svgAttributes} />;
}

export default Decision;
