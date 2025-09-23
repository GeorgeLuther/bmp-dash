import { type SvgProps } from "../../rawShapes";

function Circle({ width, height, ...svgAttributes }: SvgProps) {
  return (
    <ellipse
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
      {...svgAttributes}
    />
  );
}

export default Circle;
