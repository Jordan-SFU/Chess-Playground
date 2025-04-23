import { Position } from '../utils/position';
import { BoardCell } from './BoardCell';
import { Piece } from '../pieces/Piece';

/**
 * Represents the game board, managing the placement and retrieval of pieces in cells.
 */
class Board {
    /**
     * A map storing the cells of the board, keyed by their position.
     */
    private cells: Map<Position, BoardCell>;

    public constructor() {
        this.cells = new Map<Position, BoardCell>();
    }

    /**
     * Retrieves the cell at the specified position.
     * @param pos The position of the cell to retrieve.
     * @returns The BoardCell at the given position.
     */
    public getCell(pos: Position): BoardCell {
        const cell = this.cells.get(pos);
        if (!cell) {
            throw new Error(`Cell at position ${pos} does not exist.`);
        }
        return cell;
    }

    /**
     * Places a piece onto the board at the specified position.
     * @param piece The piece to place.
     * @param pos The position to place the piece at.
     */
    public placePiece(piece: Piece, pos: Position): void {
        const cell = this.getCell(pos);
        if (cell) {
            cell.setPiece(piece);
        } else {
            throw new Error(`Cell at position ${pos} does not exist.`);
        }
    }

    /**
     * Removes a piece from the specified position on the board.
     * @param pos The position to remove the piece from.
     */
    public removePiece(pos: Position): void {
        const cell = this.getCell(pos);
        if (cell) {
            cell.setPiece(null);
        } else {
            throw new Error(`Cell at position ${pos} does not exist.`);
        }

    }
}

export { Board };