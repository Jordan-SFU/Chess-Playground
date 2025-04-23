import { Board } from '../board/Board';
import { GameEventDispatcher } from '../events/GameEventDispatcher';
import { PieceFactory } from '../pieces/PieceFactory';
import { Position } from '../utils/position';

/**
 * Orchestrates the main game logic, managing turns, piece movements, and attacks.
 */
class GameEngine {
    private dispatcher: GameEventDispatcher;
    private board: Board;
    private pieceFactory: PieceFactory;

    /**
     * Initializes the game engine.
     */
    public constructor() {
        this.dispatcher = new GameEventDispatcher();
        this.board = new Board();
        this.pieceFactory = new PieceFactory();
    }

    /**
     * Starts the turn for a specific player.
     * @param playerID The ID of the player whose turn is starting.
     */
    public startTurn(playerID: string): void {

    }

    /**
     * Ends the current turn.
     */
    public endTurn(): void {

    }

    /**
     * Moves a piece to a new position on the board.
     * @param pieceID The ID of the piece to move.
     * @param to The target position.
     */
    public movePiece(pieceID: string, to: Position): void {
    
    }

    /**
     * Initiates an attack from one piece to another.
     * @param attackerID The ID of the attacking piece.
     * @param targetID The ID of the target piece.
     */
    public attack(attackerID: string, targetID: string): void {
    
    }
}

export { GameEngine };