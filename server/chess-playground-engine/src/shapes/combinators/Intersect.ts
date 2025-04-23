import { Position } from "../../utils/position";

export function intersect(...lists: Position[][]): Position[] {
    const result: Position[] = [];

    if (lists.length === 0) return result;

    const firstList = lists[0];
    for (const item of firstList) {
        if (lists.every((list) => list.some((pos) => pos.x === item.x && pos.y === item.y))) {
            result.push(item);
        }
    }
    return result;
}