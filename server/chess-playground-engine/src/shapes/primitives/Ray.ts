import { Position } from "../../utils/position";
import { Direction } from "../../utils/direction";

const DIR_VECTORS: Record<Direction, Position> = {
    N: { x: 0, y: 1 },
    NE: { x: 1, y: 1 },
    E: { x: 1, y: 0 },
    SE: { x: 1, y: -1 },
    S: { x: 0, y: -1 },
    SW: { x: -1, y: -1 },
    W: { x: -1, y: 0 },
    NW: { x: -1, y: 1 },
};

export function ray(
    dirs: Direction[],
    min: number = 1,
    max: number = 8
): Position[] {
    const result: Position[] = [];
    for (const dir of dirs) {
        const vec = DIR_VECTORS[dir];
        for (let dist = min; dist <= max; dist++) {
            result.push({
                x: vec.x * dist,
                y: vec.y * dist,
            });
        }
    }
    return result;
}
