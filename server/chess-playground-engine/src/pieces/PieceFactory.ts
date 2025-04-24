import { Piece } from "./Piece";
import { abilityRegistry } from "../abilities";
import { v4 as uuidv4 } from "uuid";
import { parseShape } from "../shapes/ShapeParser";
import { parseJson } from "../shapes/JsonParser";
import { Position } from "../utils/position";
import { PieceBlueprint } from "./Blueprint";
import { flipVertical } from "../utils/transform";

/**
 * Factory class responsible for creating Piece instances from blueprint data.
 */
class PieceFactory {
    /**
     * Creates a new Piece instance based on the provided blueprint.
     * Applies vertical flipping to shapes for the 'black' team.
     * @param blueprint The parsed piece blueprint data.
     * @param team The team identifier for the new piece ('white', 'black', etc.).
     * @param pos The initial position of the piece on the board.
     * @returns A new Piece instance.
     */
    public createPiece(blueprint: PieceBlueprint, team: string, pos: Position = {x: 0, y: 0}): Piece {
        const id = uuidv4();

        // Parse shapes from the blueprint strings
        const movementNode = parseJson(JSON.parse(blueprint.movement));
        const attackNode   = parseJson(JSON.parse(blueprint.attack));

        let movementShape = parseShape(movementNode);
        let attackShape = parseShape(attackNode);

        if (team.toLowerCase() === 'black') {
            movementShape = flipVertical(movementShape);
            attackShape = flipVertical(attackShape);
            console.log(`Applied vertical flip for black team piece: ${blueprint.name}`);
        }

        const abilities = (blueprint.abilities || [])
            .map(name => abilityRegistry.create(name, {}));

        return new Piece(
            id,
            blueprint.name,
            blueprint.emoji,
            pos,
            team,
            movementShape,
            attackShape,
            abilities
        );
    }
}

export { PieceFactory };