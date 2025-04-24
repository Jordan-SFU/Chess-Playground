import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { GameEngine } from './engine/GameEngine';
import { Position } from './utils/position';
import { Piece } from './pieces/Piece';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const gameEngine = new GameEngine();

// --- Piece Definition Loading ---
const definitionsDir = path.join(__dirname, 'pieces', 'definitions');
const pieceDefinitionFiles = fs.readdirSync(definitionsDir).filter(file => file.endsWith('.json'));
const pieceBlueprints: { [name: string]: string } = {};

pieceDefinitionFiles.forEach(file => {
    const filePath = path.join(definitionsDir, file);
    const blueprintString = fs.readFileSync(filePath, 'utf-8');
    try {
        const blueprint = JSON.parse(blueprintString);
        // Use file name (without extension) or blueprint name as key
        const nameKey = path.basename(file, '.json'); // Or use blueprint.name if preferred
        pieceBlueprints[nameKey] = blueprintString;
        console.log(`Loaded blueprint: ${nameKey}`);
    } catch (error) {
        console.error(`Failed to load or parse blueprint ${file}: ${error}`);
    }
});

// --- Board Rendering ---
/**
 * Renders the board to the console.
 * Optionally highlights potential movement or attack squares for a selected piece.
 * @param highlightSet Optional set of positions to mark.
 * @param highlightChar The character to use for highlighting ('M' or 'A').
 * @param selectedPiecePos Optional position of the piece being highlighted ('X').
 * @param patternType Optional string indicating the type of pattern shown ('movement' or 'attack').
 */
function renderBoard(
    highlightSet?: Set<string>,
    highlightChar?: 'M' | 'A',
    selectedPiecePos?: Position,
    patternType?: 'movement' | 'attack'
): void {
    const board = gameEngine.getBoard();
    const size = { width: 8, height: 8 }; // Assuming 8x8, adjust if dynamic
    let output = '\n  '; // Header spacing

    // X-axis labels
    for (let x = 0; x < size.width; x++) {
        output += `  ${x} `;
    }
    output += '\n';

    // Rows (from top y=7 down to y=0)
    for (let y = size.height - 1; y >= 0; y--) {
        output += `${y} `; // Y-axis label
        for (let x = 0; x < size.width; x++) {
            const currentPosStr = `${x},${y}`;
            const piece = board.getPieceAt({ x, y });
            const isSelected = selectedPiecePos && selectedPiecePos.x === x && selectedPiecePos.y === y;
            const isHighlightTarget = highlightSet?.has(currentPosStr);

            let cellContent = ' ';
            if (isSelected) {
                cellContent = 'X'; // Mark the selected piece
            } else if (isHighlightTarget) {
                cellContent = highlightChar!; // Mark the highlight target
            } else if (piece) {
                cellContent = piece.getEmoji();
            }

            output += `[${cellContent} ]`;
        }
        output += ` ${y}\n`; // Y-axis label
    }

     // X-axis labels (bottom)
    output += '  ';
    for (let x = 0; x < size.width; x++) {
        output += `  ${x} `;
    }
    output += '\n';

    console.log(output);
    if (!highlightSet) { // Only show turn info on normal render
        console.log(`Turn ${gameEngine.getTurnNumber()}: ${gameEngine.getCurrentPlayerTeam()}'s turn.`);
    } else if (selectedPiecePos && patternType) {
        const piece = board.getPieceAt(selectedPiecePos);
        const marker = highlightChar === 'M' ? 'Move' : 'Attack';
        console.log(`Showing ${patternType} pattern for ${piece?.getName()} at (${selectedPiecePos.x},${selectedPiecePos.y}). ${marker}=${highlightChar}, X=Selected`);
    }
}

