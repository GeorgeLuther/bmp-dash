import ShapeMenuItem from "./shape-menu-item";
import { ShapeComponents, ShapeType } from "../shape/types";

function ShapeMenu() {
  return (
    <div className="shape-menu">
      <div className="shape-menu-label">Drag shapes to the canvas</div>
      <div className="shape-menu-items">
        {Object.keys(ShapeComponents).map((type) => (
          <ShapeMenuItem type={type as ShapeType} key={type} />
        ))}
      </div>
    </div>
  );
}

export default ShapeMenu;
