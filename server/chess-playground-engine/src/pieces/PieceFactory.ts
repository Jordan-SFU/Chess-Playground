import { Piece } from "./Piece";
import { AbilityRegistry } from "../abilities/AbilityRegistry";

/**
 * Factory class responsible for creating Piece instances from blueprint JSON data.
 */
class PieceFactory {
    private abilityRegistry: AbilityRegistry;

    /**
     * Constructor for the PieceFactory class.
     */
    public constructor() {
        this.abilityRegistry = new AbilityRegistry();
    }

    /**
     * Creates a new Piece instance based on the provided blueprint JSON.
     * @param blueprintJson The JSON object containing the piece blueprint data.
     * @returns A new Piece instance.
     */
    public createPiece(blueprintJson: Object): Piece {
        throw new Error("PieceFactory.createPiece not implemented yet");
    }
}

export { PieceFactory };