import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { W, H, D, EMPTY, SAND, grid, moved, life, idx, isEmpty } from './grid.js';
import MATERIALS from './materials/index.js';

const byId = [];
const byKey = {};
const COLORS = [];
for (const m of MATERIALS) {
  byId[m.id] = m;
  COLORS[m.id] = new THREE.Color(m.color);
  if (m.key) byKey[m.key] = m;
}

// ---------- Scene ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202028);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 500);
camera.position.set(W * 1.5, H, D * 1.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(W / 2, H / 4, D / 2);
controls.update();

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(1, 2, 1.5);
scene.add(sun);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(W, D),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.set(W / 2 - 0.5, -0.5, D / 2 - 0.5);
scene.add(floor);

const cubes = new THREE.InstancedMesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial(),
  W * H * D
);
cubes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
cubes.frustumCulled = false;
cubes.setColorAt(0, COLORS[SAND]);
cubes.count = 0;
scene.add(cubes);

// ---------- Simulation ----------
let tick = 0;

function step() {
  tick++;
  moved.fill(0);
  for (let y = 0; y < H; y++)
    for (let z = 0; z < D; z++)
      for (let x = 0; x < W; x++) {
        const i = idx(x, y, z);
        const t = grid[i];
        if (t === EMPTY || moved[i]) continue;
        byId[t].update?.(x, y, z, i, tick);
      }
}

// ---------- Rendering ----------
const m = new THREE.Matrix4();

function draw() {
  let n = 0;
  for (let y = 0; y < H; y++)
    for (let z = 0; z < D; z++)
      for (let x = 0; x < W; x++) {
        const t = grid[idx(x, y, z)];
        if (t === EMPTY) continue;
        cubes.setMatrixAt(n, m.makeTranslation(x, y, z));
        cubes.setColorAt(n, COLORS[t]);
        n++;
      }
  cubes.count = n;
  cubes.instanceMatrix.needsUpdate = true;
  cubes.instanceColor.needsUpdate = true;
}

// ---------- Input ----------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let pouring = false;
let material = SAND;

document.getElementById('keys').textContent = Object.values(byKey)
  .map(m => `${m.key} = ${m.name.toLowerCase()}`)
  .join(' · ');

addEventListener('pointermove', e => {
  mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
});
addEventListener('keydown', e => {
  if (e.code === 'Space') pouring = true;
  const picked = byKey[e.key];
  if (picked) {
    material = picked.id;
    document.getElementById('mat').textContent = picked.name;
  }
});
addEventListener('keyup', e => {
  if (e.code === 'Space') pouring = false;
});
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

function pour() {
  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObject(floor)[0];
  if (!hit) return;
  const cx = Math.round(hit.point.x), cz = Math.round(hit.point.z);
  for (let dx = -1; dx <= 1; dx++)
    for (let dz = -1; dz <= 1; dz++) {
      const x = cx + dx, z = cz + dz;
      if (!isEmpty(x, H - 1, z)) continue;
      grid[idx(x, H - 1, z)] = material;
      life[idx(x, H - 1, z)] = 0;
    }
}

// ---------- Loop ----------
const SIM_SPEED = 0.75;
const STEP_TIME = 1 / (60 * SIM_SPEED);
const clock = new THREE.Clock();
let acc = 0;

renderer.setAnimationLoop(() => {
  // Capped so a backgrounded tab doesn't run hundreds of catch-up steps.
  acc = Math.min(acc + clock.getDelta(), STEP_TIME * 4);
  let stepped = false;
  while (acc >= STEP_TIME) {
    if (pouring) pour();
    step();
    acc -= STEP_TIME;
    stepped = true;
  }
  if (stepped) draw();
  renderer.render(scene, camera);
});
