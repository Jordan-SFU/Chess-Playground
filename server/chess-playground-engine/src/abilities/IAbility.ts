import { GameEventType } from "../events/GameEventType";
import { EventContext } from "../events/EventContext";

/**
 * Interface defining the structure of an ability that can be attached to pieces or status effects.
 */
interface Ability {
    /**
     * List of game event types that trigger this ability.
     */
    triggers: GameEventType[];
    /**
     * Parameters specific to this ability instance.
     */
    params: Object;
    /**
     * Method called when one of the specified trigger events occurs.
     * @param ctx The context object containing information about the event.
     */
    onTrigger(ctx: EventContext): void;
}

export { Ability };