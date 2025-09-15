import { type ShapeProps } from ".";
import { generatePath } from "./utils";

function InOut({ width, height, ...svgAttributes }: ShapeProps) {
  // this determines where to place the top-left and bottom-right points of the parallelogram
  const skew = width * 0.25;

  const inOutPath = generatePath([
    [0, height],
    [skew, 0],
    [width, 0],
    [width - skew, height],
  ]);

  return <path d={inOutPath} {...svgAttributes} />;
}

export default InOut;
