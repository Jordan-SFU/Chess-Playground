import { Board } from "../board/Board";
import { Piece } from "../pieces/Piece";
import { Position } from "../utils/position";
import { GameEventType } from "./GameEventType";

/**
 * Contains contextual information about a game event being dispatched.
 */
class EventContext {
    /**
     * The type of game event that occurred.
     */
    private eventType: GameEventType;
    /**
     * The piece that initiated or is the primary subject of the event.
     */
    private sourcePiece: Piece | null;
    /**
     * The piece being targeted by the event (e.g., in an attack).
     */
    private targetPiece: Piece | null;
    /**
     * Reference to the current state of the game board.
     */
    private board: Board;
    /**
     * The starting position related to the event (e.g., for a move).
     */
    private moveFrom: Position | null;
    /**
     * The ending position related to the event (e.g., for a move).
     */
    private moveTo: Position | null;
    /**
     * Flag indicating if the event has been cancelled by a listener.
     */
    private cancelled: boolean = false;

    /**
     * Initializes the event context with relevant information about the game event.
     * @param eventType The type of game event that occurred.
     * @param sourcePiece The piece that initiated or is the primary subject of the event.
     * @param targetPiece The piece being targeted by the event (e.g., in an attack).
     * @param board Reference to the current state of the game board.
     * @param moveFrom The starting position related to the event (e.g., for a move).
     * @param moveTo The ending position related to the event (e.g., for a move).
     */
    public constructor(
        eventType: GameEventType,
        sourcePiece: Piece | null,
        targetPiece: Piece | null,
        board: Board,
        moveFrom: Position | null,
        moveTo: Position | null) {
        this.eventType = eventType;
        this.sourcePiece = sourcePiece;
        this.targetPiece = targetPiece;
        this.board = board;
        this.moveFrom = moveFrom;
        this.moveTo = moveTo;
    }

    /**
     * Marks the event as cancelled, preventing further processing or default actions.
     */
    public cancel(): void {
        this.cancelled = true;
    }

    /**
     * Checks if the event has been cancelled.
     * @returns True if the event is cancelled, false otherwise.
     */
    public isCancelled(): boolean {
        return this.cancelled;
    }

    // Add getters for private properties if needed
    public getEventType(): GameEventType { return this.eventType; }
    public getSourcePiece(): Piece | null { return this.sourcePiece; }
    public getTargetPiece(): Piece | null { return this.targetPiece; }
    public getBoard(): Board { return this.board; }
    public getMoveFrom(): Position | null { return this.moveFrom; }
    public getMoveTo(): Position | null { return this.moveTo; }
}

export { EventContext };