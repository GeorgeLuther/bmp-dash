import { type ShapeDef, type ShapeProps } from "..";

function DocumentPath({ width, height, ...svgAttributes }: ShapeProps) {
  // gentle wave height — capped so it looks good at small sizes
  const wave = Math.min(14, height * 0.28);

  // Outline:
  // M 0,0 → H width → down to height - wave → single cubic curve back to (0,height) → close
  const d = [
    `M 0 0`,
    `H ${width}`,
    `V ${height - wave}`,
    // tweak the control points if you want a flatter or steeper “document curl”
    `C ${width * 0.7} ${height + wave * 0.6}, ${width * 0.3} ${height - wave * 1.6}, 0 ${height}`,
    `Z`,
  ].join(" ");

  return <path d={d} {...svgAttributes} />;
}
const Document: ShapeDef = {
  id: "document",
  meta: {
    label: "Document",
    description:
      "Documented information such as a controlled policy (procedure, instruction, reference, etc).",
    defaultColor: "#7ad9e6ff",
    aspectRatio: 14 / 10,
  },
  Component: DocumentPath,
};
export default Document;
