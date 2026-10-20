import { LAVA, WATER, STEAM, STONE, EMPTY, grid, moved, idx, inBounds, tryMove } from '../grid.js';
import { isFlammable, setBurning } from './burning.js';

// Water hardens into stone and gives off a puff of steam above it.
function quench(x, y, z) {
  const j = idx(x, y, z);
  grid[j] = STONE;
  moved[j] = 1;
  if (!inBounds(x, y + 1, z)) return;
  const above = idx(x, y + 1, z);
  if (grid[above] === EMPTY || grid[above] === WATER) {
    grid[above] = STEAM;
    moved[above] = 1;
  }
}

// Turns nearby water into stone and steam, and sets nearby plants on fire.
function heat(x, y, z) {
  for (let dy = -1; dy <= 1; dy++)
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy, nz = z + dz;
        if (!inBounds(nx, ny, nz)) continue;
        const j = idx(nx, ny, nz);
        if (grid[j] === WATER) quench(nx, ny, nz);
        else if (isFlammable(grid[j])) setBurning(j);
      }
}

export default {
  id: LAVA,
  name: 'Lava',
  key: '3',
  color: 0xff4a10,
  update(x, y, z, i, tick) {
    heat(x, y, z);
    tryMove(x, y, z, -1) || (tick % 3 === 0 && tryMove(x, y, z, 0));
  },
};
