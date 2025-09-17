import { type ShapeDef, type ShapeProps } from "..";

function DataPath({ width, height, ...svgAttributes }: ShapeProps) {
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
const Data: ShapeDef = {
  id: "data",
  meta: {
    label: "Data",
    description: "A database table, log, or controlled record.",
    defaultColor: "#af5bc9ff",
    aspectRatio: 14 / 10,
  },
  Component: DataPath,
};
export default Data;
