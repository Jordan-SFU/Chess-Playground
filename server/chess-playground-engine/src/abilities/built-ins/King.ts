import { IAbility } from '../IAbility';
import { GameEventType } from '../../events/GameEventType';
import { EventContext } from '../../events/EventContext';
import { GameEngine } from '../../engine/GameEngine'; // Assuming GameEngine handles game over

/**
 * King ability
 * Triggers game over if the piece possessing this ability is captured.
 */
export class King implements IAbility {
  /** Listen for when this piece might be captured */
  public readonly triggers = [GameEventType.OnCapture]; // Listen for capture events
  /** High priority to ensure game over is checked */
  public readonly priority = 100;

  constructor(public readonly params: Record<string, any> = {}) {}

  /**
   * Called when a piece is captured.
   * If the captured piece is the one with this ability, trigger game over.
   */
  public onTrigger(ctx: EventContext): void {
    // The 'sourcePiece' in OnCapture context should be the piece being captured.
    if (ctx.getSourcePiece()?.hasAbility('King')) {
        console.log(`King piece ${ctx.getSourcePiece()?.getId()} captured! Game Over.`);
        // Dispatch a game over event. The GameEngine should listen for this.
        // We might need access to the dispatcher or engine instance here,
        // or the GameEngine should listen for OnCapture and check for King itself.
        // For now, let's add a payload flag. The engine will check this.
        ctx.payload['gameOverTriggered'] = true;
        ctx.payload['losingTeam'] = ctx.getSourcePiece()?.getTeam();
    }
  }
}
