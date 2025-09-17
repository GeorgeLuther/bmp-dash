import { type ShapeProps, type ShapeDef } from "..";
import { generatePath } from "../utils";

function DecisionPath({ width, height, ...svgAttributes }: ShapeProps) {
  const decisionPath = generatePath([
    [0, height / 2],
    [width / 2, 0],
    [width, height / 2],
    [width / 2, height],
  ]);

  return <path d={decisionPath} {...svgAttributes} />;
}

const Decision: ShapeDef = {
  id: "decision",
  meta: {
    label: "Decision",
    description: "Branching point, Yes/No, etc.",
    defaultColor: "#fd9947ff",
    aspectRatio: 14 / 10,
  },
  Component: DecisionPath,
};

export default Decision;

//why not set it as one export with decision.path , decision.aspectRatio, etc? or decision.meta.defaultColor
