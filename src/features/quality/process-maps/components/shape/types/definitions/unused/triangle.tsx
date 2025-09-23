import { type SvgProps } from "../../rawShapes";
import { generatePath } from "../../utils";

function Triangle({ width, height, ...svgAttributes }: SvgProps) {
  const trianglePath = generatePath([
    [0, height],
    [width / 2, 0],
    [width, height],
  ]);

  return <path d={trianglePath} {...svgAttributes} />;
}

export default Triangle;
