import { SAND, WATER, tryMove } from '../grid.js';

export default {
  id: SAND,
  name: 'Sand',
  key: '1',
  color: 0xe2c275,
  update(x, y, z) {
    tryMove(x, y, z, -1, WATER);
  },
};
