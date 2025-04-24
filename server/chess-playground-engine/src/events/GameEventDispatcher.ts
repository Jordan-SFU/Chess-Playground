import { GameEventType } from "./GameEventType";
import { EventContext } from "./EventContext";
import { IAbility } from "../abilities/IAbility";

/**
 * Dispatches game events to subscribed listeners (Abilities).
 */
class GameEventDispatcher{
    /**
     * Map storing listeners subscribed to specific event types, along with their priority.
     * Listeners are stored as tuples of [priority, Ability].
     */
    private listeners: Map<GameEventType, { priority: number, listener: IAbility }[]> = new Map();

    /**
     * Subscribes a listener (Ability) to a specific game event type with a given priority.
     * @param eventType The type of event to subscribe to.
     * @param listener The Ability instance that will listen to the event.
     * @param priority The priority of the listener (lower numbers execute first).
     */
    public subscribe(eventType: GameEventType, listener: IAbility, priority: number): void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        const eventListeners = this.listeners.get(eventType)!;
        eventListeners.push({ priority, listener });
        // Sort listeners by priority
        eventListeners.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Unsubscribes a listener (Ability) from a specific game event type.
     * @param eventType The type of event to unsubscribe from.
     * @param listener The Ability instance to unsubscribe.
     */
    public unsubscribe(eventType: GameEventType, listener: IAbility): void {
        if (this.listeners.has(eventType)) {
            const eventListeners = this.listeners.get(eventType)!;
            this.listeners.set(eventType, eventListeners.filter(l => l.listener !== listener));
        }
    }

    /**
     * Dispatches a game event to all relevant subscribed listeners in priority order.
     * @param eventType The type of event being dispatched.
     * @param context The context object containing information about the event.
     */
    public dispatch(eventType: GameEventType, context: EventContext): void {
        if (this.listeners.has(eventType)) {
            const eventListeners = this.listeners.get(eventType)!;
            for (const { listener } of eventListeners) {
                // Check if the event was cancelled by a previous listener
                if (context.isCancelled()) break;
                listener.onTrigger(context);
            }
        }
    }
}

export { GameEventDispatcher };