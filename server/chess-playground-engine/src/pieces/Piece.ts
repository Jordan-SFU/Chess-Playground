import { Position } from "../utils/position";
import { IAbility } from "../abilities/IAbility";
import { StatusEffectInstance } from "../status-effects/StatusEffectInstance";
import { Board } from "../board/Board";
import { BoardCell } from "../board/BoardCell"; // Added import

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
     * The team or player the piece belongs to.
     */
    private team: string;
    /**
     * List of Position offsets defining the piece's movement shape.
     */
    private movementShape: Position[];
    /**
     * List of Position offsets defining the piece's attack shape.
     */
    private attackShape: Position[];
    /**
     * List of abilities possessed by the piece.
     */
    private abilities: IAbility[];
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
     * @param team The team the piece belongs to.
     * @param movementShape List of Position offsets defining the piece's movement shape.
     * @param attackShape List of Position offsets defining the piece's attack shape.
     * @param abilities List of abilities possessed by the piece.
     */
    public constructor(
        id: string,
        name: string,
        emoji: string,
        position: Position,
        team: string,
        movementShape: Position[],
        attackShape: Position[],
        abilities: IAbility[],
    ) {
        this.id = id;
        this.name = name;
        this.emoji = emoji;
        this.position = position;
        this.team = team;
        this.movementShape = movementShape;
        this.attackShape = attackShape;
        this.abilities = abilities;
    }

    /**
     * Gets the unique ID of the piece.
     * @returns The ID string.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Gets the team of the piece.
     * @returns The team identifier string.
     */
    public getTeam(): string {
        return this.team;
    }

    /**
     * Gets the current position of the piece.
     * @returns The current position.
     */
    public getPosition(): Position {
        return this.position;
    }

    /**
     * Sets the position of the piece. Should only be called by trusted game logic (e.g., Board or GameEngine).
     * @param newPosition The new position for the piece.
     */
    public setPosition(newPosition: Position): void {
        this.position = newPosition;
    }

    /**
     * Calculates potential target positions based on the movement shape, relative to the current position.
     * Does NOT validate against board boundaries, occupancy, or path blocking.
     * @returns An array of potential target positions.
     */
    public getPotentialMovementTargets(): Position[] {
        return this.movementShape.map(offset => ({
            x: this.position.x + offset.x,
            y: this.position.y + offset.y,
        }));
    }

    /**
     * Calculates potential target positions based on the attack shape, relative to the current position.
     * Does NOT validate against board boundaries, occupancy, or path blocking.
     * @returns An array of potential target positions.
     */
    public getPotentialActionTargets(): Position[] {
        return this.attackShape.map(offset => ({
            x: this.position.x + offset.x,
            y: this.position.y + offset.y,
        }));
    }

    /**
     * Gets the list of abilities possessed by the piece.
     * @returns An array of IAbility instances.
     */
    public getAbilities(): IAbility[] {
        return this.abilities;
    }

    /**
     * Gets the name of the piece.
     * @returns The name string.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Gets the emoji representation of the piece.
     * @returns The emoji string.
     */
    public getEmoji(): string {
        return this.emoji;
    }

    /**
     * Checks if the piece has a specific ability by its registered name.
     * @param abilityName The registered name of the ability (case-sensitive).
     * @returns True if the piece has the ability, false otherwise.
     */
    public hasAbility(abilityName: string): boolean {
        return this.abilities.some(ability => ability.constructor.name === abilityName);
    }

    /**
     * Applies a status effect instance to the piece.
     * @param effect The status effect instance to apply.
     */
    public applyStatus(effect: StatusEffectInstance): void {
        this.statusEffects.push(effect);
    }
}

export { Piece };