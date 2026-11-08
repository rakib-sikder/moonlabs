// Password hashing and token helpers on WebCrypto (works in Workers and Node 20+).

const enc = new TextEncoder();

// Cloudflare Workers caps PBKDF2 at 100,000 iterations, so this is both the floor we want
// and the ceiling the platform allows.
export const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(value: string): Uint8Array {
  const bin = atob(value);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function toBase64Url(bytes: Uint8Array): string {
  return toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Compares two byte arrays without returning early on the first difference. */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  // Lengths are not secret (always 32 bytes for our hashes).
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** URL-safe random token with `bytes` bytes of entropy (default 32). */
export function randomToken(bytes = 32): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

/** Lowercase hex SHA-256 of a string. Tokens are stored only as this hash. */
export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(value));
  return toHex(new Uint8Array(digest));
}

/** base64url SHA-256, used for the PKCE code challenge. */
export async function sha256Base64Url(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(value));
  return toBase64Url(new Uint8Array(digest));
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    length * 8,
  );
  return new Uint8Array(bits);
}

/** Returns `pbkdf2$<iterations>$<salt b64>$<hash b64>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS, HASH_BYTES);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${toBase64(hash)}`;
}

// Used when the account does not exist (or has no password) so a failed sign-in takes about
// as long either way and does not reveal which emails have accounts.
const DUMMY_HASH = `pbkdf2$${PBKDF2_ITERATIONS}$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=`;

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  const parts = (stored ?? DUMMY_HASH).split("$");
  const valid = parts.length === 4 && parts[0] === "pbkdf2";
  const iterations = valid ? Number(parts[1]) : PBKDF2_ITERATIONS;
  if (!Number.isInteger(iterations) || iterations < 1 || iterations > PBKDF2_ITERATIONS) return false;
  let salt: Uint8Array;
  let expected: Uint8Array;
  try {
    salt = fromBase64(valid ? parts[2] : "AAAAAAAAAAAAAAAAAAAAAA==");
    expected = fromBase64(valid ? parts[3] : "");
  } catch {
    return false;
  }
  const actual = await pbkdf2(password, salt, iterations, expected.length || HASH_BYTES);
  const ok = timingSafeEqual(actual, expected);
  return ok && stored != null && valid;
}
