import { Position } from "../../utils/position";

export function union(...lists: Position[][]): Position[] {
    const result: Position[] = [];

    for (const list of lists) {
        for (const item of list) {
            if (!result.some((pos) => pos.x === item.x && pos.y === item.y)) {
                result.push(item);
            }
        }
    }
    return result;
}