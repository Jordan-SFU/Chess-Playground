# Shape Definition DSL

This document describes the JSON-based Domain Specific Language (DSL) used to define geometric shapes within the Chess Playground engine. These shapes represent potential movement or attack patterns for pieces.

The core concept is the `ShapeNode`, which is a JSON object with a `kind` property determining the type of shape and its specific parameters.

## Primitive Shapes

These are the basic building blocks.

### `circle`

Defines a diamond-shaped area based on Manhattan distance (`|dx| + |dy| <= radius`). Excludes the origin (0,0).

-   `kind`: `"circle"`
-   `radius`: `number` (non-negative integer) - The maximum Manhattan distance from the origin.

**Example:**
```json
{
  "kind": "circle",
  "radius": 2
}
```

### `square`

Defines a square area based on Chebyshev distance (`max(|dx|, |dy|) <= size`). Excludes the origin (0,0).

-   `kind`: `"square"`
-   `size`: `number` (non-negative integer) - The maximum coordinate distance (half-width) from the origin.

**Example:**
```json
{
  "kind": "square",
  "size": 1
}
```

### `ray`

Defines one or more straight lines extending from the origin in specific directions.

-   `kind`: `"ray"`
-   `dirs`: `Direction[]` - An array of direction strings. Valid directions are: `"N"`, `"NE"`, `"E"`, `"SE"`, `"S"`, `"SW"`, `"W"`, `"NW"`. Must contain at least one direction.
-   `min`: `number` (integer, >= 1) - The minimum distance (number of steps) along the ray.
-   `max`: `number` (integer, >= `min`) - The maximum distance along the ray.

**Example (Rook movement):**
```json
{
  "kind": "ray",
  "dirs": ["N", "E", "S", "W"],
  "min": 1,
  "max": 8
}
```

### `point`

Defines a single specific offset relative to the origin.

-   `kind`: `"point"`
-   `delta`: `{ "x": number, "y": number }` - The coordinates of the offset.

**Example (Single Point):**
```json
{
  "kind": "point",
  "delta": { "x": 1, "y": 2 }
}
```

### `cone`

Defines a cone-shaped area expanding in a specific direction. The width of the cone increases with distance. Excludes the origin (0,0).

-   `kind`: `"cone"`
-   `dir`: `Direction` - The single direction the cone points towards ( `"N"`, `"NE"`, `"E"`, `"SE"`, `"S"`, `"SW"`, `"W"`, `"NW"`).
-   `length`: `number` (integer, >= 1) - The maximum extent of the cone along its primary axis. For diagonal directions, this length is adjusted internally to approximate a similar Euclidean distance to cardinal cones.

**Example:**
```json
{
  "kind": "cone",
  "dir": "N",
  "length": 3
}
```

## Combinators

These shapes combine other shapes.

### `union`

Combines the offsets from multiple child shapes into a single set. Duplicates are removed.

-   `kind`: `"union"`
-   `shapes`: `ShapeNode[]` - An array containing at least one child `ShapeNode`.

**Example (King movement):**
```json
{
  "kind": "union",
  "shapes": [
    { "kind": "circle", "radius": 1 },
    { "kind": "square", "size": 1 }
  ]
}
```
*(This specific example combines Manhattan and Chebyshev distance 1, effectively creating a square of size 1).*

### `intersect`

Creates a shape containing only the offsets that are present in *all* of the child shapes.

-   `kind`: `"intersect"`
-   `shapes`: `ShapeNode[]` - An array containing at least one child `ShapeNode`.

**Example:**
```json
{
  "kind": "intersect",
  "shapes": [
    { "kind": "circle", "radius": 2 },
    { "kind": "square", "size": 2 }
  ]
}
```

### `subtract`

Takes the offsets from the first child shape and removes any offsets that are also present in any of the subsequent child shapes.

-   `kind`: `"subtract"`
-   `shapes`: `ShapeNode[]` - An array containing at least two child `ShapeNode`s. The first is the base shape, the others are the shapes to subtract.

**Example (Hollow circle):**
```json
{
  "kind": "subtract",
  "shapes": [
    { "kind": "circle", "radius": 3 },
    { "kind": "circle", "radius": 1 }
  ]
}
```

## Unary Operators

These shapes modify a single child shape (or a union of shapes).

### `reflect`

Takes the offsets from its child shapes and adds their reflections across the specified axis. The original offsets are included in the final result.

-   `kind`: `"reflect"`
-   `axis`: `"horizontal" | "vertical" | "both"` - The axis of reflection.
    -   `"horizontal"`: Reflects across the Y-axis (changes sign of X).
    -   `"vertical"`: Reflects across the X-axis (changes sign of Y).
    -   `"both"`: Reflects across both axes (changes sign of X and Y).
-   `shapes`: `ShapeNode[]` - An array containing at least one child `ShapeNode`. If multiple shapes are provided, they are effectively unioned before reflection.

**Example (Reflecting a single point to get 4 points):**
```json
{
  "kind": "reflect",
  "axis": "both",
  "shapes": [
    { "kind": "point", "delta": { "x": 2, "y": 1 } }
  ]
}
```
*(This results in offsets: (2,1), (-2,1), (2,-1), (-2,-1)).*


## Standard Chess Piece Examples

Here are examples of how standard chess piece movements can be defined using this DSL. Note that these represent the *shape* of the movement, assuming an infinite board and not accounting for board boundaries, blocking pieces, or special rules like castling or en passant. Pawn movement is particularly simplified here.

*(Assume a maximum board dimension of 8 for ray examples)*

### King

Moves one step in any direction (Chebyshev distance 1).

```json
{
  "kind": "square",
  "size": 1
}
```

### Queen

Moves any number of steps along ranks, files, or diagonals.

```json
{
  "kind": "ray",
  "dirs": ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
  "min": 1,
  "max": 8
}
```

### Rook

Moves any number of steps along ranks or files.

```json
{
  "kind": "ray",
  "dirs": ["N", "E", "S", "W"],
  "min": 1,
  "max": 8
}
```

### Bishop

Moves any number of steps along diagonals.

```json
{
  "kind": "ray",
  "dirs": ["NE", "SE", "SW", "NW"],
  "min": 1,
  "max": 8
}
```

### Knight

Moves in an 'L' shape: two steps in one cardinal direction, then one step perpendicular.

```json
{
  "kind": "reflect",
  "axis": "both",
  "shapes": [
    { "kind": "point", "delta": { "x": 1, "y": 2 } },
    { "kind": "point", "delta": { "x": 2, "y": 1 } }
  ]
}
```

### Pawn

This example shows a *potential* single step forward moving north. Actual pawn movement is more complex and context-dependent (initial double step, en passant, promotion, etc).

```json
{
  "kind": "point",
  "delta": { "x": 0, "y": 1 }
}
```