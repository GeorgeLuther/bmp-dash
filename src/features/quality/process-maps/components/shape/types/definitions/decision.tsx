import { type RawShapeDef, type SvgProps } from "../rawShapes";
import { generatePath } from "../utils";

function DecisionSvg({ width, height, ...svgAttributes }: SvgProps) {
  const decisionPath = generatePath([
    [0, height / 2],
    [width / 2, 0],
    [width, height / 2],
    [width / 2, height],
  ]);

  return <path d={decisionPath} {...svgAttributes} />;
}

const Decision: RawShapeDef = {
  id: "decision",
  meta: {
    label: "Decision",
    description: "Branching point, Yes/No, etc.",
    defaultFill: "#d48543ff",
  },
  Component: DecisionSvg,
};

export default Decision;
