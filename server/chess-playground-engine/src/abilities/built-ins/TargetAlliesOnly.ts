import { IAbility } from '../IAbility';
import { GameEventType } from '../../events/GameEventType';
import { EventContext } from '../../events/EventContext';

/**
 * TargetAlliesOnly ability
 * Modifies action validation to only allow targeting friendly pieces (including self if allowTargetSelf is true).
 */
export class TargetAlliesOnly implements IAbility {
  /** Listen for action validation */
  public readonly triggers = [GameEventType.OnActionValidate];
  /** Moderate priority */
  public readonly priority = 50;

  constructor(public readonly params: Record<string, any> = {}) {}

  /**
   * Called during action validation.
   * Sets flags to allow targeting allies and disallow targeting enemies.
   */
  public onTrigger(ctx: EventContext): void {
    // Allow targeting allies
    ctx.setValidationFlag('allowTargetAlly', true);
    // Disallow targeting enemies
    ctx.setValidationFlag('allowTargetEnemy', false);
  }
}
