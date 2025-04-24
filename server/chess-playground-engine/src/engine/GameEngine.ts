import { Board } from '../board/Board';
import { GameEventDispatcher } from '../events/GameEventDispatcher';
import { PieceFactory } from '../pieces/PieceFactory';
import { Position } from '../utils/position';
import { MoveValidator } from '../validation/MoveValidator';
import { Piece } from '../pieces/Piece';
import { EventContext } from '../events/EventContext';
import { GameEventType } from '../events/GameEventType';
import { IAbility } from '../abilities/IAbility';
import { PieceBlueprint } from '../pieces/Blueprint'; // Import PieceBlueprint

/**
 * Orchestrates the main game logic, managing turns, piece movements, and attacks.
 */
class GameEngine {
    private dispatcher: GameEventDispatcher;
    private board: Board;
    private pieceFactory: PieceFactory;
    private moveValidator: MoveValidator;
    private pieces: Map<string, Piece> = new Map();
    private boardSize = { width: 8, height: 8 }; // Standard chess board size
    private teams: string[] = ['white', 'black']; // Define game teams
    private currentPlayerTeam: string | null = null; // Track the current player's team
    private turnNumber: number = 0;

    /**
     * Initializes the game engine.
     */
    public constructor() {
        this.dispatcher = new GameEventDispatcher();
        // Initialize board with specific dimensions
        this.board = new Board(this.boardSize.width, this.boardSize.height);
        this.pieceFactory = new PieceFactory();
        this.moveValidator = new MoveValidator(this.board, this.dispatcher);
    }

    /**
     * Starts the game, setting the first player.
     * @param startingTeam The team that starts the game. Defaults to the first team in the `teams` array.
     */
    public startGame(startingTeam?: string): void {
        if (this.teams.length === 0) {
            console.error("Cannot start game: No teams defined.");
            return;
        }
        this.currentPlayerTeam = startingTeam && this.teams.includes(startingTeam) ? startingTeam : this.teams[0];
        this.turnNumber = 1;
        console.log(`Game started. Turn ${this.turnNumber}: ${this.currentPlayerTeam}'s turn.`);

        // Dispatch OnGameStart event
        const startContext = new EventContext(GameEventType.OnGameStart, null, null, this.board, null, null);
        startContext.payload['startingTeam'] = this.currentPlayerTeam;
        this.dispatcher.dispatch(GameEventType.OnGameStart, startContext);

        // Dispatch initial OnTurnStart event
        const turnContext = new EventContext(GameEventType.OnTurnStart, null, null, this.board, null, null);
        turnContext.payload['currentTeam'] = this.currentPlayerTeam;
        turnContext.payload['turnNumber'] = this.turnNumber;
        this.dispatcher.dispatch(GameEventType.OnTurnStart, turnContext);
    }

    /**
     * Ends the current turn and advances to the next player.
     */
    private endTurn(): void {
        if (!this.currentPlayerTeam || this.teams.length < 2) {
            console.warn("Cannot end turn: Game not started or insufficient teams.");
            return;
        }

        const currentIndex = this.teams.indexOf(this.currentPlayerTeam);
        const nextIndex = (currentIndex + 1) % this.teams.length;
        this.currentPlayerTeam = this.teams[nextIndex];

        // Increment turn number only when the cycle restarts (e.g., back to white)
        if (nextIndex === 0) {
            this.turnNumber++;
        }

        console.log(`Turn ended. Starting Turn ${this.turnNumber}: ${this.currentPlayerTeam}'s turn.`);

        // Dispatch OnTurnStart event for the new turn
        const turnContext = new EventContext(GameEventType.OnTurnStart, null, null, this.board, null, null);
        turnContext.payload['currentTeam'] = this.currentPlayerTeam;
        turnContext.payload['turnNumber'] = this.turnNumber;
        this.dispatcher.dispatch(GameEventType.OnTurnStart, turnContext);
    }

    /**
     * Adds a piece to the game.
     * @param blueprintString The blueprint string for the piece.
     * @param team The team of the piece.
     * @param pos The position of the piece.
     * @returns The added piece.
     * @throws Error if placing the piece fails.
     */
    public addPiece(blueprintString: string, team: string, pos: Position): Piece {
        let blueprint: PieceBlueprint;
        try {
            // Parse the blueprint string into an object
            blueprint = JSON.parse(blueprintString);
        } catch (error) {
            console.error(`Failed to parse blueprint string: ${error}`);
            throw new Error(`Invalid blueprint JSON: ${blueprintString}`);
        }

        // Validate team
        if (!this.teams.includes(team)) {
            console.warn(`Adding piece with unrecognized team "${team}". Make sure it's intended or add it to GameEngine.teams.`);
        }

        // Create piece using the factory (which handles orientation)
        const piece = this.pieceFactory.createPiece(blueprint, team, pos);

        // Place piece on the board
        try {
            this.board.placePiece(piece, pos);
        } catch (error) {
            console.error(`Failed to place piece ${piece.getId()} at ${JSON.stringify(pos)}: ${error}`);
            throw error; // Re-throw error after logging
        }

        this.pieces.set(piece.getId(), piece);

        // Subscribe piece abilities to events
        piece.getAbilities().forEach((ability: IAbility) => {
            ability.triggers.forEach((eventType: GameEventType) => {
                // Ensure priority is handled, default to 0 if not present
                const priority = typeof (ability as any).priority === 'number' ? (ability as any).priority : 0;
                this.dispatcher.subscribe(eventType, ability, priority);
            });
        });
        console.log(`Added piece ${piece.getId()} (${piece.getName()}) for team ${team} at ${JSON.stringify(pos)}`);
        return piece;
    }

