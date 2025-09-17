import { type ShapeDef, type ShapeProps } from "..";
import { generatePath } from "../utils";

function SetupPath({ width, height, ...svgAttributes }: ShapeProps) {
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
const Setup: ShapeDef = {
  id: "setup",
  meta: {
    label: "Setup",
    description: "Preparatory step or activity.",
    defaultColor: "#673abbff",
    aspectRatio: 14 / 10,
  },
  Component: SetupPath,
};
export default Setup;
