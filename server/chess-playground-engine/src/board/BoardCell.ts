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

    /**
     * Retrieves the piece currently in the cell.
     * @returns The piece in the cell, or null if empty.
     */
    public getPiece(): Piece | null {
        return this.piece
    }

    /**
     * Checks if the cell is occupied by a piece.
     * @returns True if the cell is occupied by a piece, false otherwise.
     */
    public isOccupied(): boolean {
        return this.piece !== null
    }
}

export { BoardCell }