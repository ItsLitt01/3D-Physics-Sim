import { SEED, WATER, TIP, grid, life, tryMove, touches } from '../grid.js';

export default {
  id: SEED,
  name: 'Seed',
  key: '4',
  color: 0x6b4226,
  update(x, y, z, i) {
    if (!tryMove(x, y, z, -1, WATER) && touches(x, y, z, WATER)) {
      grid[i] = TIP;
      life[i] = 8 + ((Math.random() * 12) | 0);
    }
  },
};
