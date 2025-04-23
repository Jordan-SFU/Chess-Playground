import { Position } from "../utils/position";
import { Direction } from "../utils/direction";
import { circle }      from "./primitives/Circle";
import { square }      from "./primitives/Square";
import { ray }         from "./primitives/Ray";
import { point }       from "./primitives/Point";
import { union }       from "./combinators/Union";
import { intersect }   from "./combinators/Intersect";
import { subtract }    from "./combinators/Subtract";
import { reflect }     from "./unary/Reflect";

/**
 * Discriminated union of all shape node types
 */
export interface CircleNode    { kind: "circle"; radius: number }
export interface SquareNode    { kind: "square"; size: number }
export interface RayNode       { kind: "ray"; dirs: Direction[]; min: number; max: number }
export interface PointNode     { kind: "point"; delta: Position }
export interface UnionNode     { kind: "union"; shapes: ShapeNode[] }
export interface IntersectNode { kind: "intersect"; shapes: ShapeNode[] }
export interface SubtractNode  { kind: "subtract"; shapes: [ShapeNode, ...ShapeNode[]] }
export interface ReflectNode   { kind: "reflect"; axis: "horizontal"|"vertical"|"both"; shapes: ShapeNode[] }
export type ShapeNode = CircleNode | SquareNode | RayNode | PointNode | UnionNode | IntersectNode | SubtractNode | ReflectNode;

/**
 * Parse any ShapeNode into a flat list of relative offsets
 */
export function parseShape(node: ShapeNode): Position[] {
  switch (node.kind) {
    case "circle":
      return circle(node.radius);
    case "square":
      return square(node.size);
    case "ray":
      return ray(node.dirs, node.min, node.max);
    case "point":
      return [point(node.delta)];
    case "union":
      return union(...node.shapes.map(parseShape));
    case "intersect":
      return intersect(...node.shapes.map(parseShape));
    case "subtract": {
      const [base, ...cuts] = node.shapes;
      return subtract(parseShape(base), ...cuts.map(parseShape));
    }
    case "reflect": {
        const { axis, shapes } = node;
        const parsedShapes = shapes.map(parseShape);
        const reflectedShapes = reflect(union(...parsedShapes), axis);
        return union(reflectedShapes, ...parsedShapes);
    }
    default:
      const _exhaustive: never = node;
      return [];
  }
}