// --- Game Setup ---
function setupGame(): void {
    // Standard Chess Setup
    try {
        // Pawns
        if (pieceBlueprints['pawn']) {
            for (let i = 0; i < 8; i++) {
                gameEngine.addPiece(pieceBlueprints['pawn'], 'white', { x: i, y: 1 });
                gameEngine.addPiece(pieceBlueprints['pawn'], 'black', { x: i, y: 6 });
            }
        }
        // Rooks
        if (pieceBlueprints['rook']) {
            gameEngine.addPiece(pieceBlueprints['rook'], 'white', { x: 0, y: 0 });
            gameEngine.addPiece(pieceBlueprints['rook'], 'white', { x: 7, y: 0 });
            gameEngine.addPiece(pieceBlueprints['rook'], 'black', { x: 0, y: 7 });
            gameEngine.addPiece(pieceBlueprints['rook'], 'black', { x: 7, y: 7 });
        }
        // Knights
        if (pieceBlueprints['knight']) {
             gameEngine.addPiece(pieceBlueprints['knight'], 'white', { x: 1, y: 0 });
             gameEngine.addPiece(pieceBlueprints['knight'], 'white', { x: 6, y: 0 });
             gameEngine.addPiece(pieceBlueprints['knight'], 'black', { x: 1, y: 7 });
             gameEngine.addPiece(pieceBlueprints['knight'], 'black', { x: 6, y: 7 });
        }
        // Bishops
        if (pieceBlueprints['bishop']) {
            gameEngine.addPiece(pieceBlueprints['bishop'], 'white', { x: 2, y: 0 });
            gameEngine.addPiece(pieceBlueprints['bishop'], 'white', { x: 5, y: 0 });
            gameEngine.addPiece(pieceBlueprints['bishop'], 'black', { x: 2, y: 7 });
            gameEngine.addPiece(pieceBlueprints['bishop'], 'black', { x: 5, y: 7 });
        }
        // Queens
        if (pieceBlueprints['queen']) {
            gameEngine.addPiece(pieceBlueprints['queen'], 'white', { x: 3, y: 0 });
            gameEngine.addPiece(pieceBlueprints['queen'], 'black', { x: 3, y: 7 });
        }
        // Kings
        if (pieceBlueprints['king']) {
            gameEngine.addPiece(pieceBlueprints['king'], 'white', { x: 4, y: 0 });
            gameEngine.addPiece(pieceBlueprints['king'], 'black', { x: 4, y: 7 });
        }

        gameEngine.startGame('white'); // Start the game with white's turn
    } catch (error) {
        console.error("Error setting up game:", error);
        process.exit(1); // Exit if setup fails
    }
}

// --- Command Handling ---
function handleCommand(command: string): void {
    const parts = command.trim().split(' ');
    const action = parts[0]?.toLowerCase();
    let needsRender = true; // Flag to control rendering
    let needsPrompt = true; // Flag to control prompting

    try {
        if (action === 'move' && parts.length === 5) {
            const from: Position = { x: parseInt(parts[1]), y: parseInt(parts[2]) };
            const to: Position = { x: parseInt(parts[3]), y: parseInt(parts[4]) };
            const piece = gameEngine.getBoard().getPieceAt(from);
            if (!piece) {
                console.log("Invalid move: No piece at source position.");
                needsRender = false; // Don't re-render board if input was invalid like this
            } else {
                if (gameEngine.movePiece(piece.getId(), to)) {
                    console.log("Move successful.");
                } else {
                    console.log("Move failed (see logs for details).");
                }
            }
        } else if (action === 'attack' && parts.length === 5) {
            const from: Position = { x: parseInt(parts[1]), y: parseInt(parts[2]) };
            const targetPos: Position = { x: parseInt(parts[3]), y: parseInt(parts[4]) };
            const piece = gameEngine.getBoard().getPieceAt(from);
            if (!piece) {
                console.log("Invalid attack: No piece at source position.");
                 needsRender = false;
            } else {
                if (gameEngine.performAction(piece.getId(), targetPos, 'attack')) {
                    console.log("Attack action performed.");
                } else {
                    console.log("Attack failed (see logs for details).");
                }
            }
        } else if (action === 'showmove' && parts.length === 3) {
            const pos: Position = { x: parseInt(parts[1]), y: parseInt(parts[2]) };
            const piece = gameEngine.getBoard().getPieceAt(pos);
            if (!piece) {
                console.log(`No piece found at (${pos.x}, ${pos.y}).`);
                needsRender = false;
            } else {
                const moveTargets = piece.getPotentialMovementTargets();
                const moveSet = new Set(moveTargets.map(p => `${p.x},${p.y}`));
                renderBoard(moveSet, 'M', pos, 'movement'); // Call render with move highlights
                needsRender = false;
            }
        } else if (action === 'showattack' && parts.length === 3) {
            const pos: Position = { x: parseInt(parts[1]), y: parseInt(parts[2]) };
            const piece = gameEngine.getBoard().getPieceAt(pos);
            if (!piece) {
                console.log(`No piece found at (${pos.x}, ${pos.y}).`);
                needsRender = false;
            } else {
                const attackTargets = piece.getPotentialActionTargets();
                const attackSet = new Set(attackTargets.map(p => `${p.x},${p.y}`));
                renderBoard(attackSet, 'A', pos, 'attack'); // Call render with attack highlights
                needsRender = false;
            }
        } else if (action === 'exit') {
            rl.close();
            needsRender = false;
            needsPrompt = false;
        }
        else {
            console.log("Unknown command. Use: move <x1> <y1> <x2> <y2> | attack <x1> <y1> <x2> <y2> | showmove <x> <y> | showattack <x> <y> | exit");
            needsRender = false;
        }
    } catch (error) {
        console.error("Error processing command:", error);
        needsRender = false;
    }

    // Render board and prompt for next command if needed
    if (needsRender) {
        renderBoard();
    }
    if (needsPrompt) {
        promptUser();
    }
}

function promptUser(): void {
    rl.question('Enter command: ', handleCommand);
}

// --- Start CLI ---
console.log("Starting Chess Playground CLI...");
setupGame();
renderBoard();
promptUser();

rl.on('close', () => {
  console.log('Exiting CLI.');
  process.exit(0);
});