import { Position } from "../../utils/position";

export function point(delta: Position): Position {
    return { x: delta.x, y: delta.y };
}