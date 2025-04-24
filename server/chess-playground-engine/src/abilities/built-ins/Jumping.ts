import { IAbility } from '../IAbility';
import { GameEventType } from '../../events/GameEventType';
import { EventContext } from '../../events/EventContext';

/**
 * Jumping ability
 * Allows the piece to ignore intervening pieces when moving or attacking.
 * Updates movement validation to allow jumping over pieces.
 */
export class Jumping implements IAbility {
  /** This ability triggers on movement validation */
  public readonly triggers = [GameEventType.OnMoveValidate];
  /** Lower priority to run before default validation logic might cancel */
  public readonly priority = 50;

  constructor(public readonly params: Record<string, any> = {}) {}

  /**
   * Called during move validation.
   * Sets a flag in the context to ignore path blocking.
   */
  public onTrigger(ctx: EventContext): void {
    // Signal to the MoveValidator that path blocking should be ignored for this move.
    ctx.setValidationFlag('ignorePathBlocking', true);
  }
}
