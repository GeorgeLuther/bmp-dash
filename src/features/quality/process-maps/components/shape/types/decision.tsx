import { type ShapeProps, type ShapeMeta } from ".";
import { generatePath } from "./utils";

export const meta: ShapeMeta = {
  id: "decision",
  label: "Decision",
  description: "Branch point (e.g., Yes / No).",
  defaultColor: "#42a5f5",
  aspectRatio: 14 / 10,
};

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

//why not set it as one export with decision.path , decision.aspectRatio, etc? or decision.meta.defaultColor
