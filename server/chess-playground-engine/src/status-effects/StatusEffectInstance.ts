import { StatusEffectDefinition } from "./StatusEffectDefinition";
import { Ability } from "../abilities/IAbility";
import { AbilityRegistry } from "../abilities/AbilityRegistry";
import { EventContext } from "../events/EventContext";

/**
 * Represents an active instance of a status effect applied to a piece.
 */
class StatusEffectInstance {
    /**
     * The definition containing the base properties of this status effect.
     */
    public definition: StatusEffectDefinition;
    /**
     * The remaining duration of the status effect (e.g., in turns).
     */
    public remainingDuration: number;
    /**
     * List of child abilities created and managed by this status effect instance.
     */
    private childAbilities: Ability[] = [];

    /**
     * The ability registry used to create and manage abilities.
     */
    private abilityRegistry: AbilityRegistry;

    /**
     * Constructor for the StatusEffectInstance class.
     * @param definition The definition containing the base properties of this status effect.
     * @param abilityRegistry The ability registry used to create and manage abilities.
     */
    constructor(definition: StatusEffectDefinition, abilityRegistry: AbilityRegistry) {
        this.definition = definition;
        this.remainingDuration = definition.baseDuration;
        this.abilityRegistry = abilityRegistry;
        this.createChildAbilities();
    }

    /**
     * Creates child abilities based on the status effect's definition and registers them.
     * This method is called during the construction of the status effect instance.
     */
    private createChildAbilities(): void {

    }

    /**
     * Called periodically (e.g., at the end of a turn) to decrease duration and potentially expire.
     */
    public tick(): void {
        this.remainingDuration--;
        if (this.remainingDuration <= 0) {
            this.expire();
        }
    }

    /**
     * Called when the status effect's duration runs out or it's removed prematurely.
     * Handles cleanup, like unsubscribing child abilities.
     */
    public expire(): void {

    }
}

export { StatusEffectInstance };