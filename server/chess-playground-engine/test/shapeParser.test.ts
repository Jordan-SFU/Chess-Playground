// test/shapeParser.visual.test.ts
import { parseShape, ShapeNode } from '../src/shapes/ShapeParser';
import { renderGrid } from './utils';

describe('ShapeParser & DSL visual tests', () => {
  it('circle r=2', () => {
    const node: ShapeNode = { kind: 'circle', radius: 2 };
    const offsets = parseShape(node);
    console.log('\nCircle radius=2:\n' + renderGrid(offsets));
  });

  it('square size=2', () => {
    const node: ShapeNode = { kind: 'square', size: 2 };
    const offsets = parseShape(node);
    console.log('\nSquare size=2:\n' + renderGrid(offsets));
  });

  it('point at origin', () => {
    const node: ShapeNode = { kind: 'point', delta: { x: 0, y: 0 } };
    const offsets = parseShape(node);
    console.log('\nPoint (0,0):\n' + renderGrid(offsets));
  });

  it('point at (3,-2)', () => {
    const node: ShapeNode = { kind: 'point', delta: { x: 3, y: -2 } };
    const offsets = parseShape(node);
    console.log('\nPoint (3,-2):\n' + renderGrid(offsets));
  });

  it('ray N 1–4', () => {
    const node: ShapeNode = { kind: 'ray', dirs: ['N'], min: 1, max: 4 };
    const offsets = parseShape(node);
    console.log('\nRay North 1–4:\n' + renderGrid(offsets));
  });

  it('ray NE & SW 1–3', () => {
    const node: ShapeNode = { kind: 'ray', dirs: ['NE','SW'], min: 1, max: 3 };
    const offsets = parseShape(node);
    console.log('\nRays NE & SW 1–3:\n' + renderGrid(offsets));
  });

  it('union of circle1 + ray E 1–3', () => {
    const node: ShapeNode = {
      kind: 'union',
      shapes: [
        { kind: 'circle', radius: 1 },
        { kind: 'ray', dirs: ['E'], min: 1, max: 3 }
      ]
    };
    const offsets = parseShape(node);
    console.log('\nUnion circle r=1 + ray E 1–3:\n' + renderGrid(offsets));
  });

  it('intersect circle2 & square2', () => {
    const node: ShapeNode = {
      kind: 'intersect',
      shapes: [
        { kind: 'circle', radius: 2 },
        { kind: 'square', size: 2 }
      ]
    };
    const offsets = parseShape(node);
    console.log('\nIntersect circle r=2 & square size=2:\n' + renderGrid(offsets));
  });

  it('subtract circle2 minus circle1', () => {
    const node: ShapeNode = {
      kind: 'subtract',
      shapes: [
        { kind: 'circle', radius: 2 },
        { kind: 'circle', radius: 1 }
      ]
    };
    const offsets = parseShape(node);
    console.log('\nSubtract circle r=2 minus circle r=1:\n' + renderGrid(offsets));
  });

  it('reflect point (2,3) horizontally', () => {
    const node: ShapeNode = {
      kind: 'reflect',
      axis: 'horizontal',
      shapes: [
        { kind: 'point', delta: { x: 2, y: 3 } }
      ]
    };
    const offsets = parseShape(node);
    console.log('\nReflect point (2,3) horizontally:\n' + renderGrid(offsets));
  });

  it('reflect point (2,3) vertically', () => {
    const node: ShapeNode = {
      kind: 'reflect',
      axis: 'vertical',
      shapes: [
        { kind: 'point', delta: { x: 2, y: 3 } }
      ]
    };
    const offsets = parseShape(node);
    console.log('\nReflect point (2,3) vertically:\n' + renderGrid(offsets));
  });

  it('reflect point (2,3) both axes', () => {
    const node: ShapeNode = {
      kind: 'reflect',
      axis: 'both',
      shapes: [
        { kind: 'point', delta: { x: 2, y: 3 } }
      ]
    };
    const offsets = parseShape(node);
    console.log('\nReflect point (2,3) both:\n' + renderGrid(offsets));
  });

  it('reflect square1 both axes', () => {
    const node: ShapeNode = {
      kind: 'reflect',
      axis: 'both',
      shapes: [
        { kind: 'square', size: 1 }
      ]
    };
    const offsets = parseShape(node);
    console.log('\nReflect square size=1 both:\n' + renderGrid(offsets));
  });

  it('complex composite: subtract union(ray N1–3, point(4,0)) minus intersect(circle2, ray W1–2)', () => {
    const node: ShapeNode = {
      kind: 'subtract',
      shapes: [
        {
          kind: 'union',
          shapes: [
            { kind: 'ray', dirs: ['N'], min: 1, max: 3 },
            { kind: 'point', delta: { x: 4, y: 0 } }
          ]
        },
        {
          kind: 'intersect',
          shapes: [
            { kind: 'circle', radius: 2 },
            { kind: 'ray', dirs: ['W'], min: 1, max: 2 }
          ]
        }
      ]
    };
    const offsets = parseShape(node);
    console.log('\nComplex subtract/union/intersect:\n' + renderGrid(offsets));
  });
});
