import { Position } from "../../utils/position";

export function subtract(base: Position[], ...cutters: Position[][]): Position[] {
    const result: Position[] = [];

    for (const basePos of base) {
        let isCut = false;
        for (const cutter of cutters) {
            if (cutter.some((cutPos) => cutPos.x === basePos.x && cutPos.y === basePos.y)) {
                isCut = true;
                break;
            }
        }
        if (!isCut) {
            result.push(basePos);
        }
    }

    return result;
}