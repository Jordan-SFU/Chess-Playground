/**
 * Defines the static properties and behavior of a status effect.
 */
class StatusEffectDefinition {
    /**
     * The unique name identifier for the status effect.
     */
    public name: string;
    /**
     * The base duration of the status effect (e.g., in turns) when applied.
     */
    public baseDuration: number;
    /**
     * Defines how multiple instances of this effect on the same target interact (e.g., 'refresh', 'stack_duration', 'ignore').
     */
    public stackBehavior: string;
    /**
     * List of raw JSON blueprints for abilities granted or modified by this status effect.
     */
    public abilityBlueprints: Object[];

    /**
     * Constructor for the StatusEffectDefinition class.
     * @param name The name of the status effect.
     * @param baseDuration The base duration of the status effect (e.g., in turns).
     * @param stackBehavior The behavior of multiple instances of this effect on the same target (e.g., 'refresh', 'stack_duration', 'ignore').
     * @param abilityBlueprints List of raw JSON blueprints for abilities granted or modified by this status effect.
     */
    constructor(name: string, baseDuration: number, stackBehavior: string, abilityBlueprints: Object[]) {
        this.name = name;
        this.baseDuration = baseDuration;
        this.stackBehavior = stackBehavior;
        this.abilityBlueprints = abilityBlueprints;
    }
}

export { StatusEffectDefinition };