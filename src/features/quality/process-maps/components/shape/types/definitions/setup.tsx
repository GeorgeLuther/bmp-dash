import { type RawShapeDef, type SvgProps } from "../rawShapes";
import { generatePath } from "../utils";

function SetupSvg({ width, height, ...svgAttributes }: SvgProps) {
  const skew = width * 0.1;

  const setupPath = generatePath([
    [0, height / 2],
    [skew, 0],
    [width - skew, 0],
    [width, height / 2],
    [width - skew, height],
    [skew, height],
  ]);

  return <path d={setupPath} {...svgAttributes} />;
}
const Setup: RawShapeDef = {
  id: "setup",
  meta: {
    label: "Setup",
    description: "Preparatory step or activity.",
    defaultFill: "#673abb",
  },
  Component: SetupSvg,
};
export default Setup;
