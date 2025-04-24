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
     * The name of the action being performed (relevant for action-related events).
     */
    private actionName?: string;
    /**
     * Parameters associated with the action being performed.
     */
    private actionParams?: Record<string, any>;
    /**
     * Flag indicating if the event has been cancelled by a listener.
     */
    private cancelled: boolean = false;
    /**
     * Flags that can be modified by listeners to alter subsequent game logic (e.g., validation).
     */
    private validationFlags: Record<string, any> = {};
    /**
     * Data payload that abilities can add to or read from.
     */
    public payload: Record<string, any> = {};

    /**
     * Initializes the event context with relevant information about the game event.
     * @param eventType The type of game event that occurred.
     * @param sourcePiece The piece that initiated or is the primary subject of the event.
     * @param targetPiece The piece being targeted by the event (e.g., in an attack).
     * @param board Reference to the current state of the game board.
     * @param moveFrom The starting position related to the event (e.g., for a move).
     * @param moveTo The ending position related to the event (e.g., for a move).
     * @param actionName Optional: The name of the action being performed.
     * @param actionParams Optional: Parameters for the action.
     */
    public constructor(
        eventType: GameEventType,
        sourcePiece: Piece | null,
        targetPiece: Piece | null,
        board: Board,
        moveFrom: Position | null,
        moveTo: Position | null,
        actionName?: string,
        actionParams?: Record<string, any>
    ) {
        this.eventType = eventType;
        this.sourcePiece = sourcePiece;
        this.targetPiece = targetPiece;
        this.board = board;
        this.moveFrom = moveFrom;
        this.moveTo = moveTo;
        this.actionName = actionName;
        this.actionParams = actionParams;

        // Default validation flags for actions
        if (eventType === GameEventType.OnActionValidate) {
            this.validationFlags['allowTargetSelf'] = false;
            this.validationFlags['allowTargetAlly'] = false;
            this.validationFlags['allowTargetEnemy'] = true; // Default: can target enemies
            this.validationFlags['ignoreTargetingRules'] = false; // Abilities can set this to bypass standard checks
        }
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

    /**
     * Sets a validation flag. Abilities can use this during OnMoveValidate
     * to signal changes to the validation logic (e.g., ignorePathBlocking).
     * @param flag The name of the flag (e.g., 'ignorePathBlocking').
     * @param value The value to set (e.g., true).
     */
    public setValidationFlag(flag: string, value: any): void {
        this.validationFlags[flag] = value;
    }

    /**
     * Gets the value of a validation flag.
     * @param flag The name of the flag.
     * @returns The value of the flag, or undefined if not set.
     */
    public getValidationFlag(flag: string): any {
        return this.validationFlags[flag];
    }

    // Add getters for private properties if needed
    public getEventType(): GameEventType { return this.eventType; }
    public getSourcePiece(): Piece | null { return this.sourcePiece; }
    public getTargetPiece(): Piece | null { return this.targetPiece; }
    public getBoard(): Board { return this.board; }
    public getMoveFrom(): Position | null { return this.moveFrom; }
    public getMoveTo(): Position | null { return this.moveTo; }
    public getActionName(): string | undefined { return this.actionName; }
    public getActionParams(): Record<string, any> | undefined { return this.actionParams; }
}

export { EventContext };