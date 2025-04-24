import { Position } from "./position";

/**
 * Vertically flips a list of position offsets.
 * Maps { x, y } to { x, -y }.
 * @param offsets An array of Position objects.
 * @returns A new array with vertically flipped Position objects.
 */
export function flipVertical(offsets: Position[]): Position[] {
    return offsets.map(offset => ({
        x: offset.x,
        y: -offset.y,
    }));
}