import { Position } from "../../utils/position";

export function square(size: number): Position[] {
    const result: Position[] = [];
    for (let dx = -size; dx <= size; dx++) {
        for (let dy = -size; dy <= size; dy++) {
            if (dx === 0 && dy === 0) continue; // Skip the center position
            result.push({ x: dx, y: dy });
        }
    }
    return result;
}