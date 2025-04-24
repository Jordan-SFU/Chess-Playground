import { Position } from "./position";

/**
 * Calculates the positions along a straight line (horizontal, vertical, or diagonal)
 * between two points, excluding the start and end points.
 * Returns an empty array if the path is not a straight line or is adjacent.
 * @param start The starting position.
 * @param end The ending position.
 * @returns An array of positions representing the path between start and end.
 */
export function getPathBetween(start: Position, end: Position): Position[] {
    const path: Position[] = [];
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const stepX = Math.sign(dx);
    const stepY = Math.sign(dy);

    // Check if it's a straight line (horizontal, vertical, or diagonal)
    const isStraightLine = dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy);

    if (!isStraightLine) {
        // Not a straight line path that pieces typically follow (like Rook, Bishop, Queen)
        // For Knight-like moves or other complex shapes, path blocking isn't checked this way.
        return [];
    }

    let currentX = start.x + stepX;
    let currentY = start.y + stepY;

    // Iterate until we reach the end position
    while (currentX !== end.x || currentY !== end.y) {
        // Check bounds just in case, though board.isValidPosition should handle this elsewhere
        // This function focuses only on the path geometry.
        path.push({ x: currentX, y: currentY });
        currentX += stepX;
        currentY += stepY;
    }

    return path;
}
