export const W = 40, H = 60, D = 40;
export const EMPTY = 0, SAND = 1, WATER = 2, LAVA = 3, STEAM = 4, SEED = 5, PLANT = 6, TIP = 7, BURNING = 8, STONE = 9, ACID = 10;

export const grid = new Uint8Array(W * H * D);
export const moved = new Uint8Array(W * H * D);
// Per-cell counter: remaining growth steps for plant tips, remaining burn ticks for burning cells,
// cells already dissolved for acid.
export const life = new Uint8Array(W * H * D);

export const idx = (x, y, z) => x + W * (z + D * y);
export const inBounds = (x, y, z) => x >= 0 && x < W && y >= 0 && y < H && z >= 0 && z < D;
export const isEmpty = (x, y, z) => inBounds(x, y, z) && grid[idx(x, y, z)] === EMPTY;

export const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function move(x, y, z, nx, ny, nz) {
  const a = idx(x, y, z), b = idx(nx, ny, nz);
  const t = grid[b], l = life[b];
  grid[b] = grid[a]; life[b] = life[a];
  grid[a] = t; life[a] = l;
  moved[a] = 1;
  moved[b] = 1;
}

// `through` is an optional type the particle can swap places with (e.g. sand sinking through water).
function canEnter(x, y, z, through) {
  if (!inBounds(x, y, z)) return false;
  const c = grid[idx(x, y, z)];
  return c === EMPTY || c === through;
}

// dy = -1 falls, dy = 1 rises, dy = 0 spreads sideways.
export function tryMove(x, y, z, dy, through) {
  if (dy !== 0 && canEnter(x, y + dy, z, through)) { move(x, y, z, x, y + dy, z); return true; }
  for (const [dx, dz] of shuffle(DIRS)) {
    if (canEnter(x + dx, y + dy, z + dz, through)) { move(x, y, z, x + dx, y + dy, z + dz); return true; }
  }
  return false;
}

export function touches(x, y, z, type) {
  for (let dy = -1; dy <= 1; dy++)
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy, nz = z + dz;
        if (inBounds(nx, ny, nz) && grid[idx(nx, ny, nz)] === type) return true;
      }
  return false;
}
