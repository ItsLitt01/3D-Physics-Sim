import { WATER, tryMove } from '../grid.js';

export default {
  id: WATER,
  name: 'Water',
  key: '2',
  color: 0x3a7bd5,
  update(x, y, z) {
    tryMove(x, y, z, -1) || tryMove(x, y, z, 0);
  },
};
