import { AbilityRegistry } from "./AbilityRegistry";

import { Immobile } from "./built-ins/Immobile";
import { Jumping } from "./built-ins/Jumping";
import { TargetAlliesOnly } from "./built-ins/TargetAlliesOnly";
import { King } from "./built-ins/King";

export const abilityRegistry = new AbilityRegistry();
abilityRegistry.register("Immobile", Immobile);
abilityRegistry.register("Jumping", Jumping);
abilityRegistry.register("TargetAlliesOnly", TargetAlliesOnly);
abilityRegistry.register("King", King);