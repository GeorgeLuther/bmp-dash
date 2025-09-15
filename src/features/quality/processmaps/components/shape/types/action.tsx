import { type ShapeProps } from ".";
import { generatePath } from "./utils";

function Action({ width, height, ...svgAttributes }: ShapeProps) {
  const skew = width * 0.3;

  const actionPath = generatePath([
    [0, 0],
    [width - skew, 0],
    [width, height / 2],
    [width - skew, height],
    [0, height],
  ]);

  return <path d={actionPath} {...svgAttributes} />;
}

export default Action;