    /**
     * Moves a piece to a new, empty position on the board after validation.
     * Assumes the target square is empty, as validated by MoveValidator.validateMove.
     * @param pieceId The ID of the piece to move.
     * @param to The target position (must be empty).
     * @returns True if the move was successful, false otherwise.
     */
    public movePiece(pieceId: string, to: Position): boolean {
        const piece = this.pieces.get(pieceId);
        if (!piece) {
            console.error(`Move failed: Piece with ID ${pieceId} not found.`);
            return false;
        }

        // Check if it's the correct player's turn
        if (piece.getTeam() !== this.currentPlayerTeam) {
            console.log(`Move failed: It's ${this.currentPlayerTeam}'s turn, not ${piece.getTeam()}'s.`);
            return false;
        }

        const from = piece.getPosition();

        // Validate the move to an empty square
        if (!this.moveValidator.validateMove(piece, to)) {
            console.log(`Move validation failed for piece ${pieceId} from ${JSON.stringify(from)} to ${JSON.stringify(to)}.`);
            return false;
        }

        // Dispatch OnMoveStart - targetPiece is null because validateMove ensures 'to' is empty
        const startContext = new EventContext(GameEventType.OnMoveStart, piece, null, this.board, from, to);
        this.dispatcher.dispatch(GameEventType.OnMoveStart, startContext);
        if (startContext.isCancelled()) {
            console.log(`Move cancelled by ability during ${GameEventType.OnMoveStart}.`);
            return false;
        }

        // Perform the move
        try {
            this.board.removePiece(from);
            this.board.placePiece(piece, to);
            piece.setPosition(to);
        } catch (error) {
            console.error(`Error during move execution for piece ${pieceId}: ${error}`);
            // Attempt to revert state? This might be complex. For now, log and return false.
            // Consider adding state restoration logic if needed.
            // Example: Try placing the piece back at 'from'.
            try { this.board.placePiece(piece, from); piece.setPosition(from); } catch (revertError) { console.error("Failed to revert board state after move error."); }
            return false;
        }

        console.log(`Piece ${pieceId} moved from ${JSON.stringify(from)} to ${JSON.stringify(to)}.`);

        // Dispatch OnMoveEnd
        const endContext = new EventContext(GameEventType.OnMoveEnd, piece, null, this.board, from, to);
        this.dispatcher.dispatch(GameEventType.OnMoveEnd, endContext);

        // End the turn after a successful move
        this.endTurn();

        return true;
    }

