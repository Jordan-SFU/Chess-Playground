import { IAbility } from "./IAbility";

/**
 * Type alias for an Ability constructor.
 */
export type AbilityConstructor = new (params: Record<string,any>) => IAbility;

/**
 * Registry for managing and creating Ability instances.
 */
export class AbilityRegistry {
    /**
     * Internal map storing registered ability constructors, keyed by name.
     */
    private registry = new Map<string, AbilityConstructor>();

    /**
     * Registers a new ability constructor with the registry.
     * @param name The name to register the ability under.
     * @param ctor The constructor function for the ability.
     */
    public register(name: string, ctor: AbilityConstructor): void {
        this.registry.set(name, ctor);
    }

    /**
     * Creates a new instance of an ability by its registered name.
     * @param name The name of the ability to create.
     * @param params The parameters to pass to the ability's constructor.
     * @returns A new Ability instance.
     * @throws Error if the ability name is not registered.
     */
    public create(name: string, params: Record<string,any> = {}): IAbility {
        const ctor = this.registry.get(name);
        if (!ctor) {
            throw new Error(`Ability with name "${name}" not registered.`);
        }
        return new ctor(params);
    }
}