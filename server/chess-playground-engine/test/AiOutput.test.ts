// test/shapeParser.visual.test.ts
import { parseShape, ShapeNode } from '../src/shapes/ShapeParser';
import { parseJson } from '../src/shapes/JsonParser';
import { renderGrid } from './utils';

describe('Raw JSON from ChatGPT', () => {
    it('Flamethrower', () => {

      const raw = {
        "kind": "union",
        "shapes": [
          {
            "kind": "cone",
            "dir": "N",
            "length": 3
          },
          {
            "kind": "cone",
            "dir": "NE",
            "length": 3
          },
          {
            "kind": "cone",
            "dir": "NW",
            "length": 3
          },
          {
            "kind": "circle",
            "radius": 1
          }
        ]
      };
      
      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\nFlamethrower:\n' + renderGrid(offsets));
    });

    it('Gun', () => {
      const raw = {
        "kind": "ray",
        "dirs": ["N"],
        "min": 1,
        "max": 5
      };

      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\nGun:\n' + renderGrid(offsets));
    });

    it('Orbital Strike Cannon', () => {
      const raw = {
        "kind": "union",
        "shapes": [
          {
            "kind": "circle",
            "radius": 4
          },
          {
            "kind": "point",
            "delta": { "x": 0, "y": 0 }
          }
        ]
      };

      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\nOrbital Strike Cannon:\n' + renderGrid(offsets));
    });

    it('Sniper', () => {
      const raw = {
        "kind": "ray",
        "dirs": ["N"],
        "min": 4,
        "max": 8
      };

      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\nSniper:\n' + renderGrid(offsets));
    });

    it('Random Guy', () => {
      const raw = {
        "kind": "circle",
        "radius": 1
      };

      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\nRandom Guy:\n' + renderGrid(offsets));
    });

    it('Shield', () => {
      const raw = {
        "kind": "union",
        "shapes": [
          {
            "kind": "square",
            "size": 1
          },
          {
            "kind": "point",
            "delta": { "x": 0, "y": -1 }
          }
        ]
      };

      const node = parseJson(raw);
      const offsets = parseShape(node);
      console.log('\nShield:\n' + renderGrid(offsets));
    });
});
