import { IAbility } from '../IAbility';
import { GameEventType } from '../../events/GameEventType';
import { EventContext } from '../../events/EventContext';

/**
 * Immobile ability
 * Prevents the host piece from moving at all.
 */
export class Immobile implements IAbility {
  /** Listen for movement attempts */
  public readonly triggers = [GameEventType.OnMoveStart];
  /** High priority so it blocks before most other effects */
  public readonly priority = 100;

  constructor(public readonly params: Record<string, any> = {}) {}

  /**
   * Called when the piece tries to move.
   * Cancels the move.
   */
  public onTrigger(ctx: EventContext): void {
    // only cancel if the piece is the one with this ability
    if (ctx.getSourcePiece()?.hasAbility('Immobile')) {
      ctx.cancel();
    }
  }
}
