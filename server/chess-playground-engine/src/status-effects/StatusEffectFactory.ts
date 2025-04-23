import { StatusEffectDefinition } from "./StatusEffectDefinition";
import { StatusEffectInstance } from "./StatusEffectInstance";
import { AbilityRegistry } from "../abilities/AbilityRegistry";

/**
 * Factory class responsible for creating StatusEffectInstance objects from definitions.
 */
class StatusEffectFactory {
    private abilityRegistry: AbilityRegistry;

    constructor(abilityRegistry: AbilityRegistry) {
        this.abilityRegistry = abilityRegistry;
    }

    /**
     * Creates a new StatusEffectInstance based on the provided definition.
     * @param definition The StatusEffectDefinition to instantiate.
     * @returns A new StatusEffectInstance.
     */
    public createStatusEffect(definition: StatusEffectDefinition): StatusEffectInstance {
        throw new Error("StatusEffectFactory.createStatusEffect not implemented yet");
    }
}

export { StatusEffectFactory };