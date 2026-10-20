import { STEAM, WATER, EMPTY, H, grid, tryMove } from '../grid.js';

export default {
  id: STEAM,
  name: 'Steam',
  color: 0xe8e8f0,
  update(x, y, z, i) {
    if (y === H - 1) grid[i] = EMPTY;
    else tryMove(x, y, z, 1, WATER) || tryMove(x, y, z, 0, WATER);
  },
};
