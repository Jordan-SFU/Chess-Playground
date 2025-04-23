// test/utils.ts
import { Position } from '../src/utils/position';

/**
 * Render a fixed 16×16 grid (from x=-8…7, y=7…-8), highlight origin with "X",
 * mark offsets with "■", empty with ".". Includes axis labels.
 */
export function renderGrid(
  offsets: Position[]
): string {
  const min = -7;
  const max = 7;

  const coords = (n: number) =>
    (n >= 0 ? ` ${n}` : n.toString()); // pad positives to width 2

  let out = '';

  // Header: X-axis labels
  out += '   '; // 3 spaces for Y-axis label column
  for (let x = min; x <= max; x++) {
    out += coords(x) + ' ';
  }
  out += '\n';

  // Rows: Y-axis label + cells
  for (let y = max; y >= min; y--) {
    out += coords(y) + ' '; // Y-axis label + space
    for (let x = min; x <= max; x++) {
      if (x === 0 && y === 0) {
        out += 'X  ';
      } else if (offsets.some(o => o.x === x && o.y === y)) {
        out += '■  ';
      } else {
        out += '.  ';
      }
    }
    out += '\n';
  }

  return out;
}
