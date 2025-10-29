import { type RawShapeDef, type SvgProps } from "../rawShapes";

function DataSvg({ width, height, ...svgAttributes }: SvgProps) {
  const bend = height * 0.125;

  return (
    <path
      d={`M0,${bend}  L 0,${height - bend} A ${
        width / 2
      } ${bend} 0 1 0 ${width} ${height - bend} L ${width},${bend} A ${
        width / 2
      } ${bend} 0 1 1 0 ${bend} A ${
        width / 2
      } ${bend} 0 1 1 ${width} ${bend} A ${
        width / 2
      } ${bend} 0 1 1 0 ${bend} z`}
      {...svgAttributes}
    />
  );
}
const Data: RawShapeDef = {
  id: "data",
  meta: {
    label: "Data",
    description: "A database table, log, or controlled record.",
    defaultFill: "#af5bc9",
  },
  Component: DataSvg,
};
export default Data;
