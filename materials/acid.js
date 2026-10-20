import { ACID, EMPTY, grid, life, moved, idx, inBounds, move } from '../grid.js';

// How many cells one acid particle can dissolve before it's used up (max 255).
const STRENGTH = 200;
// Chance per tick to eat whatever it's touching; lower is slower.
const EAT_CHANCE = 0.3;
const SIDE_CHANCE = 0.25;
const SIDES = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export default {
  id: ACID,
  name: 'Acid',
  key: '5',
  color: 0xc8ff00,
  update(x, y, z, i) {
    let tx = x, ty = y - 1, tz = z;
    if (Math.random() < SIDE_CHANCE) {
      const [dx, dz] = SIDES[(Math.random() * 4) | 0];
      tx = x + dx; ty = y; tz = z + dz;
    }
    if (!inBounds(tx, ty, tz)) return;

    const j = idx(tx, ty, tz);
    const t = grid[j];
    if (t === ACID) return;

    if (t === EMPTY) {
      if (ty < y) move(x, y, z, tx, ty, tz);
      return;
    }
    if (Math.random() >= EAT_CHANCE) return;

    grid[j] = EMPTY;
    life[j] = 0;
    moved[j] = 1;
    if (++life[i] >= STRENGTH) grid[i] = EMPTY;
  },
};
