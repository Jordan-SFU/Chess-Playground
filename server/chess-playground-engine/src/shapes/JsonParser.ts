import {
    ShapeNode,
    CircleNode,
    SquareNode,
    RayNode,
    PointNode,
    ConeNode, // Added ConeNode import
    UnionNode,
    IntersectNode,
    SubtractNode,
    ReflectNode
  } from './ShapeParser';
  import { Direction } from '../utils/direction';
  
  const ALL_DIRS: Direction[] = ['N','NE','E','SE','S','SW','W','NW'];
  const AXES = ['horizontal','vertical','both'] as const;
  
  /**
   * Parse untyped JSON into a ShapeNode, validating required fields.
   * Throws if the input is not a valid ShapeNode.
   */
  export function parseJson(raw: any): ShapeNode {
    if (typeof raw !== 'object' || raw === null) {
      throw new Error(`Shape node must be an object, got ${typeof raw}`);
    }
    const { kind } = raw;
    if (typeof kind !== 'string') {
      throw new Error(`Shape node missing "kind" string`);
    }
  
    switch (kind) {
      case 'circle': {
        const { radius } = raw;
        if (typeof radius !== 'number' || radius < 0) {
          throw new Error(`circle.radius must be a non-negative number`);
        }
        const node: CircleNode = { kind, radius };
        return node;
      }
  
      case 'square': {
        const { size } = raw;
        if (typeof size !== 'number' || size < 0) {
          throw new Error(`square.size must be a non-negative number`);
        }
        const node: SquareNode = { kind, size };
        return node;
      }
  
      case 'ray': {
        const { dirs, min, max } = raw;
        if (!Array.isArray(dirs) || dirs.some(d => typeof d !== 'string' || !ALL_DIRS.includes(d as Direction))) {
          throw new Error(`ray.dirs must be an array of directions ${ALL_DIRS.join(',')}`);
        }
        if (typeof min !== 'number' || typeof max !== 'number' || min < 1 || max < min) {
          throw new Error(`ray.min/max must be numbers with 1 ≤ min ≤ max`);
        }
        const node: RayNode = { kind, dirs, min, max };
        return node;
      }
  
      case 'point': {
        const { delta } = raw;
        if (
          typeof delta !== 'object' ||
          typeof delta.x !== 'number' ||
          typeof delta.y !== 'number'
        ) {
          throw new Error(`point.delta must be {x:number,y:number}`);
        }
        const node: PointNode = { kind, delta: { x: delta.x, y: delta.y } };
        return node;
      }
  
      case 'cone': { // Added cone case
        const { dir, length } = raw;
        if (typeof dir !== 'string' || !ALL_DIRS.includes(dir as Direction)) {
          throw new Error(`cone.dir must be one of ${ALL_DIRS.join(',')}`);
        }
        if (typeof length !== 'number' || length < 1) {
          throw new Error(`cone.length must be a number >= 1`);
        }
        const node: ConeNode = { kind, dir: dir as Direction, length };
        return node;
      }
  
      case 'union':
      case 'intersect': {
        const { shapes } = raw;
        if (!Array.isArray(shapes) || shapes.length < 1) {
          throw new Error(`${kind}.shapes must be a non-empty array`);
        }
        const parsed = shapes.map(parseJson);
        const node = kind === 'union'
          ? { kind, shapes: parsed } as UnionNode
          : { kind, shapes: parsed } as IntersectNode;
        return node;
      }
  
      case 'subtract': {
        const { shapes } = raw;
        if (!Array.isArray(shapes) || shapes.length < 2) {
          throw new Error(`subtract.shapes must be an array of at least 2 nodes`);
        }
        const [head, ...tail] = shapes.map(parseJson);
        const node: SubtractNode = { kind, shapes: [head, ...tail] };
        return node;
      }
  
      case 'reflect': {
        const { axis, shapes } = raw;
        if (typeof axis !== 'string' || !AXES.includes(axis as ReflectNode['axis'])) {
          throw new Error(`reflect.axis must be one of ${AXES.join(',')}`);
        }
        if (!Array.isArray(shapes) || shapes.length < 1) {
          throw new Error(`reflect.shapes must be a non-empty array`);
        }
        const parsed = shapes.map(parseJson);
        const node: ReflectNode = { kind, axis: axis as ReflectNode['axis'], shapes: parsed };
        return node;
      }
  
      default:
        throw new Error(`Unknown shape kind "${kind}"`);
    }
  }
