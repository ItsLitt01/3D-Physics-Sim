import { PLANT, TIP, EMPTY, WATER, DIRS, grid, life, moved, idx, inBounds } from '../grid.js';

const GROW_EVERY = 6;

const canGrowInto = (x, y, z) =>
  inBounds(x, y, z) && (grid[idx(x, y, z)] === EMPTY || grid[idx(x, y, z)] === WATER);

function sprout(x, y, z, l) {
  const j = idx(x, y, z);
  grid[j] = TIP;
  life[j] = l;
  moved[j] = 1;
}

function grow(x, y, z, i) {
  if (life[i] === 0) { grid[i] = PLANT; return; }

  const [dx, dz] = Math.random() < 0.3 ? DIRS[(Math.random() * 8) | 0] : [0, 0];
  if (!canGrowInto(x + dx, y + 1, z + dz)) return;
  sprout(x + dx, y + 1, z + dz, life[i] - 1);

  if (Math.random() < 0.15) {
    const [bx, bz] = DIRS[(Math.random() * 8) | 0];
    if (canGrowInto(x + bx, y + 1, z + bz)) sprout(x + bx, y + 1, z + bz, life[i] >> 1);
  }
  grid[i] = PLANT;
}

export const plant = {
  id: PLANT,
  name: 'Plant',
  color: 0x2e8b3a,
};

export const tip = {
  id: TIP,
  name: 'Plant tip',
  color: 0x6fdc5f,
  update(x, y, z, i, tick) {
    if (tick % GROW_EVERY === 0) grow(x, y, z, i);
  },
};
