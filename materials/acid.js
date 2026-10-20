import { ACID, EMPTY, grid, life, moved, idx, inBounds, tryMove } from '../grid.js';

// How many cells one acid particle can dissolve before it's used up (max 255).
const STRENGTH = 20;
// Chance per tick to eat a neighbor; lower is slower.
const EAT_CHANCE = 0.3;
const TARGETS = [[0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];

export default {
  id: ACID,
  name: 'Acid',
  key: '5',
  color: 0xc8ff00,
  update(x, y, z, i) {
    if (Math.random() < EAT_CHANCE) {
      const [dx, dy, dz] = TARGETS[(Math.random() * TARGETS.length) | 0];
      const nx = x + dx, ny = y + dy, nz = z + dz;
      if (inBounds(nx, ny, nz)) {
        const j = idx(nx, ny, nz);
        const t = grid[j];
        if (t !== EMPTY && t !== ACID) {
          grid[j] = EMPTY;
          life[j] = 0;
          moved[j] = 1;
          if (++life[i] >= STRENGTH) { grid[i] = EMPTY; life[i] = 0; }
          return;
        }
      }
    }
    tryMove(x, y, z, -1) || tryMove(x, y, z, 0);
  },
};
