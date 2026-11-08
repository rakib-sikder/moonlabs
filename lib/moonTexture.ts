// Real lunar imagery for the moonrise: NASA LRO colour map + LOLA elevation
// (NASA Scientific Visualization Studio, CGI Moon Kit — public domain).

export const MOON_COLOR_2K = "/moon/moon-color-2k.jpg";
export const MOON_HEIGHT = "/moon/moon-height-1k.jpg";

type Pixels = { W: number; H: number; data: Uint8ClampedArray };
type Normals = { W: number; H: number; nx: Float32Array; ny: Float32Array; nz: Float32Array };
export type MoonMaps = { color: Pixels; normal: Normals };

function loadPixels(src: string): Promise<Pixels> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      resolve({ W: c.width, H: c.height, data: ctx.getImageData(0, 0, c.width, c.height).data });
    };
    img.onerror = reject;
    img.src = src;
  });
}

/** Tangent-space normals from an elevation image (wraps in x). */
function normalsFromHeight(h: Pixels, strength: number): Normals {
  const { W, H, data } = h;
  const nx = new Float32Array(W * H);
  const ny = new Float32Array(W * H);
  const nz = new Float32Array(W * H);
  const at = (x: number, y: number) => data[(y * W + x) * 4] / 255;
  for (let y = 0; y < H; y++) {
    const ym = Math.max(0, y - 1);
    const yp = Math.min(H - 1, y + 1);
    for (let x = 0; x < W; x++) {
      const dhdx = (at((x + 1) % W, y) - at((x - 1 + W) % W, y)) * strength;
      const dhdv = (at(x, ym) - at(x, yp)) * strength; // image rows grow downward, v grows upward
      const len = Math.sqrt(dhdx * dhdx + dhdv * dhdv + 1);
      const i = y * W + x;
      nx[i] = -dhdx / len;
      ny[i] = -dhdv / len;
      nz[i] = 1 / len;
    }
  }
  return { W, H, nx, ny, nz };
}

const cache = new Map<string, Promise<MoonMaps>>();

export function loadMoonMaps(colorSrc: string): Promise<MoonMaps> {
  if (!cache.has(colorSrc)) {
    cache.set(
      colorSrc,
      Promise.all([loadPixels(colorSrc), loadPixels(MOON_HEIGHT)]).then(([color, height]) => ({
        color,
        normal: normalsFromHeight(height, 6),
      }))
    );
  }
  return cache.get(colorSrc)!;
}

/** Bilinear sample at texture coords (u wraps, v clamps), u,v ∈ [0,1]. */
function bilinear(get: (i: number) => number, W: number, H: number, u: number, v: number) {
  const fx = u * W - 0.5;
  const fy = Math.max(0, Math.min(H - 1.001, v * H - 0.5));
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = fx - x0;
  const ty = fy - y0;
  const xa = ((x0 % W) + W) % W;
  const xb = (xa + 1) % W;
  const y1 = Math.min(H - 1, y0 + 1);
  const a = get(y0 * W + xa);
  const b = get(y0 * W + xb);
  const c = get(y1 * W + xa);
  const d = get(y1 * W + xb);
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}

/**
 * Software-renders the top `portion` of a lit moon sphere. The sampling frame is turned
 * 90° about the view axis (unless `upright`) so the undistorted equator crowns the disk;
 * `centerLon` (radians) picks the longitude at the crown (0 = centre of the near side).
 */
export function renderMoonSphere(
  m: MoonMaps,
  size: number,
  opts: { portion?: number; light?: [number, number, number]; ambient?: number; centerLon?: number; upright?: boolean } = {}
) {
  const portion = opts.portion ?? 1;
  const [lx0, ly0, lz0] = opts.light ?? [-0.3, 0.9, 0.35];
  const ll = Math.hypot(lx0, ly0, lz0);
  const L = [lx0 / ll, ly0 / ll, lz0 / ll];
  const ambient = opts.ambient ?? 0.03;
  const upright = opts.upright ?? false;
  const rot = (upright ? 0 : Math.PI / 2) + (opts.centerLon ?? 0);
  const rows = Math.ceil(size * portion);
  const c = document.createElement("canvas");
  c.width = size;
  c.height = rows;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, rows);
  const { color, normal } = m;
  const cd = color.data;

  for (let py = 0; py < rows; py++) {
    const Y = 1 - ((py + 0.5) / size) * 2;
    for (let px = 0; px < size; px++) {
      const X = ((px + 0.5) / size) * 2 - 1;
      const r2 = X * X + Y * Y;
      if (r2 > 1) continue;
      const Z = Math.sqrt(1 - r2);
      // Upright: north is up. Otherwise the frame is turned so the equator crowns the disk.
      const sx = upright ? X : -Y;
      const sy = upright ? Y : X;
      const lon = Math.atan2(sx, Z) + rot;
      const lat = Math.asin(Math.max(-1, Math.min(1, sy)));
      const u = (((lon / (2 * Math.PI) + 0.5) % 1) + 1) % 1;
      const v = 0.5 - lat / Math.PI;

      const rho = Math.max(1e-4, Math.sqrt(sx * sx + Z * Z));
      const T0 = Z / rho;
      const T2 = -sx / rho;
      const B0 = (-sx * sy) / rho;
      const B1 = rho;
      const B2 = (-Z * sy) / rho;
      const n0 = bilinear((i) => normal.nx[i], normal.W, normal.H, u, v);
      const n1 = bilinear((i) => normal.ny[i], normal.W, normal.H, u, v);
      const n2 = bilinear((i) => normal.nz[i], normal.W, normal.H, u, v);
      const ax = T0 * n0 + B0 * n1 + sx * n2;
      const ay = B1 * n1 + sy * n2;
      let NX = upright ? ax : ay;
      let NY = upright ? ay : -ax;
      let NZ = T2 * n0 + B2 * n1 + Z * n2;
      const nl = Math.hypot(NX, NY, NZ) || 1;
      NX /= nl;
      NY /= nl;
      NZ /= nl;
      const lambert = Math.max(0, NX * L[0] + NY * L[1] + NZ * L[2]);
      const k = lambert * 1.15 + ambient;
      const edge = Math.min(1, (1 - Math.sqrt(r2)) * size * 0.5);
      const o = (py * size + px) * 4;
      img.data[o] = Math.min(255, bilinear((i) => cd[i * 4], color.W, color.H, u, v) * k);
      img.data[o + 1] = Math.min(255, bilinear((i) => cd[i * 4 + 1], color.W, color.H, u, v) * k);
      img.data[o + 2] = Math.min(255, bilinear((i) => cd[i * 4 + 2], color.W, color.H, u, v) * k);
      img.data[o + 3] = 255 * edge;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
