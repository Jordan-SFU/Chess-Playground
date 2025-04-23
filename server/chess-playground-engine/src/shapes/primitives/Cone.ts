import { Position } from "../../utils/position";
import { Direction } from "../../utils/direction";

/**
 * Generates offsets for a cone shape expanding in a given direction.
 * The cone includes cells (x, y) such that:
 * 1. They are generally in the specified direction `dir` from the origin.
 * 2. The distance `k` along the primary axis is between 1 and `effectiveLength`.
 *    - `effectiveLength` is `length` for cardinal directions.
 *    - `effectiveLength` is `round(length / sqrt(2))` for diagonal directions to approximate equal Euclidean extent.
 * 3. The perpendicular distance `j` (using appropriate grid metrics) is strictly less than `k`.
 * This results in a cone where the layer at distance `k` has width `2k - 1`.
 * Excludes the origin (0,0).
 *
 * @param dir The direction the cone points.
 * @param length The maximum distance along the primary axis for cardinal, or the target Euclidean extent for diagonal.
 * @returns An array of Position offsets.
 */
export function cone(dir: Direction, length: number): Position[] {
    const result = new Set<string>();
    // Adjusted length for diagonals to match Euclidean distance of cardinal cones
    const adjustedLength = Math.max(0, Math.round(length / Math.SQRT2)); // Ensure non-negative

    // Adjust bounding box size for potentially wider diagonal cones (using original length for safety margin)
    const maxCoord = 2 * length;
    for (let x = -maxCoord; x <= maxCoord; x++) {
        for (let y = -maxCoord; y <= maxCoord; y++) {
            if (x === 0 && y === 0) continue; // Exclude origin

            let isInCone = false;
            let k = 0; // Distance along the main axis
            let j = 0; // Perpendicular distance (scaled for diagonals)

            switch (dir) {
                case 'N':
                    k = y;
                    j = Math.abs(x);
                    // Check if y is within range [1, length] and perp distance j is less than main distance k
                    isInCone = y >= 1 && y <= length && j < k;
                    break;
                case 'E':
                    k = x;
                    j = Math.abs(y);
                    // Check if x is within range [1, length] and perp distance j is less than main distance k
                    isInCone = x >= 1 && x <= length && j < k;
                    break;
                case 'S':
                    k = -y;
                    j = Math.abs(x);
                    // Check if -y is within range [1, length] and perp distance j is less than main distance k
                    isInCone = k >= 1 && k <= length && j < k;
                    break;
                case 'W':
                    k = -x;
                    j = Math.abs(y);
                    // Check if -x is within range [1, length] and perp distance j is less than main distance k
                    isInCone = k >= 1 && k <= length && j < k;
                    break;
                case 'NE':
                    // Check if generally NE and not on an axis
                    if (x > 0 && y > 0 && x + y > 0) {
                        // Use rotated grid coordinates logic
                        k = Math.floor((x + y + 1) / 2);
                        j = Math.floor(Math.abs(y - x) / 2);
                        // Check if k is within range [1, adjustedLength] and perp distance j is less than main distance k
                        isInCone = k >= 1 && k <= adjustedLength && j < k;
                    }
                    break;
                case 'SE':
                     // Check if generally SE and not on an axis
                    if (x > 0 && y < 0 && x - y > 0) {
                        // Use rotated grid coordinates logic
                        k = Math.floor((x - y + 1) / 2);
                        j = Math.floor(Math.abs(x + y) / 2);
                        // Check if k is within range [1, adjustedLength] and perp distance j is less than main distance k
                        isInCone = k >= 1 && k <= adjustedLength && j < k;
                    }
                    break;
                case 'SW':
                     // Check if generally SW and not on an axis
                    if (x < 0 && y < 0 && x + y < 0) {
                        // Use rotated grid coordinates logic
                        k = Math.floor((-x - y + 1) / 2);
                        j = Math.floor(Math.abs(x - y) / 2); // abs(x-y) == abs(y-x)
                        // Check if k is within range [1, adjustedLength] and perp distance j is less than main distance k
                        isInCone = k >= 1 && k <= adjustedLength && j < k;
                    }
                    break;
                case 'NW':
                     // Check if generally NW and not on an axis
                    if (x < 0 && y > 0 && y - x > 0) {
                        // Use rotated grid coordinates logic
                        k = Math.floor((-x + y + 1) / 2);
                        j = Math.floor(Math.abs(x + y) / 2);
                        // Check if k is within range [1, adjustedLength] and perp distance j is less than main distance k
                        isInCone = k >= 1 && k <= adjustedLength && j < k;
                    }
                    break;
            }

            if (isInCone) {
                result.add(`${x},${y}`);
            }
        }
    }

    // Convert string keys back to Position objects
    return Array.from(result).map(key => {
        const [x, y] = key.split(',').map(Number);
        return { x, y };
    });
}
