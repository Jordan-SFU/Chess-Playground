import { Position } from "../../utils/position";

/**
 * Reflects a list of offsets across a specified axis, and includes the original offsets.
 * @param offsets 
 * @param axis 
 * @returns 
 */
export function reflect(
    offsets: Position[],
    axis: "horizontal" | "vertical" | "both" = "both"
  ): Position[] {
    const result = new Map<string, Position>();
  
    for (const offset of offsets) {
      result.set(`${offset.x},${offset.y}`, offset);
    }
  
    for (const offset of offsets) {
      if (axis === "both" || axis === "horizontal") {
        const h = { x: -offset.x, y: offset.y };
        result.set(`${h.x},${h.y}`, h);
      }
      if (axis === "both" || axis === "vertical") {
        const v = { x: offset.x, y: -offset.y };
        result.set(`${v.x},${v.y}`, v);
      }
      if (axis === "both") {
        const hv = { x: -offset.x, y: -offset.y };
        result.set(`${hv.x},${hv.y}`, hv);
      }
    }
  
    return [...result.values()];
  }
  