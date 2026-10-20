import { BURNING, EMPTY, PLANT, TIP, SEED, grid, life, moved, idx, inBounds } from '../grid.js';

const BURN_TIME = 24;
// Ticks after catching fire before a cell ignites its neighbors; controls how fast fire travels.
const SPREAD_DELAY = 4;

export const isFlammable = t => t === PLANT || t === TIP || t === SEED;

export function setBurning(j) {
  grid[j] = BURNING;
  life[j] = BURN_TIME;
  moved[j] = 1;
}

function spread(x, y, z) {
  for (let dy = -1; dy <= 1; dy++)
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy, nz = z + dz;
        if (!inBounds(nx, ny, nz)) continue;
        const j = idx(nx, ny, nz);
        if (isFlammable(grid[j])) setBurning(j);
      }
}

export default {
  id: BURNING,
  name: 'Burning',
  color: 0xff1a00,
  update(x, y, z, i) {
    life[i]--;
    if (life[i] === BURN_TIME - SPREAD_DELAY) spread(x, y, z);
    if (life[i] === 0) grid[i] = EMPTY;
  },
};
