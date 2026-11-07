// Procedural moon surface shared by the 3D hero and the 2D moonrise.
// Builds a seamless (horizontally wrapping) height field from fractal noise plus craters
// with raised rims, then derives an albedo map and a tangent-space normal map from it.

export type MoonMaps = {
  W: number;
  H: number;
  albedo: Float32Array; // 0..1 per pixel
  nx: Float32Array; // tangent-space normal, per pixel
  ny: Float32Array;
  nz: Float32Array;
};

function hash(ix: number, iy: number, seed: number) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Value noise that wraps every `px` cells along x. */
function noise(x: number, y: number, px: number, seed: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);
  const x0 = ((ix % px) + px) % px;
  const x1 = (x0 + 1) % px;
  const a = hash(x0, iy, seed);
  const b = hash(x1, iy, seed);
  const c = hash(x0, iy + 1, seed);
  const d = hash(x1, iy + 1, seed);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/** Fractal noise at texture coords u∈[0,1), v∈[0,1]; x has twice the cells of y (2:1 map). */
function fbm(u: number, v: number, base: number, octaves: number, seed: number) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    const f = base * 2 ** o;
    sum += amp * noise(u * f * 2, v * f, f * 2, seed + o * 17);
    norm += amp;
    amp *= 0.5;
  }
  return sum / norm;
}

let cache: MoonMaps | null = null;

export function getMoonMaps(W = 1024, H = 512): MoonMaps {
  if (cache && cache.W === W) return cache;
  const N = W * H;
  const height = new Float32Array(N);
  const albedo = new Float32Array(N);

  // Terrain + maria (dark, smooth lowlands).
  for (let y = 0; y < H; y++) {
    const v = y / H;
    for (let x = 0; x < W; x++) {
      const u = x / W;
      const i = y * W + x;
      const terrain = fbm(u, v, 6, 5, 11);
      const mariaN = fbm(u, v, 2, 3, 91);
      const maria = Math.min(1, Math.max(0, (mariaN - 0.5) / 0.12));
      const m = maria * maria * (3 - 2 * maria);
      height[i] = (terrain - 0.5) * 6 * (1 - 0.6 * m) - m * 2;
      const grain = fbm(u, v, 40, 2, 7) - 0.5;
      albedo[i] = 0.8 - 0.3 * m + 0.08 * (terrain - 0.5) + 0.06 * grain;
    }
  }

  // Craters: parabolic bowl, raised rim, faint ejecta. Mostly small, a few large.
  let s = 1234567;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const count = Math.round((W * H) / 600);
  for (let k = 0; k < count; k++) {
    const cx = rnd() * W;
    const cy = H * 0.04 + rnd() * H * 0.92;
    const r = 1 + Math.pow(rnd(), 5.5) * 34;
    const depth = r * 0.13;
    const rim = r * 0.045;
    const young = rnd() < 0.12;
    const reach = r * (young ? 2.6 : 1.6);
    const y0 = Math.max(0, Math.floor(cy - reach));
    const y1 = Math.min(H - 1, Math.ceil(cy + reach));
    for (let y = y0; y <= y1; y++) {
      for (let xx = Math.floor(cx - reach); xx <= Math.ceil(cx + reach); xx++) {
        const dx = xx + 0.5 - cx;
        const dy = y + 0.5 - cy;
        const t = Math.sqrt(dx * dx + dy * dy) / r;
        if (t > reach / r) continue;
        const x = ((xx % W) + W) % W;
        const i = y * W + x;
        if (t < 1) height[i] += depth * (t * t - 1) + rim * t ** 6;
        else height[i] += rim * Math.exp(-(((t - 1) / 0.35) ** 2));
        if (young) albedo[i] += 0.14 * Math.exp(-((t / 1.7) ** 2));
      }
    }
  }

  // Normal map from height gradients.
  const nx = new Float32Array(N);
  const ny = new Float32Array(N);
  const nz = new Float32Array(N);
  const strength = 0.42;
  for (let y = 0; y < H; y++) {
    const ym = Math.max(0, y - 1);
    const yp = Math.min(H - 1, y + 1);
    for (let x = 0; x < W; x++) {
      const xm = (x - 1 + W) % W;
      const xp = (x + 1) % W;
      const dhdx = (height[y * W + xp] - height[y * W + xm]) * strength;
      // Canvas rows grow downward while texture v grows upward.
      const dhdv = (height[ym * W + x] - height[yp * W + x]) * strength;
      const len = Math.sqrt(dhdx * dhdx + dhdv * dhdv + 4);
      const i = y * W + x;
      nx[i] = -dhdx / len;
      ny[i] = -dhdv / len;
      nz[i] = 2 / len;
      albedo[i] = Math.min(1, Math.max(0.15, albedo[i]));
    }
  }

  cache = { W, H, albedo, nx, ny, nz };
  return cache;
}

