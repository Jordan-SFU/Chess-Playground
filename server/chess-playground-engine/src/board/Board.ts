import { Position } from '../utils/position';
import { BoardCell } from './BoardCell';
import { Piece } from '../pieces/Piece';

/**
 * Represents the game board, managing the placement and retrieval of pieces in cells.
 */
class Board {
    /**
     * A map storing the cells of the board, keyed by a string representation of their position.
     */
    private cells: Map<string, BoardCell> = new Map();
    private width: number = 0;
    private height: number = 0;

    /**
     * Initializes the board, optionally creating cells for a given width and height.
     * @param width The width of the board.
     * @param height The height of the board.
     */
    public constructor(width?: number, height?: number) {
        if (width !== undefined && height !== undefined) {
            this.initializeBoard(width, height);
        }
    }

    /**
     * Creates the grid of BoardCells for the specified dimensions.
     * Assumes standard chess coordinate system (e.g., (0,0) to (width-1, height-1)).
     * @param width The width of the board.
     * @param height The height of the board.
     */
    public initializeBoard(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.cells.clear(); // Clear existing cells if any
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pos: Position = { x, y };
                this.cells.set(this.posToString(pos), new BoardCell(pos));
            }
        }
        console.log(`Board initialized with size ${width}x${height}. Total cells: ${this.cells.size}`);
    }

    /**
     * Converts a Position object to a string key.
     * @param pos The position object.
     * @returns A string representation (e.g., "x,y").
     */
    private posToString(pos: Position): string {
        return `${pos.x},${pos.y}`;
    }

    /**
     * Retrieves the cell at the specified position.
     * @param pos The position of the cell to retrieve.
     * @returns The BoardCell at the given position, or undefined if it doesn't exist.
     */
    public getCell(pos: Position): BoardCell | undefined {
        return this.cells.get(this.posToString(pos));
    }

    /**
     * Places a piece onto the board at the specified position.
     * @param piece The piece to place.
     * @param pos The position to place the piece at.
     * @throws Error if the position is invalid or the cell does not exist.
     */
    public placePiece(piece: Piece, pos: Position): void {
        if (!this.isValidPosition(pos)) {
             throw new Error(`Cannot place piece: Position ${JSON.stringify(pos)} is outside board bounds (0-${this.width-1}, 0-${this.height-1}).`);
        }
        const cell = this.getCell(pos);
        if (cell) {
            if (cell.isOccupied()) {
                console.warn(`Warning: Placing piece ${piece.getId()} at ${JSON.stringify(pos)} which is already occupied by ${cell.getPiece()?.getId()}. Overwriting.`);
            }
            cell.setPiece(piece);
        } else {
            // This should theoretically not happen if isValidPosition is checked first
            throw new Error(`Cannot place piece: Cell at position ${JSON.stringify(pos)} does not exist.`);
        }
    }

    /**
     * Removes a piece from the specified position on the board.
     * @param pos The position to remove the piece from.
     * @throws Error if the position is invalid or the cell does not exist.
     */
    public removePiece(pos: Position): void {
         if (!this.isValidPosition(pos)) {
             throw new Error(`Cannot remove piece: Position ${JSON.stringify(pos)} is outside board bounds.`);
        }
        const cell = this.getCell(pos);
        if (cell) {
            if (!cell.isOccupied()) {
                 console.warn(`Warning: Attempting to remove piece from empty cell at ${JSON.stringify(pos)}.`);
            }
            cell.setPiece(null);
        } else {
             // This should theoretically not happen if isValidPosition is checked first
            throw new Error(`Cannot remove piece: Cell at position ${JSON.stringify(pos)} does not exist.`);
        }
    }

    /**
     * Checks if a cell at the specified position is occupied by a piece.
     * @param pos The position to check.
     * @returns True if the cell at the position exists and is occupied, false otherwise.
     */
    public isOccupied(pos: Position): boolean {
        const cell = this.getCell(pos);
        return cell ? cell.isOccupied() : false;
    }

    /**
     * Retrieves the piece at the specified position, if any.
     * @param pos The position to check.
     * @returns The Piece at the position, or null if the cell is empty or invalid.
     */
    public getPieceAt(pos: Position): Piece | null {
        const cell = this.getCell(pos);
        return cell ? cell.getPiece() : null;
    }

    /**
     * Checks if a position is within the board boundaries.
     * @param pos The position to check.
     * @returns True if the position is within the board, false otherwise.
     */
    public isValidPosition(pos: Position): boolean {
        // Check against initialized dimensions
        return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
    }
}

export { Board };