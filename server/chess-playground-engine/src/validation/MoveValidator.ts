import { Board } from "../board/Board";
import { Piece } from "../pieces/Piece";
import { Position } from "../utils/position";
import { GameEventDispatcher } from "../events/GameEventDispatcher";
import { EventContext } from "../events/EventContext";
import { GameEventType } from "../events/GameEventType";
import { getPathBetween } from "../utils/path"; // Assuming path utility exists

/**
 * Validates piece movements and actions based on game rules, board state, and piece abilities.
 */
export class MoveValidator {
    private board: Board;
    private dispatcher: GameEventDispatcher;

    constructor(board: Board, dispatcher: GameEventDispatcher) {
        this.board = board;
        this.dispatcher = dispatcher;
    }

    /**
     * Validates a potential move (to an empty square) for a given piece.
     * @param piece The piece attempting to move.
     * @param to The target position.
     * @returns True if the move is valid, false otherwise.
     */
    public validateMove(piece: Piece, to: Position): boolean {
        const from = piece.getPosition();

        // 1. Basic Checks
        if (!this.board.isValidPosition(to)) {
            console.log(`Move invalid: Target position ${JSON.stringify(to)} is off board.`);
            return false;
        }
        if (from.x === to.x && from.y === to.y) {
            console.log(`Move invalid: Target position ${JSON.stringify(to)} is same as source.`);
            return false;
        }

        // 2. Check if 'to' is a potential movement target based on shape
        // TODO: Consider team orientation for movement shapes
        const potentialTargets = piece.getPotentialMovementTargets();
        if (!potentialTargets.some(target => target.x === to.x && target.y === to.y)) {
            console.log(`Move invalid: Target ${JSON.stringify(to)} not in movement shape.`);
            return false;
        }

        // 3. Dispatch OnMoveValidate event for abilities to hook into
        const context = new EventContext(
            GameEventType.OnMoveValidate,
            piece,
            null, // Target piece is null for a move validation
            this.board,
            from,
            to
        );
        this.dispatcher.dispatch(GameEventType.OnMoveValidate, context);

        // 4. Check if an ability cancelled the move
        if (context.isCancelled()) {
            console.log(`Move invalid: Cancelled by ability during ${GameEventType.OnMoveValidate}.`);
            return false;
        }

        // 5. Path Blocking Check (unless ignored by an ability like Jumping)
        const ignorePathBlocking = context.getValidationFlag('ignorePathBlocking') === true;
        if (!ignorePathBlocking) {
            const path = getPathBetween(from, to);
            for (const pos of path) {
                if (this.board.isOccupied(pos)) {
                    console.log(`Move invalid: Path blocked at ${JSON.stringify(pos)}.`);
                    return false; // Path is blocked
                }
            }
        }

        // 6. Target Cell Occupancy Check - MUST be empty for a move
        const targetPiece = this.board.getPieceAt(to);
        if (targetPiece) {
            console.log(`Move invalid: Target cell ${JSON.stringify(to)} is occupied.`);
            return false; // Cannot move to an occupied cell
        }

        // If all checks pass, the move is valid
        console.log(`Move valid: ${piece.getId()} from ${JSON.stringify(from)} to ${JSON.stringify(to)}`);
        return true;
    }

    /**
     * Validates a potential action from a source piece to a target position.
     * @param sourcePiece The piece performing the action.
     * @param targetPos The position being targeted by the action.
     * @param actionName The name of the action (e.g., 'attack', 'heal').
     * @returns True if the action targeting is valid, false otherwise.
     */
    public validateActionTarget(sourcePiece: Piece, targetPos: Position, actionName: string): boolean {
        const from = sourcePiece.getPosition();
        const targetPiece = this.board.getPieceAt(targetPos);

        // 1. Basic Checks
        if (!this.board.isValidPosition(targetPos)) {
            console.log(`Action invalid: Target position ${JSON.stringify(targetPos)} is off board.`);
            return false;
        }
        // Allow targeting self only if explicitly permitted by abilities
        if (from.x === targetPos.x && from.y === targetPos.y && !targetPiece) {
             // This case should ideally not happen if targetPos has the source piece
             console.warn(`Action validation: Targeting self position but no piece found?`);
             return false; // Cannot target own empty square generally
        }

        // 2. Check if 'targetPos' is a potential action target based on shape
        // TODO: Consider team orientation for action shapes
        const potentialTargets = sourcePiece.getPotentialActionTargets(); // Assumes this method exists
        if (!potentialTargets.some(target => target.x === targetPos.x && target.y === targetPos.y)) {
            console.log(`Action invalid: Target ${JSON.stringify(targetPos)} not in action shape for ${actionName}.`);
            return false;
        }

        // 3. Dispatch OnActionValidate event for abilities to hook into
        const context = new EventContext(
            GameEventType.OnActionValidate,
            sourcePiece,
            targetPiece, // Pass the target piece
            this.board,
            from,
            targetPos, // Use targetPos as 'moveTo' for action context
            actionName
        );
        this.dispatcher.dispatch(GameEventType.OnActionValidate, context);

        // 4. Check if an ability cancelled the action
        if (context.isCancelled()) {
            console.log(`Action invalid: Cancelled by ability during ${GameEventType.OnActionValidate}.`);
            return false;
        }

        // 5. Standard Targeting Rule Checks (unless ignored)
        const ignoreTargetingRules = context.getValidationFlag('ignoreTargetingRules') === true;
        if (!ignoreTargetingRules) {
            const allowTargetSelf = context.getValidationFlag('allowTargetSelf') === true;
            const allowTargetAlly = context.getValidationFlag('allowTargetAlly') === true;
            const allowTargetEnemy = context.getValidationFlag('allowTargetEnemy') === true;

            if (targetPiece) {
                const isSelf = targetPiece.getId() === sourcePiece.getId();
                const isAlly = targetPiece.getTeam() === sourcePiece.getTeam() && !isSelf;
                const isEnemy = targetPiece.getTeam() !== sourcePiece.getTeam();

                if (isSelf && !allowTargetSelf) {
                    console.log(`Action invalid: Cannot target self.`);
                    return false;
                }
                if (isAlly && !allowTargetAlly) {
                    console.log(`Action invalid: Cannot target ally.`);
                    return false;
                }
                if (isEnemy && !allowTargetEnemy) {
                    console.log(`Action invalid: Cannot target enemy.`);
                    return false;
                }
            } else {
                // Generally, actions target pieces. Targeting empty squares might be
                // allowed by specific abilities setting 'ignoreTargetingRules'.
                console.log(`Action invalid: Target square ${JSON.stringify(targetPos)} is empty.`);
                return false;
            }
        }

        // Path blocking for actions? Usually not, but could be added via abilities if needed.

        console.log(`Action valid: ${sourcePiece.getId()} targeting ${targetPiece ? targetPiece.getId() : JSON.stringify(targetPos)} with ${actionName}`);
        return true;
    }
}