/** Albedo and normal maps as canvases (for THREE.CanvasTexture). */
export function moonTextureCanvases(m: MoonMaps) {
  const color = document.createElement("canvas");
  const normal = document.createElement("canvas");
  color.width = normal.width = m.W;
  color.height = normal.height = m.H;
  const ci = color.getContext("2d")!.createImageData(m.W, m.H);
  const ni = normal.getContext("2d")!.createImageData(m.W, m.H);
  for (let i = 0; i < m.W * m.H; i++) {
    const a = m.albedo[i] * 255;
    ci.data[i * 4] = a;
    ci.data[i * 4 + 1] = a * 0.995;
    ci.data[i * 4 + 2] = a * 1.02;
    ci.data[i * 4 + 3] = 255;
    ni.data[i * 4] = (m.nx[i] * 0.5 + 0.5) * 255;
    ni.data[i * 4 + 1] = (m.ny[i] * 0.5 + 0.5) * 255;
    ni.data[i * 4 + 2] = (m.nz[i] * 0.5 + 0.5) * 255;
    ni.data[i * 4 + 3] = 255;
  }
  color.getContext("2d")!.putImageData(ci, 0, 0);
  normal.getContext("2d")!.putImageData(ni, 0, 0);
  return { color, normal };
}

/**
 * Software-renders the top `portion` of a lit moon sphere into a canvas — used for the
 * moonrise, where a WebGL context would be overkill.
 */
export function renderMoonSphere(
  m: MoonMaps,
  size: number,
  opts: { portion?: number; light?: [number, number, number]; tint?: [number, number, number]; ambient?: number } = {}
) {
  // Bilinear sample of a per-pixel map (wraps in x, clamps in y).
  const sample = (arr: Float32Array, fx: number, fy: number) => {
    const x0 = Math.floor(fx);
    const y0 = Math.max(0, Math.min(m.H - 2, Math.floor(fy)));
    const tx = fx - x0;
    const ty = Math.max(0, Math.min(1, fy - y0));
    const xa = ((x0 % m.W) + m.W) % m.W;
    const xb = (xa + 1) % m.W;
    const a = arr[y0 * m.W + xa];
    const b = arr[y0 * m.W + xb];
    const c = arr[(y0 + 1) * m.W + xa];
    const d = arr[(y0 + 1) * m.W + xb];
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };
  const portion = opts.portion ?? 1;
  const [lx0, ly0, lz0] = opts.light ?? [-0.25, 0.85, 0.45];
  const ll = Math.hypot(lx0, ly0, lz0);
  const L = [lx0 / ll, ly0 / ll, lz0 / ll];
  const tint = opts.tint ?? [1, 1, 1.04];
  const ambient = opts.ambient ?? 0.04;
  const rows = Math.ceil(size * portion);
  const c = document.createElement("canvas");
  c.width = size;
  c.height = rows;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, rows);
  const rot = 1.3;
  for (let py = 0; py < rows; py++) {
    const Y = 1 - ((py + 0.5) / size) * 2;
    for (let px = 0; px < size; px++) {
      const X = ((px + 0.5) / size) * 2 - 1;
      const r2 = X * X + Y * Y;
      const o = (py * size + px) * 4;
      if (r2 > 1) continue;
      const Z = Math.sqrt(1 - r2);
      // Sample in a frame rotated 90° about the view axis, so the top of the disk shows the
      // equator (undistorted) and the stretched poles sit at the far left/right limbs.
      const sx = -Y;
      const sy = X;
      const lon = Math.atan2(sx, Z) + rot;
      const lat = Math.asin(Math.max(-1, Math.min(1, sy)));
      const fx = (((lon / (2 * Math.PI) + 0.5) % 1) + 1) % 1 * m.W;
      const fy = (0.5 - lat / Math.PI) * m.H;
      const rho = Math.max(1e-4, Math.sqrt(sx * sx + Z * Z));
      const T = [Z / rho, 0, -sx / rho];
      const B = [(-sx * sy) / rho, rho, (-Z * sy) / rho];
      const n0 = sample(m.nx, fx, fy);
      const n1 = sample(m.ny, fx, fy);
      const n2 = sample(m.nz, fx, fy);
      const ax = T[0] * n0 + B[0] * n1 + sx * n2;
      const ay = T[1] * n0 + B[1] * n1 + sy * n2;
      // Rotate the perturbed normal back into view space.
      let NX = ay;
      let NY = -ax;
      let NZ = T[2] * n0 + B[2] * n1 + Z * n2;
      const nl = Math.hypot(NX, NY, NZ) || 1;
      NX /= nl;
      NY /= nl;
      NZ /= nl;
      const lambert = Math.max(0, NX * L[0] + NY * L[1] + NZ * L[2]);
      const shade = sample(m.albedo, fx, fy) * (lambert * 1.2 + ambient);
      // Anti-aliased edge.
      const edge = Math.min(1, (1 - Math.sqrt(r2)) * size * 0.5);
      img.data[o] = Math.min(255, shade * 255 * tint[0]);
      img.data[o + 1] = Math.min(255, shade * 255 * tint[1]);
      img.data[o + 2] = Math.min(255, shade * 255 * tint[2]);
      img.data[o + 3] = 255 * edge;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