    /**
     * Performs an action (e.g., attack) from a source piece to a target position.
     * @param pieceId The ID of the piece performing the action.
     * @param targetPos The position being targeted.
     * @param actionName The name of the action (e.g., 'attack').
     * @returns True if the action was successful, false otherwise.
     */
    public performAction(pieceId: string, targetPos: Position, actionName: string): boolean {
        const piece = this.pieces.get(pieceId);
        if (!piece) {
            console.error(`Action failed: Piece with ID ${pieceId} not found.`);
            return false;
        }

        // Check if it's the correct player's turn
        if (piece.getTeam() !== this.currentPlayerTeam) {
            console.log(`Action failed: It's ${this.currentPlayerTeam}'s turn, not ${piece.getTeam()}'s.`);
            return false;
        }

        const targetPiece = this.board.getPieceAt(targetPos);

        // 1. Validate the action targeting
        if (!this.moveValidator.validateActionTarget(piece, targetPos, actionName)) {
            console.log(`Action validation failed for piece ${pieceId} targeting ${JSON.stringify(targetPos)} with action ${actionName}.`);
            return false;
        }

        // 2. Dispatch pre-action event
        const startContext = new EventContext(
            GameEventType.OnActionStart,
            piece,
            targetPiece, // targetPiece might be null if targeting an empty square (if allowed by action)
            this.board,
            piece.getPosition(),
            targetPos,
            actionName
        );
        this.dispatcher.dispatch(GameEventType.OnActionStart, startContext);
        if (startContext.isCancelled()) {
            console.log(`Action cancelled by ability during OnActionStart.`);
            return false;
        }

        // Re-fetch targetPiece in case it was modified by OnActionStart listeners
        const currentTargetPiece = this.board.getPieceAt(targetPos);
        let gameOverInfo: { losingTeam: string } | null = null; // Store potential game over info

        // 3. Apply action effects (e.g., capture for 'attack')
        // This section needs to be more robust based on 'actionName'
        if (actionName === 'attack' && currentTargetPiece) {
            console.log(`Piece ${currentTargetPiece.getId()} targeted for capture by ${pieceId} at ${JSON.stringify(targetPos)}.`);

            // Dispatch OnCapture event BEFORE removing the piece
            const captureContext = new EventContext(
                GameEventType.OnCapture,
                currentTargetPiece, // Source is the piece being captured
                piece,              // Target is the attacker
                this.board,
                targetPos,          // from/to might represent the attack location
                targetPos,
                actionName
            );
            this.dispatcher.dispatch(GameEventType.OnCapture, captureContext);

            // Check if capture was cancelled (e.g., by an ability like Guard)
            if (captureContext.isCancelled()) {
                console.log(`Capture of ${currentTargetPiece.getId()} cancelled.`);
                // Potentially end turn even if capture is cancelled? Depends on rules.
                // For now, assume cancelled action doesn't end turn.
                return false;
            }

            // Check for game over condition triggered by King capture
            if (captureContext.payload['gameOverTriggered']) {
                gameOverInfo = { losingTeam: captureContext.payload['losingTeam'] };
                console.log(`Game Over condition triggered! Team ${gameOverInfo.losingTeam} lost.`);
                // Don't dispatch game over yet, let the action complete first.
            }

            // If not cancelled, remove the captured piece
            this.removePiece(currentTargetPiece.getId());
            console.log(`Piece ${currentTargetPiece.getId()} successfully captured.`);

            // Potentially move the attacking piece into the captured square if rules allow (like standard chess)
            // This would involve calling movePiece AFTER the capture, if the square is now empty.
            // Example: if (this.board.getPieceAt(targetPos) === null) { this.movePieceAfterCapture(pieceId, targetPos); }
            // Note: A simple movePiece call here would trigger another turn end. Need careful handling.
            // Let's skip attacker movement for now.

        } else if (actionName === 'attack' && !currentTargetPiece) {
            console.log(`Attack action by ${pieceId} targeted an empty square ${JSON.stringify(targetPos)}. Action completed without capture.`);
            // Still counts as a valid action, proceed to end turn.
        }
        // TODO: Add logic for other actionNames like 'heal', 'buff', etc.
        else {
            console.log(`Action ${actionName} by ${pieceId} completed. Target: ${JSON.stringify(targetPos)}`);
        }

        // 4. Dispatch post-action event
        // Use board.getPieceAt again in case the piece moved or was created during the action
        const finalTargetPiece = this.board.getPieceAt(targetPos);
        const endContext = new EventContext(
            GameEventType.OnActionEnd,
            piece,
            finalTargetPiece,
            this.board,
            piece.getPosition(), // piece's position might have changed if it moved after capture
            targetPos,
            actionName
        );
        this.dispatcher.dispatch(GameEventType.OnActionEnd, endContext);

        console.log(`Action ${actionName} by ${pieceId} targeting ${JSON.stringify(targetPos)} fully completed.`);

        // 5. Handle Game Over dispatch AFTER action completes
        if (gameOverInfo) {
            const gameOverCtx = new EventContext(GameEventType.OnGameOver, null, null, this.board, null, null);
            gameOverCtx.payload['losingTeam'] = gameOverInfo.losingTeam;
            this.dispatcher.dispatch(GameEventType.OnGameOver, gameOverCtx);
            console.log("OnGameOver event dispatched.");
            // Game is over, do not proceed to end turn or further actions might be blocked by listeners.
            // Consider setting a game state flag like `this.isGameOver = true;`
            return true; // Action led to game over
        }

        // 6. End the turn after a successful action
        this.endTurn();

        return true;
    }

    /**
     * Removes a piece from the game, unsubscribing its abilities.
     * @param pieceId The ID of the piece to remove.
     */
    private removePiece(pieceId: string): void {
        const piece = this.pieces.get(pieceId);
        if (piece) {
            console.log(`Removing piece ${pieceId} (${piece.getName()}) from team ${piece.getTeam()} at ${JSON.stringify(piece.getPosition())}...`);
            // Unsubscribe abilities BEFORE removing from board/map
            piece.getAbilities().forEach((ability: IAbility) => {
                ability.triggers.forEach((eventType: GameEventType) => {
                    this.dispatcher.unsubscribe(eventType, ability);
                });
            });
            try {
                this.board.removePiece(piece.getPosition());
            } catch (error) {
                console.error(`Error removing piece ${pieceId} from board: ${error}`);
                // Continue trying to remove from pieces map anyway
            }
            this.pieces.delete(pieceId);
            console.log(`Piece ${pieceId} removed successfully.`);
        } else {
            console.warn(`Attempted to remove non-existent piece with ID ${pieceId}.`);
        }
    }

    // --- Getters for game state (optional) ---
    public getCurrentPlayerTeam(): string | null {
        return this.currentPlayerTeam;
    }

    public getTurnNumber(): number {
        return this.turnNumber;
    }

    public getPieceById(pieceId: string): Piece | undefined {
        return this.pieces.get(pieceId);
    }

    public getAllPieces(): Piece[] {
        return Array.from(this.pieces.values());
    }

    public getBoard(): Board {
        return this.board; // Provide read-only access if necessary
    }
}

export { GameEngine };