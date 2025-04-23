import { Position } from "../utils/position";
import { Ability } from "../abilities/IAbility";
import { StatusEffectInstance } from "../status-effects/StatusEffectInstance";

/**
 * Represents a game piece on the board.
 */
class Piece {
    /**
     * Unique identifier for the piece.
     */
    private id: string;
    /**
     * Display name of the piece.
     */
    private name: string;
    /**
     * Emoji representation of the piece.
     */
    private emoji: string;
    /**
     * Current position of the piece on the board.
     */
    private position: Position;
    /**
     * Raw DSL object defining the piece's movement shape.
     */
    private movementShape: Object;
    /**
     * Raw DSL object defining the piece's attack shape.
     */
    private attackShape: Object;
    /**
     * List of abilities possessed by the piece.
     */
    private abilities: Ability[];
    /**
     * List of active status effects applied to the piece.
     */
    private statusEffects: StatusEffectInstance[] = [];

    /**
     * Initializes a new piece with the given properties.
     * @param id Unique identifier for the piece.
     * @param name Display name of the piece.
     * @param emoji Emoji representation of the piece.
     * @param position Current position of the piece on the board.
     * @param movementShape Raw DSL object defining the piece's movement shape.
     * @param attackShape Raw DSL object defining the piece's attack shape.
     * @param abilities List of abilities possessed by the piece.
     */
    public constructor(
        id: string,
        name: string,
        emoji: string,
        position: Position,
        movementShape: Object,
        attackShape: Object,
        abilities: Ability[],
    ) {
        this.id = id;
        this.name = name;
        this.emoji = emoji;
        this.position = position;
        this.movementShape = movementShape;
        this.attackShape = attackShape;
        this.abilities = abilities;
    }

    /**
     * Applies a status effect instance to the piece.
     * @param effect The status effect instance to apply.
     */
    public applyStatus(effect: StatusEffectInstance): void {

    }
}

export { Piece };