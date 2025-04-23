// test/shapeParser.visual.test.ts
import { parseShape, ShapeNode } from '../src/shapes/ShapeParser';
import { parseJson } from '../src/shapes/JsonParser';
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

  it('cone N length=3', () => {
    const node: ShapeNode = { kind: 'cone', dir: 'N', length: 3 };
    const offsets = parseShape(node);
    console.log('\nCone North length=3:\n' + renderGrid(offsets));
  });

  it('cone SE length=3', () => {
    const node: ShapeNode = { kind: 'cone', dir: 'SE', length: 3 };
    const offsets = parseShape(node);
    console.log('\nCone SouthEast length=3:\n' + renderGrid(offsets));
  });

  it('complex composite', () => {
    const node: ShapeNode = {
      kind: 'subtract',
      shapes: [
        {
          kind: 'union',
          shapes: [
            { kind: 'circle', radius: 2 },
            { kind: 'union', shapes: [
                { kind: 'ray', dirs: ['N'], min: 1, max: 4 },
                { kind: 'ray', dirs: ['E'], min: 1, max: 4 },
                { kind: 'ray', dirs: ['S'], min: 1, max: 4 },
                { kind: 'ray', dirs: ['W'], min: 1, max: 4 }
            ]}
          ]
        },
        {
          kind: 'union',
          shapes: [
            { kind: 'circle', radius: 2 },
            { kind: 'ray', dirs: ['N', 'S'], min: 1, max: 3 },
          ]
        }
      ]
    };
    const offsets = parseShape(node);
    console.log('\ncomplex composite\n' + renderGrid(offsets));
  });
});

describe('JsonParser & DSL visual tests (raw JSON)', () => {
    it('json circle r=2', () => {
      const raw = { kind: 'circle', radius: 2 };
      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\n[JSON] Circle radius=2:\n' + renderGrid(offsets));
    });
  
    it('json ray N 1–4', () => {
      const raw = { kind: 'ray', dirs: ['N'], min: 1, max: 4 };
      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\n[JSON] Ray North 1–4:\n' + renderGrid(offsets));
    });
  
    it('json union circle1 + ray E 1–3', () => {
      const raw = {
        kind: 'union',
        shapes: [
          { kind: 'circle', radius: 1 },
          { kind: 'ray', dirs: ['E'], min: 1, max: 3 }
        ]
      };
      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\n[JSON] Union circle r=1 + ray E 1–3:\n' + renderGrid(offsets));
    });
  
    it('json subtract circle2 minus circle1', () => {
      const raw = {
        kind: 'subtract',
        shapes: [
          { kind: 'circle', radius: 2 },
          { kind: 'circle', radius: 1 }
        ]
      };
      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\n[JSON] Subtract circle r=2 minus circle r=1:\n' + renderGrid(offsets));
    });
  
    it('json reflect point (2,3) both', () => {
      const raw = {
        kind: 'reflect',
        axis: 'both',
        shapes: [
          { kind: 'point', delta: { x: 2, y: 3 } }
        ]
      };
      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\n[JSON] Reflect point (2,3) both:\n' + renderGrid(offsets));
    });
  
    it('json complex composite', () => {
      const raw = {
        kind: 'subtract',
        shapes: [
          {
            kind: 'union',
            shapes: [
              { kind: 'circle', radius: 2 },
              {
                kind: 'union',
                shapes: [
                  { kind: 'ray', dirs: ['N'], min: 1, max: 4 },
                  { kind: 'ray', dirs: ['E'], min: 1, max: 4 },
                  { kind: 'ray', dirs: ['S'], min: 1, max: 4 },
                  { kind: 'ray', dirs: ['W'], min: 1, max: 4 }
                ]
              }
            ]
          },
          {
            kind: 'union',
            shapes: [
              { kind: 'circle', radius: 2 },
              { kind: 'ray', dirs: ['N','S'], min: 1, max: 3 }
            ]
          }
        ]
      };
      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\n[JSON] complex composite:\n' + renderGrid(offsets));
    });
  });
