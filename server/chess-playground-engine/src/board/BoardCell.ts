import { Position } from "../utils/position"
import { Piece } from "../pieces/Piece"

/**
 * Represents a single cell on the game board.
 */
class BoardCell {
    /**
     * The position of the cell on the board.
     */
    private position: Position;
    /**
     * The piece currently occupying the cell, or null if empty.
     */
    private piece: Piece | null = null

    /**
     * Initializes a cell with a specific position.
     * @param position The position of the cell on the board.
     */
    public constructor(position: Position) {
        this.position = position
    }

    /**
     * Assigns a piece to the cell.
     * @param piece The piece to be placed in the cell.
     */
    public setPiece(piece: Piece | null): void {
        this.piece = piece
    }
}

export { BoardCell }