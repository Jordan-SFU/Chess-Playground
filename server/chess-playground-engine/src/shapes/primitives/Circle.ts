// src/shapes/primitives/Circle.ts
import { Position } from "../../utils/position";

/**
 * Diamond-shaped “circle” of radius r using Manhattan distance:
 * includes all offsets where |dx| + |dy| <= radius, excluding the origin.
 */
export function circle(radius: number): Position[] {
  const result: Position[] = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      // skip the origin
      if (dx === 0 && dy === 0) continue;

      // Manhattan check
      if (Math.abs(dx) + Math.abs(dy) <= radius) {
        result.push({ x: dx, y: dy });
      }
    }
  }
  return result;
}
